import { useState } from "react";
import { Mail, Activity, Send, ShieldCheck, Loader2 } from "lucide-react";

export default function MessagingSandbox({ apiKey }: { apiKey: string }) {
  const [channel, setChannel] = useState<"email" | "sms" | "whatsapp">("email");
  const [mode, setMode] = useState<"direct" | "otp">("direct");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleSend = async () => {
    if (!to) return setFeedback({ type: "error", msg: "Recipient is required" });
    setLoading(true);
    setFeedback(null);

    try {
      if (mode === "direct") {
        let endpoint = "/api/send";
        let payload: any = { to, subject: subject || "Test", html: content || "Hello from Relay Africa!" };
        
        if (channel === "sms") {
          endpoint = "/api/sms";
          payload = { to, message: content || "Hello from Relay Africa SMS!" };
        } else if (channel === "whatsapp") {
          endpoint = "/api/whatsapp";
          payload = { to, message: content || "Hello from Relay Africa WhatsApp!" };
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify(payload),
        });
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setFeedback({ type: "success", msg: `Message queued for delivery! (ID: ${data.logId || 'N/A'})` });

      } else {
        // OTP Mode - Request
        if (!otpSent) {
          const res = await fetch("/api/otp-request", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ to, channel }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setOtpSent(true);
          setFeedback({ type: "success", msg: `OTP requested successfully via ${channel}. Check the device.` });
        } else {
           // OTP Verify
           if (!otpCode) return setFeedback({ type: "error", msg: "Please enter the code" });
           const res = await fetch("/api/otp/verify", {
             method: "POST",
             headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
             body: JSON.stringify({ to, code: otpCode }),
           });
           const data = await res.json();
           if (data.error) throw new Error(data.error);
           setFeedback({ type: "success", msg: `OTP Verified! Authentication successful.` });
        }
      }
    } catch (e: any) {
      setFeedback({ type: "error", msg: e.message || "Failed to process request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      <h1 className="page-title">Messaging Sandbox</h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        Simulate real-time message delivery and 2FA authentication flows across all channels.
      </p>

      <div style={{ display: "flex", gap: "2rem", flexDirection: "row", flexWrap: "wrap" }}>
        {/* Settings Panel */}
        <div className="panel glass" style={{ flex: "1 1 300px", alignSelf: "flex-start" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.5rem", fontWeight: 600 }}>Configuration</h3>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>API Mode</label>
            <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.03)", padding: "0.3rem", borderRadius: "0.5rem" }}>
              <button 
                onClick={() => { setMode("direct"); setFeedback(null); }}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "0.3rem", fontSize: "0.85rem", transition: "all 0.2s",
                background: mode === "direct" ? "rgba(255,255,255,0.1)" : "transparent",
                color: mode === "direct" ? "#fff" : "#94a3b8", border: "none", cursor: "pointer" }}
              >
                Direct Message
              </button>
              <button 
                onClick={() => { setMode("otp"); setFeedback(null); setOtpSent(false); }}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "0.3rem", fontSize: "0.85rem", transition: "all 0.2s",
                background: mode === "otp" ? "rgba(255,255,255,0.1)" : "transparent",
                color: mode === "otp" ? "#fff" : "#94a3b8", border: "none", cursor: "pointer" }}
              >
                OTP Verification
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Channel</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { id: "email", label: "Email", icon: Mail, color: "#6366f1" },
                { id: "sms", label: "SMS", icon: Activity, color: "#10b981" },
                { id: "whatsapp", label: "WhatsApp", icon: Send, color: "#ec4899" }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id as any)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem 1rem",
                    borderRadius: "0.5rem", background: channel === c.id ? `${c.color}15` : "rgba(255,255,255,0.02)",
                    border: channel === c.id ? `1px solid ${c.color}` : "1px solid rgba(255,255,255,0.05)",
                    color: channel === c.id ? "#fff" : "#94a3b8", cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <c.icon size={18} color={channel === c.id ? c.color : "#64748b"} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="panel glass" style={{ flex: "2 1 400px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.5rem", fontWeight: 600 }}>Payload & Execution</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
                Recipient {channel === "email" ? "Email Address" : "Phone Number (with country code)"}
              </label>
              <input
                type={channel === "email" ? "email" : "tel"}
                className="input-styled"
                placeholder={channel === "email" ? "user@example.com" : "+2348000000000"}
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </div>

            {mode === "direct" && (
              <>
                {channel === "email" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Subject</label>
                    <input type="text" className="input-styled" placeholder="Hello from Relay Africa!" value={subject} onChange={e => setSubject(e.target.value)} />
                  </div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Message Body</label>
                  <textarea 
                    className="input-styled" 
                    rows={4} 
                    placeholder="Enter your message..." 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </>
            )}

            {mode === "otp" && otpSent && (
              <div style={{ background: "rgba(99, 102, 241, 0.1)", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#a5b4fc", marginBottom: "0.5rem" }}>Verification Code</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="text"
                    className="input-styled"
                    placeholder="123456"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    maxLength={6}
                    style={{ fontSize: "1.2rem", letterSpacing: "4px", textAlign: "center", fontFamily: "monospace" }}
                  />
                </div>
              </div>
            )}

            {feedback && (
              <div style={{ 
                padding: "1rem", borderRadius: "0.5rem", fontSize: "0.9rem",
                background: feedback.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: feedback.type === "success" ? "#34d399" : "#f87171",
                border: `1px solid ${feedback.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
              }}>
                {feedback.msg}
              </div>
            )}

            <button 
              className="btn btn-primary" 
              onClick={handleSend}
              disabled={loading}
              style={{ padding: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : mode === "otp" && otpSent ? <ShieldCheck size={20} /> : <Send size={20} />}
              {loading ? "Processing..." : mode === "otp" ? (otpSent ? "Verify Code" : "Request OTP") : "Send Message"}
            </button>
            
            {mode === "otp" && otpSent && (
              <button 
                onClick={() => { setOtpSent(false); setOtpCode(""); setFeedback(null); }}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}
              >
                Reset Flow
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
