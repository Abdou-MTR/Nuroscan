from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import io
import os
from PIL import Image

# Import TensorFlow
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("Warning: TensorFlow not found. Please run 'pip install tensorflow'")

app = FastAPI(title="NeuroScan AI Model API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "brain_tumor_resnet50v2_v5.keras"
MODEL_PATH_ALT = "../brain_tumor_resnet50v2_v5.keras"
# Adjust the classes here to match the exact output of your model
CLASSES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

model = None

def load_model():
    global model
    if not TF_AVAILABLE:
        return
    
    # Try primary path first, then fallback
    path = MODEL_PATH if os.path.exists(MODEL_PATH) else MODEL_PATH_ALT
        
    if os.path.exists(path):
        print(f"Loading model from {path}...")
        try:
            model = tf.keras.models.load_model(path)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
    else:
        print(f"Warning: Model file not found. Prediction will return mock data.")

# Load the model at startup
@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"status": "API is running"}

from pydantic import BaseModel
import requests

class PredictRequest(BaseModel):
    imageUrl: str

import base64
import cv2

def get_last_spatial_layer_name(m):
    for layer in m.layers:
        if layer.name == 'post_relu':
            return 'post_relu'
    for layer in reversed(m.layers):
        if hasattr(layer, 'output_shape') and len(layer.output_shape) == 4:
            return layer.name
    return None

def make_gradcam_heatmap(img_array, m, last_conv_layer_name, pred_index=None):
    grad_model = tf.keras.models.Model(
        [m.inputs], [m.get_layer(last_conv_layer_name).output, m.output]
    )
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.math.reduce_max(heatmap)
    if max_val > 0:
        heatmap = heatmap / max_val
    return heatmap.numpy()

def overlay_heatmap(original_img_array, heatmap, alpha=0.5):
    heatmap = np.uint8(255 * heatmap)
    jet_heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    jet_heatmap = cv2.cvtColor(jet_heatmap, cv2.COLOR_BGR2RGB)
    jet_heatmap = cv2.resize(jet_heatmap, (original_img_array.shape[1], original_img_array.shape[0]))
    
    superimposed_img = jet_heatmap * alpha + original_img_array * (1 - alpha)
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)
    
    pil_img = Image.fromarray(superimposed_img)
    buffered = io.BytesIO()
    pil_img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{img_str}"

@app.post("/predict")
async def predict(request: PredictRequest):
    # Download image from URL
    try:
        response = requests.get(request.imageUrl)
        response.raise_for_status()
        contents = response.content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download image: {e}")
        
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    original_img_array = np.array(image)
    
    # Preprocess image (The model expects 299x299)
    img_array = np.array(image.resize((299, 299)))
    
    heatmap_url = None
    
    if model is not None and TF_AVAILABLE:
        # ResNet50V2 specific preprocessing
        img_array = tf.keras.applications.resnet_v2.preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)
        
        preds = model.predict(img_array)[0]
        class_idx = np.argmax(preds)
        
        # Grad-CAM
        try:
            layer_name = get_last_spatial_layer_name(model)
            if layer_name:
                heatmap = make_gradcam_heatmap(img_array, model, layer_name, class_idx)
                heatmap_url = overlay_heatmap(original_img_array, heatmap, alpha=0.5)
        except Exception as e:
            print("Grad-CAM Error:", e)
    else:
        # Return mock data if the model isn't configured yet
        print("Using mock prediction")
        preds = [0.05, 0.85, 0.05, 0.05]

    confidence = float(np.max(preds)) * 100
    class_idx = np.argmax(preds)
    diagnosis = CLASSES[class_idx]
    
    probabilities = {CLASSES[i]: float(preds[i]) * 100 for i in range(len(CLASSES))}

    return {
        "primaryDiagnosis": diagnosis,
        "confidence": round(confidence, 2),
        "probabilities": probabilities,
        "heatmapUrl": heatmap_url
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
