import { useState, useEffect } from "react";
import { Megaphone, Plus, Rocket, Eye, Loader2, RefreshCw } from "lucide-react";

export default function CampaignsManager({ apiKey, initialData }: { apiKey: string, initialData?: any }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<any[]>([]);

  // New Campaign State
  const [showNew, setShowNew] = useState(!!initialData);
  const [launching, setLaunching] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    audienceListId: "",
    fromAddress: "", // Selected verified sender
    subject: initialData?.subject || "",
    html: initialData?.html || ""
  });
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        audienceListId: audienceListId || "",
        fromAddress: "",
        subject: initialData.subject,
        html: initialData.html
      });
      setShowNew(true);
    }
  }, [initialData]);

  const audienceListId = lists[0]?.id;

  const fetchCampaigns = async () => {
    try {
      const [campRes, listsRes, domainsRes] = await Promise.all([
        fetch("/api/campaigns", { headers: { Authorization: `Bearer ${apiKey}` } }),
        fetch("/api/contacts/lists", { headers: { Authorization: `Bearer ${apiKey}` } }),
        fetch("/api/domain", { headers: { Authorization: `Bearer ${apiKey}` } })
      ]);
      setCampaigns(await campRes.json());
      const fetchedLists = await listsRes.json();
      setLists(fetchedLists);

      const fetchedDomains = await domainsRes.json();
      const verifiedDomains = Array.isArray(fetchedDomains) ? fetchedDomains.filter((d: any) => d.verifiedAt) : [];
      setDomains(verifiedDomains);

      if (fetchedLists.length > 0 && !formData.audienceListId) {
        setFormData(prev => ({...prev, audienceListId: fetchedLists[0].id}));
      }

      if (verifiedDomains.length > 0 && !formData.fromAddress) {
        // Default to the first verified domain's hello@ address
        setFormData(prev => ({...prev, fromAddress: `marketing@${verifiedDomains[0].name}`}));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleLaunch = async () => {
    if (!formData.name || !formData.audienceListId || !formData.subject || !formData.html) {
      return setFeedback({ type: 'error', msg: "All fields are required to launch a campaign." });
    }
    
    setLaunching(true);
    setFeedback(null);
    
    try {
      // 1. Create Template
      const tplRes = await fetch("/api/campaigns/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ name: `${formData.name} Template`, subject: formData.subject, html: formData.html })
      });
      const template = await tplRes.json();

      if (template.error) throw new Error(template.error);

      // 2. Launch Campaign
      const launchRes = await fetch("/api/campaigns/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ 
          name: formData.name, 
          audienceListId: formData.audienceListId, 
          templateId: template.id,
          fromAddress: formData.fromAddress
        })
      });
      const result = await launchRes.json();
      
      if (result.error) throw new Error(result.error);

      setFeedback({ type: 'success', msg: `Campaign queued! Dispatching to ${result.contactsQueued} contacts.` });
      setShowNew(false);
      setFormData({ name: "", audienceListId: lists[0]?.id || "", fromAddress: "", subject: "", html: "" });
      fetchCampaigns();
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message || "Failed to launch campaign" });
    } finally {
      setLaunching(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p style={{ color: '#94a3b8' }}>Design, orchestrate, and trace your bulk email deliveries.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(!showNew)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showNew ? <Eye size={18} /> : <Plus size={18} />}
          {showNew ? "View History" : "New Campaign"}
        </button>
      </div>

      {feedback && (
        <div style={{ marginBottom: '2rem', padding: "1rem", borderRadius: "0.5rem", fontSize: "0.9rem",
          background: feedback.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: feedback.type === "success" ? "#34d399" : "#f87171",
          border: `1px solid ${feedback.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
        }}>
          {feedback.msg}
        </div>
      )}

      {showNew ? (
        <div className="panel glass" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
           
           {/* Left Form */}
           <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>Campaign Settings</h3>
             
             <div>
               <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Internal Name</label>
               <input type="text" className="input-styled" placeholder="Q1 Newsletter..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding: '0.6rem'}} />
             </div>
 
             <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Verified Sender Address</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-styled" 
                    placeholder="marketing" 
                    value={formData.fromAddress.split('@')[0]} 
                    onChange={e => setFormData({...formData, fromAddress: `${e.target.value}@${formData.fromAddress.split('@')[1] || (domains[0]?.name || '')}`})}
                    style={{ flex: 1, padding: '0.6rem' }}
                  />
                  <div style={{ alignSelf: 'center', color: '#64748b', fontSize: '0.8rem' }}>@</div>
                  <select 
                    className="input-styled" 
                    value={formData.fromAddress.split('@')[1]} 
                    onChange={e => setFormData({...formData, fromAddress: `${formData.fromAddress.split('@')[0]}@${e.target.value}`})}
                    style={{ flex: 2, appearance: 'none', backgroundColor: '#0f172a', padding: '0.6rem' }}
                  >
                    {domains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    {domains.length === 0 && <option value="">No verified domains</option>}
                  </select>
                </div>
                {domains.length === 0 && (
                   <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.4rem' }}>
                     You must verify a domain in "Infrastructure" to send campaigns.
                   </p>
                )}
             </div>

             <div>
               <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Target Audience</label>
               <select className="input-styled" value={formData.audienceListId} onChange={e => setFormData({...formData, audienceListId: e.target.value})} style={{ appearance: 'none', backgroundColor: '#0f172a', padding: '0.6rem' }}>
                 {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                 {lists.length === 0 && <option value="">No lists</option>}
               </select>
             </div>

             <div style={{ marginTop: '0.5rem' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>Email Design</h3>
               <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Subject Line</label>
               <input type="text" className="input-styled" placeholder="Subject..." value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{padding: '0.6rem'}} />
             </div>
             
             <div>
               <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>HTML Content</label>
               <textarea className="input-styled" rows={10} placeholder="<h1>Hello!</h1>..." value={formData.html} onChange={e => setFormData({...formData, html: e.target.value})} style={{ fontFamily: 'monospace', padding: '0.6rem', fontSize: '0.85rem' }} />
             </div>

             <button className="btn btn-primary" onClick={handleLaunch} disabled={launching} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', padding: '0.6rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
               {launching ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
               {launching ? "Sending..." : "Dispatch Campaign"}
             </button>
           </div>

           {/* Right Preview */}
           <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>Live Preview</h3>
             <div style={{ flexGrow: 1, background: '#ffffff', borderRadius: '0.5rem', padding: '1rem', color: '#000000', border: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto', minHeight: '350px' }}>
               {formData.html ? (
                 <div dangerouslySetInnerHTML={{ __html: formData.html }} />
               ) : (
                 <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                   Start typing HTML to see preview...
                 </div>
               )}
             </div>
           </div>
        </div>
      ) : (
        <div className="panel glass">
          {campaigns.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Campaign Flow</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Audience</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.6rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Megaphone size={14} color="#6366f1" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.template?.subject}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem' }}>{c.audienceList?.name}</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>
                      <span className={`status-pill ${c.status === 'COMPLETED' ? 'status-sent' : 'status-pending'}`} style={{fontSize: '0.6rem', padding: '0.2rem 0.5rem'}}>{c.status}</span>
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#64748b', fontSize: '0.75rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              <Rocket size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.2 }} />
              <p>No campaigns have been launched yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
