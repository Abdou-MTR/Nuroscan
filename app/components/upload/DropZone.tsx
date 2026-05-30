'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DropZoneProps {
  onUploadComplete: (imageUrl: string) => void
}

export function DropZone({ onUploadComplete }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize the Supabase client
  const supabase = createClient()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG or PNG).')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // 1. Create a unique file name to prevent overwriting
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // 2. Upload the file to the 'mri-scans' Supabase bucket
      const { error: uploadError } = await supabase.storage
        .from('mri-scans')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('mri-scans')
        .getPublicUrl(filePath)

      // 4. Pass the URL back up to the parent component so it can be sent to the Flask AI backend
      onUploadComplete(publicUrlData.publicUrl)
      
    } catch (err: any) {
      console.error('Upload failed:', err)
      setError(err.message || 'Failed to upload image.')
    } finally {
      setIsUploading(false)
      setIsDragging(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging 
            ? 'border-sky-500 bg-sky-50/50' 
            : 'border-sky-200 bg-white/40 hover:bg-white/60'
        } backdrop-blur-md shadow-sm`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center text-center space-y-4">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-sky-800 font-medium">Uploading to secure storage...</p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-sky-100 text-sky-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  JPG or PNG (Max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
}