"use client";

import { useState } from "react";
import "./contact.css";

export function ContactSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.firstName.trim()) newErrors.firstName = true;
    if (!form.lastName.trim()) newErrors.lastName = true;
    if (!form.email.trim()) newErrors.email = true;
    if (!form.subject.trim()) newErrors.subject = true;
    if (!form.message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 2000);
      return;
    }

    setIsSubmitted(true);
  };

  const getErrorStyle = (field: string) => {
    return errors[field]
      ? { borderColor: "rgba(239,68,68,0.5)", boxShadow: "0 0 0 3px rgba(239,68,68,0.08)" }
      : {};
  };

  return (
    <section id="contact">
      {/* Orbs & crystals */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="crystal" style={{ width: 90, height: 90, top: "15%", left: "5%", opacity: 0.4 }}></div>
      <div className="crystal" style={{ width: 50, height: 50, top: "60%", right: "8%", opacity: 0.3 }}></div>
      <div className="crystal" style={{ width: 32, height: 32, bottom: "15%", left: "40%", opacity: 0.35 }}></div>

      {/* Header */}
      <div className="page-top">
        <div className="screen-tag">
          <span className="screen-tag-dot"></span>
          Get In Touch
        </div>
        <h1 className="page-h1">Contact <span>Our Team</span></h1>
        <p className="page-sub">Have a question about NeuroScan AI? Reach out directly — we're here to help.</p>
      </div>

      {/* Layout */}
      <div className="contact-layout">
        
        {/* Left: contact cards */}
        <div className="contact-cards">
          <a className="glass-sm contact-card fade-up" href="https://wa.me/213783321446" target="_blank" rel="noopener noreferrer">
            <div className="card-icon-wrap icon-whatsapp">
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.964-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.5 9.5s.5-1 1.5-1 2 1 2 1-.5 2-1.5 3S8 14 8 14s2 2.5 4 3.5 3-1 3-1"/></svg>
            </div>
            <div className="card-body">
              <div className="card-label">WhatsApp</div>
              <div className="card-name">Abderrahmane Metiri</div>
              <div className="card-value">+213 783 321 446</div>
            </div>
            <span className="card-action action-green">
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              Message
            </span>
          </a>

          <a className="glass-sm contact-card fade-up" href="mailto:metiriabdou@gmail.com">
            <div className="card-icon-wrap icon-email">
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            </div>
            <div className="card-body">
              <div className="card-label">Email</div>
              <div className="card-name">Send a Message</div>
              <div className="card-value">metiriabdou@gmail.com</div>
            </div>
            <span className="card-action action-blue">
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              Send
            </span>
          </a>

          <a className="glass-sm contact-card fade-up" href="tel:0783321446">
            <div className="card-icon-wrap icon-phone">
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            </div>
            <div className="card-body">
              <div className="card-label">Phone</div>
              <div className="card-name">Call Us Directly</div>
              <div className="card-value">07 83 32 14 46</div>
            </div>
            <span className="card-action action-indigo">
              <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              Call
            </span>
          </a>
        </div>

        {/* Right: message form */}
        <div className="glass form-card">
          {!isSubmitted ? (
            <div>
              <div className="form-header">
                <div className="form-title">Send a Message</div>
                <div className="form-subtitle">Fill out the form below and we'll get back to you shortly.</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ahmed"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    style={getErrorStyle("firstName")}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Karim"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    style={getErrorStyle("lastName")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={getErrorStyle("email")}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Question about NeuroScan AI…"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={getErrorStyle("subject")}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your question or request…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={getErrorStyle("message")}
                ></textarea>
              </div>

              <button className="btn-submit" onClick={handleSubmit}>
                <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
                Send Message
              </button>
            </div>
          ) : (
            <div className="success-state">
              <div className="success-icon">
                <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div className="success-title">Message Sent!</div>
              <div className="success-sub">Thanks for reaching out. We'll get back to you as soon as possible.</div>
            </div>
          )}
        </div>

      </div>

      {/* Availability strip */}
      <div className="availability">
        <div className="avail-left">
          <div className="avail-dot-wrap"><div className="avail-dot"></div></div>
          <span className="avail-text"><strong>Available Now</strong> — Typical response time under 2 hours</span>
        </div>
        <div className="avail-hours">
          <div className="avail-item">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Sun – Thu · 8 AM – 6 PM
          </div>
          <div className="avail-item">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            Algeria (GMT+1)
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div className="contact-footer">
        NeuroScan AI · For informational use only · Not a substitute for professional medical diagnosis
      </div>

    </section>
  );
}
