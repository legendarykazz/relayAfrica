"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, XCircle, Search } from "lucide-react";

type VerificationStatus = "VERIFIED" | "MISSING" | "FAILED" | "IDLE" | "LOADING";

export default function DomainChecker() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDomain = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch("/api/domain/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer test_api_key_123`
        },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("DNS Check Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "VERIFIED": return <CheckCircle2 size={18} style={{ color: '#10b981' }} />;
      case "FAILED": return <XCircle size={18} style={{ color: '#ef4444' }} />;
      case "MISSING": return <AlertCircle size={18} style={{ color: '#f59e0b' }} />;
      default: return null;
    }
  };

  return (
    <div className="panel glass">
      <h3 className="panel-title">Infrastructure Health</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Verify SPF, DKIM, and DMARC records for your domain.</p>
      
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Enter sender domain..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="input-styled"
            style={{ paddingLeft: '2.8rem' }}
          />
        </div>
        <button
          onClick={checkDomain}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Analyzing..." : "Check Domain"}
        </button>
      </div>

      {(results || loading) && (
        <div className="animate-fade">
          <div className="status-row glass" style={{ marginBottom: '0.75rem', borderRadius: '0.75rem' }}>
            <span style={{ fontWeight: 500, color: '#f8fafc' }}>SPF Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: results?.spf === "VERIFIED" ? '#10b981' : '#ef4444' }}>
                {loading ? "..." : results?.spf === "VERIFIED" ? "Authenticated" : "Not Found"}
              </span>
              {loading ? <Loader2 size={18} className="animate-spin" style={{ color: '#6366f1' }} /> : getStatusIcon(results?.spf)}
            </div>
          </div>
          <div className="status-row glass" style={{ marginBottom: '0.75rem', borderRadius: '0.75rem' }}>
            <span style={{ fontWeight: 500, color: '#f8fafc' }}>DKIM Signature</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <span style={{ fontSize: '0.85rem', color: results?.dkim === "VERIFIED" ? '#10b981' : '#ef4444' }}>
                {loading ? "..." : results?.dkim === "VERIFIED" ? "Valid (default)" : "Invalid"}
              </span>
              {loading ? <Loader2 size={18} className="animate-spin" style={{ color: '#6366f1' }} /> : getStatusIcon(results?.dkim)}
            </div>
          </div>
          <div className="status-row glass" style={{ borderRadius: '0.75rem' }}>
            <span style={{ fontWeight: 500, color: '#f8fafc' }}>DMARC Policy</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <span style={{ fontSize: '0.85rem', color: results?.dmarc === "VERIFIED" ? '#10b981' : '#ef4444' }}>
                {loading ? "..." : results?.dmarc === "VERIFIED" ? "Enforced" : "None"}
              </span>
              {loading ? <Loader2 size={18} className="animate-spin" style={{ color: '#6366f1' }} /> : getStatusIcon(results?.dmarc)}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
