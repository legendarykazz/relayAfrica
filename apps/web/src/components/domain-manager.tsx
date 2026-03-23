"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, XCircle, Search, Plus, Globe, ShieldCheck, Copy, Check, Trash2, ArrowRight, ExternalLink, ArrowLeft, Activity, Info } from "lucide-react";

type Domain = {
  id: string;
  name: string;
  spfStatus: string;
  dkimStatus: string;
  dmarcStatus: string;
  verifiedAt: string | null;
};

export default function DomainManager({ apiKey }: { apiKey: string }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [registering, setRegistering] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const sanitizeDomain = (domain: string) => {
    return domain.replace(/^(https?:\/\/)/, "").replace(/\/$/, "").trim();
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domain", {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      const data = await res.json();
      setDomains(data);
    } catch (error) {
      console.error("Fetch Domains Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const registerDomain = async () => {
    const sanitized = sanitizeDomain(newDomain);
    if (!sanitized) return;
    
    setRegistering(true);
    setError(null);
    try {
      const res = await fetch("/api/domain", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ name: sanitized }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setDomains([...domains, data]);
        setNewDomain("");
        setSelectedDomain(data);
      } else {
        setError(data.error || "Failed to register domain");
      }
    } catch (error) {
      setError("Network error. Is the API server running?");
      console.error("Register Domain Error:", error);
    } finally {
      setRegistering(false);
    }
  };

  const verifyDomain = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/domain/${id}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      const updated = await res.json();
      setDomains(domains.map(d => d.id === id ? updated : d));
      if (selectedDomain?.id === id) setSelectedDomain(updated);
    } catch (error) {
      console.error("Verify Domain Error:", error);
    } finally {
      setVerifyingId(null);
    }
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("Are you sure you want to delete this domain?")) return;
    try {
      await fetch(`/api/domain/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      setDomains(domains.filter(d => d.id !== id));
      if (selectedDomain?.id === id) setSelectedDomain(null);
    } catch (error) {
      console.error("Delete Domain Error:", error);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllRecords = () => {
    if (!selectedDomain) return;
    const sanitizedName = sanitizeDomain(selectedDomain.name);
    const records = [
      `SPF: ${sanitizedName} TXT "v=spf1 include:relay.africa ~all"`,
      `DKIM: default._domainkey.${sanitizedName} TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN..."`,
      `DMARC: _dmarc.${sanitizedName} TXT "v=DMARC1; p=none;"`
    ].join("\n");
    navigator.clipboard.writeText(records);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (loading) return (
    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={32} color="#6366f1" />
    </div>
  );

  return (
    <div className="animate-fade">
      {!selectedDomain ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Registration Box */}
          <div className="panel glass" style={{ padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
             <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.25rem' }}>Add New Sender Domain</h2>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem' }}>Verify your domain to send authenticated emails from custom addresses.</p>
             <div style={{ display: 'flex', gap: '1.25rem' }}>
                <input 
                  type="text" 
                  placeholder="e.g. yourcompany.com" 
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="input-styled" 
                  style={{ fontSize: '0.9rem', flex: 1, padding: '0.7rem 1rem' }}
                />
                <button 
                  onClick={registerDomain}
                  disabled={registering}
                  className="btn btn-primary" 
                  style={{ padding: '0 1.5rem', borderRadius: 'var(--radius-lg)', fontWeight: 800, fontSize: '0.85rem' }}
                >
                   {registering ? <Loader2 className="animate-spin" size={18} /> : "Register"}
                </button>
             </div>
             {error && (
               <div className="animate-fade" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                  <AlertCircle size={16} /> {error}
               </div>
             )}
          </div>

          {/* Domain List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
             {domains.length > 0 ? domains.map(d => (
               <div key={d.id} className="panel glass animate-fade" style={{ cursor: 'pointer', transition: '0.2s', border: d.verifiedAt ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)' }} onClick={() => setSelectedDomain(d)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.6rem', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '0.8rem', color: 'var(--primary)' }}><Globe size={20} /></div>
                        <div>
                           <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{d.name}</h3>
                           <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Check Required</span>
                        </div>
                     </div>
                     <div className={`status-pill ${d.verifiedAt ? 'status-sent' : 'status-pending'}`}>
                        {d.verifiedAt ? "Authenticated" : "Pending"}
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                     <button className="btn glass" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); setSelectedDomain(d); }}>View Setup</button>
                     <button className="btn-icon glass" style={{ padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); deleteDomain(d.id); }}><Trash2 size={14} color="#ef4444" /></button>
                  </div>
               </div>
             )) : (
               <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: '1.5rem', border: '1px dashed var(--border)' }}>
                  <ShieldCheck size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No domains registered</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Register your first domain to start sending authenticated mail.</p>
               </div>
             )}
          </div>
        </div>
      ) : (
        <div className="animate-fade">
           <button onClick={() => setSelectedDomain(null)} className="btn glass" style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', borderRadius: '0.8rem' }}>
              <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Domains
           </button>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {/* Domain Identity Header */}
                 <div className="panel glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <Globe size={18} color="var(--primary)" />
                          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{sanitizeDomain(selectedDomain.name)}</h1>
                       </div>
                       <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active configuration for authenticated mail delivery.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                       <button 
                         onClick={copyAllRecords}
                         className="btn glass"
                         style={{ padding: '0.6rem 1rem', borderRadius: '0.8rem', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                       >
                         {copiedAll ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                         {copiedAll ? "Copied" : "Copy All"}
                       </button>
                       <button 
                         onClick={() => verifyDomain(selectedDomain.id)}
                         disabled={verifyingId === selectedDomain.id}
                         className={`btn ${selectedDomain.verifiedAt ? 'btn-secondary' : 'btn-primary'}`}
                         style={{ padding: '0.6rem 1.25rem', borderRadius: '0.8rem', fontWeight: 900, fontSize: '0.8rem', boxShadow: selectedDomain.verifiedAt ? 'none' : '0 0 15px rgba(99, 102, 241, 0.3)' }}
                       >
                          {verifyingId === selectedDomain.id ? <Loader2 className="animate-spin" size={16} /> : selectedDomain.verifiedAt ? "Re-verify" : "Verify Records"}
                       </button>
                    </div>
                 </div>

                 {/* DNS Records List - Higher Density */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { 
                        type: 'TXT (SPF)', 
                        host: sanitizeDomain(selectedDomain.name), 
                        value: 'v=spf1 include:relay.africa ~all', 
                        status: selectedDomain.spfStatus,
                        desc: 'Authorizes delivery for this domain.'
                      },
                      { 
                        type: 'TXT (DKIM)', 
                        host: `default._domainkey.${sanitizeDomain(selectedDomain.name)}`, 
                        value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN...', 
                        status: selectedDomain.dkimStatus,
                        desc: 'Prevents email spoofing.'
                      },
                      { 
                        type: 'TXT (DMARC)', 
                        host: `_dmarc.${sanitizeDomain(selectedDomain.name)}`, 
                        value: 'v=DMARC1; p=none;', 
                        status: selectedDomain.dmarcStatus,
                        desc: 'Policy for authentication failures.'
                      }
                    ].map((record, i) => (
                      <div key={record.type} className="panel glass animate-fade" style={{ animationDelay: `${i * 0.1}s`, padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 100px', minWidth: '100px' }}>
                            <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{record.type}</span>
                            <div className={`status-pill ${record.status === 'VERIFIED' ? 'status-sent' : 'status-pending'}`} style={{ marginTop: '0.2rem', scale: '0.85', transformOrigin: 'left center', width: 'fit-content' }}>
                               {record.status}
                            </div>
                         </div>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '3 1 200px', minWidth: 0 }}>
                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem 0.75rem', borderRadius: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>HOSTNAME</span>
                                  <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{record.host}</code>
                               </div>
                               <button onClick={() => copyToClipboard(record.host, record.type + '-host')} className="btn-icon" style={{ background: 'none', border: 'none' }}><Copy size={12} color={copiedKey === record.type + '-host' ? '#10b981' : 'var(--text-muted)'} /></button>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem 0.75rem', borderRadius: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>VALUE</span>
                                  <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.value}</code>
                               </div>
                               <button onClick={() => copyToClipboard(record.value, record.type + '-val')} className="btn-icon" style={{ background: 'none', border: 'none' }}><Copy size={12} color={copiedKey === record.type + '-val' ? '#10b981' : 'var(--text-muted)'} /></button>
                            </div>
                         </div>

                         <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3', flex: '1 1 120px', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border)' }}>
                            {record.desc}
                         </div>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Sidebar Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div className="panel glass" style={{ border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(50px)', opacity: 0.3 }}></div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Activity size={18} color="var(--primary)" /> Infrastructure Health
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                       <div style={{ fontSize: '2.2rem', fontWeight: 900, color: selectedDomain.verifiedAt ? '#10b981' : 'var(--primary)', lineHeight: 1 }}>
                          {selectedDomain.verifiedAt ? "100" : "30"}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
                       </div>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                       <div style={{ width: selectedDomain.verifiedAt ? '100%' : '30%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{selectedDomain.verifiedAt ? "Your infrastructure is optimized for enterprise-grade delivery." : "Authenticated domains have 3x higher inbox placement."}</p>
                 </div>
                 
                 <div className="panel glass">
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Info size={18} color="var(--primary)" /> Need Help?
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>DNS propagation can take up to 48 hours. If verification fails, ensure there are no trailing spaces.</p>
                    <a href="#" className="btn glass" style={{ width: '100%', fontSize: '0.8rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', padding: '0.6rem' }}>Read DNS Guide <ExternalLink size={14} /></a>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        .status-pill {
          padding: 0.2rem 0.6rem;
          border-radius: 1rem;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-sent { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
      `}</style>
    </div>
  );
}
