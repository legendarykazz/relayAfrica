"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, XCircle, Search, Plus, Globe, ShieldCheck, Copy, Check, Trash2, ArrowRight, ExternalLink, ArrowLeft } from "lucide-react";

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
    if (!newDomain) return;
    setRegistering(true);
    try {
      const res = await fetch("/api/domain", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ name: newDomain }),
      });
      if (res.ok) {
        const domain = await res.json();
        setDomains([...domains, domain]);
        setNewDomain("");
        setSelectedDomain(domain);
      }
    } catch (error) {
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
          <div className="panel glass" style={{ padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--primary)' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Add New Sender Domain</h2>
             <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Verify your domain to send authenticated emails from custom addresses.</p>
             <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="e.g. yourcompany.com" 
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="input-styled" 
                  style={{ fontSize: '1.1rem', flex: 1 }}
                />
                <button 
                  onClick={registerDomain}
                  disabled={registering}
                  className="btn btn-primary" 
                  style={{ padding: '0 2.5rem', borderRadius: '1rem', fontWeight: 900 }}
                >
                   {registering ? <Loader2 className="animate-spin" size={20} /> : "Register Domain"}
                </button>
             </div>
          </div>

          {/* Domain List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
             {domains.length > 0 ? domains.map(d => (
               <div key={d.id} className="panel glass animate-fade" style={{ cursor: 'pointer', transition: '0.2s', border: d.verifiedAt ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)' }} onClick={() => setSelectedDomain(d)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem' }}><Globe size={20} /></div>
                        <div>
                           <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{d.name}</h3>
                           <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status Check Required</span>
                        </div>
                     </div>
                     <div className={`status-pill ${d.verifiedAt ? 'status-sent' : 'status-pending'}`}>
                        {d.verifiedAt ? "Authenticated" : "Pending"}
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                     <button className="btn glass" style={{ flex: 1, fontSize: '0.8rem', padding: '0.6rem' }} onClick={(e) => { e.stopPropagation(); setSelectedDomain(d); }}>View Setup</button>
                     <button className="btn-icon glass" style={{ padding: '0.6rem' }} onClick={(e) => { e.stopPropagation(); deleteDomain(d.id); }}><Trash2 size={16} color="#ef4444" /></button>
                  </div>
               </div>
             )) : (
               <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <ShieldCheck size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No domains registered</h3>
                  <p style={{ color: '#64748b' }}>Register your first domain to start sending authenticated mail.</p>
               </div>
             )}
          </div>
        </div>
      ) : (
        <div className="animate-fade">
           <button onClick={() => setSelectedDomain(null)} className="btn glass" style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', borderRadius: '0.8rem' }}>
              <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Domains
           </button>

           <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 350px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 {/* Domain Identity Header */}
                 <div className="panel glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>{selectedDomain.name}</h1>
                       <p style={{ color: '#94a3b8' }}>Configuration for sending authenticated mail.</p>
                    </div>
                    <button 
                      onClick={() => verifyDomain(selectedDomain.id)}
                      disabled={verifyingId === selectedDomain.id}
                      className={`btn ${selectedDomain.verifiedAt ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 900 }}
                    >
                       {verifyingId === selectedDomain.id ? <Loader2 className="animate-spin" size={20} /> : "Verify DNS Records"}
                    </button>
                 </div>

                 {/* DNS Records List */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                      { 
                        type: 'TXT (SPF)', 
                        host: selectedDomain.name, 
                        value: 'v=spf1 include:relay.africa ~all', 
                        status: selectedDomain.spfStatus,
                        desc: 'Authorizes Relay Africa to send on behalf of this domain.'
                      },
                      { 
                        type: 'TXT (DKIM)', 
                        host: `default._domainkey.${selectedDomain.name}`, 
                        value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN...', 
                        status: selectedDomain.dkimStatus,
                        desc: 'Cryptographic signature to prevent email spoofing.'
                      },
                      { 
                        type: 'TXT (DMARC)', 
                        host: `_dmarc.${selectedDomain.name}`, 
                        value: 'v=DMARC1; p=none;', 
                        status: selectedDomain.dmarcStatus,
                        desc: 'Instruction for handling failed authentication attempts.'
                      }
                    ].map((record, i) => (
                      <div key={record.type} className="panel glass animate-fade" style={{ animationDelay: `${i * 0.1}s`, padding: '2rem' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                               <span style={{ fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{record.type}</span>
                               <div className={`status-pill ${record.status === 'VERIFIED' ? 'status-sent' : 'status-pending'}`} style={{ scale: '0.85' }}>
                                  {record.status}
                               </div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{record.desc}</p>
                         </div>

                         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '1rem' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b' }}>HOSTNAME</span>
                                  <button onClick={() => copyToClipboard(record.host, record.type + '-host')} className="btn-icon" style={{ padding: 0 }}><Copy size={14} color={copiedKey === record.type + '-host' ? '#10b981' : '#64748b'} /></button>
                               </div>
                               <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{record.host}</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '1rem' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b' }}>VALUE</span>
                                  <button onClick={() => copyToClipboard(record.value, record.type + '-val')} className="btn-icon" style={{ padding: 0 }}><Copy size={14} color={copiedKey === record.type + '-val' ? '#10b981' : '#64748b'} /></button>
                               </div>
                               <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{record.value}</div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Sidebar Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div className="panel glass" style={{ border: '1px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Infrastructure Health</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: selectedDomain.verifiedAt ? '#10b981' : 'var(--primary)' }}>
                       {selectedDomain.verifiedAt ? "100%" : "30%"}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{selectedDomain.verifiedAt ? "Your infrastructure is optimized for enterprise-grade delivery." : "Authenticated domains have 3x higher inbox placement."}</p>
                 </div>
                 
                 <div className="panel glass">
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem' }}>Need Help?</h4>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6 }}>DNS propagation can take up to 48 hours. If verification fails, ensure there are no trailing spaces in your records.</p>
                    <a href="#" className="btn glass" style={{ width: '100%', fontSize: '0.8rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Read DNS Guide <ExternalLink size={14} style={{ marginLeft: '0.5rem' }} /></a>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        .status-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 1rem;
          font-size: 0.7rem;
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
