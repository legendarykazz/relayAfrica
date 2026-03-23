"use client";

import { useState, useEffect } from "react";
import { Mail, Key, History, LayoutDashboard, Settings, ChevronRight, Activity, Globe, ShieldCheck, Copy, Check, Send, AlertCircle, Loader2, Users, Megaphone, Layout, Menu } from "lucide-react";
import MessagingSandbox from "@/components/messaging-sandbox";
import ContactsManager from "@/components/contacts-manager";
import CampaignsManager from "@/components/campaigns-manager";
import TemplateGallery from "@/components/template-gallery";
import DomainManager from "@/components/domain-manager";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingTemplate, setPendingTemplate] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logsData, setLogsData] = useState<any>(null);
  const [logsPage, setLogsPage] = useState(1);
  const [logsType, setLogsType] = useState("email");
  const [logsLoading, setLogsLoading] = useState(false);

  // Use the test key from our seed
  const TEST_API_KEY = "test_api_key_123";

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [statsRes, userRes] = await Promise.all([
          fetch("/api/overview", {
            headers: { Authorization: `Bearer ${TEST_API_KEY}` }
          }),
          fetch("/api/user/me", {
            headers: { Authorization: `Bearer ${TEST_API_KEY}` }
          })
        ]);

        const stats = await statsRes.json();
        const user = await userRes.json();

        if (isMounted) {
          setStatsData(stats);
          setUserData(user);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "logs") return;

    async function fetchLogs() {
      setLogsLoading(true);
      try {
        const res = await fetch(`/api/logs/${logsType}?page=${logsPage}&limit=10`, {
          headers: { Authorization: `Bearer ${TEST_API_KEY}` }
        });
        const data = await res.json();
        setLogsData(data);
      } catch (error) {
        console.error("Logs Fetch Error:", error);
      } finally {
        setLogsLoading(false);
      }
    }

    fetchLogs();
  }, [activeTab, logsPage, logsType]);

  const copyToClipboard = () => {
    if (userData?.apiKey) {
      navigator.clipboard.writeText(userData.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "templates", label: "Templates", icon: Layout },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "logs", label: "Delivery Logs", icon: History },
    { id: "sandbox", label: "Messaging Sandbox", icon: Send },
    { id: "verification", label: "Verification", icon: ShieldCheck },
    { id: "api", label: "API Keys", icon: Key },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Emails Sent", value: statsData?.totalSent ?? "0", icon: Mail, color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" },
    { label: "SMS Sent", value: statsData?.smsCount ?? "0", icon: Activity, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { label: "WhatsApp", value: statsData?.waCount ?? "0", icon: Send, color: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" },
  ];

  return (
    <div className="app-container">
      <aside className={`sidebar glass ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">Relay Africa</div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link ${activeTab === item.id ? "active" : ""}`}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <p>Logged in as</p>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData?.email ?? "test@relayafrica.com"}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content-area">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className="btn-icon" 
             style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}
           >
             <Menu size={20} />
           </button>
        </div>
        
        {activeTab === "dashboard" && (
          <div className="animate-fade">
            <div className="header-row animate-fade">
              <div>
                <h1 className="page-title">Relay Center</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor and manage your delivery infrastructure</p>
              </div>
              <div 
                className="api-badge glass" 
                onClick={copyToClipboard} 
                style={{ cursor: 'pointer', padding: '0.5rem 1rem', transition: 'all 0.3s' }}
              >
                <Key size={14} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{userData?.apiKey ? `re_live_...${userData.apiKey.slice(-6)}` : "re_live_......"}</span>
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} color="var(--text-muted)" />}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-container">
              {stats.map((stat, i) => (
                <div key={stat.label} className={`stat-card glass animate-fade delay-${i+1}`}>
                  <div className="stat-header">
                    <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                      <stat.icon size={22} />
                    </div>
                  </div>
                  <div className="stat-val">{loading ? "..." : stat.value}</div>
                  <div className="stat-name">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid">
              {/* Domain Manager Panel (Quick View) */}
              <div className="animate-fade delay-3">
                 <DomainManager apiKey={TEST_API_KEY} />
              </div>

              {/* Email Logs Panel */}
              <div className="panel glass animate-fade delay-3">
                <h3 className="panel-title">Real-time Logs</h3>
                <div className="logs-list">
                  {statsData?.recentLogs?.length > 0 ? (
                    statsData.recentLogs.map((log: any) => (
                      <div key={log.id} className="log-item" onClick={() => setSelectedLog(log)} style={{ cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.to}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.subject}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className={`status-pill ${log.status === 'SENT' ? 'status-sent' : log.status === 'FAILED' ? 'status-failed' : 'status-pending'}`} style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>
                            {log.status}
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No emails sent yet.
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={16} color="var(--primary)" /> Quick Test Delivery
                  </h4>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input 
                      type="email" 
                      placeholder="Recipient email..." 
                      className="input-styled" 
                      id="test-email"
                      style={{ flex: 1, fontSize: '0.85rem' }}
                    />
                    <button 
                      className="btn btn-primary"
                      style={{ padding: '0 1rem', fontSize: '0.85rem' }}
                      onClick={async () => {
                        const input = (document.getElementById('test-email') as HTMLInputElement);
                        const to = input.value;
                        if (!to) return alert('Enter an email');
                        try {
                          const res = await fetch('/api/send', {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${TEST_API_KEY}`
                            },
                            body: JSON.stringify({ to, subject: 'Relay Africa Test', html: '<h1>It works!</h1>' })
                          });
                          if (!res.ok) throw new Error('Failed');
                          alert('Test email queued!');
                          input.value = "";
                        } catch (e) {
                          alert('Failed to queue email. Check API logs.');
                        }
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>Send</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="animate-fade">
            <h1 className="page-title">Delivery Logs</h1>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.85rem' }}>Comprehensive history of all sent messages across channels</p>
            
            <div className="stats-container" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => { setLogsType("email"); setLogsPage(1); }}
                className={`panel glass ${logsType === 'email' ? 'active-glow' : ''}`}
                style={{ padding: '0.75rem', textAlign: 'center', transition: 'all 0.3s', border: logsType === 'email' ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer' }}
              >
                <Mail size={18} style={{ margin: '0 auto 6px', color: logsType === 'email' ? 'var(--primary)' : 'var(--text-muted)' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Emails</div>
              </button>
              <button 
                onClick={() => { setLogsType("sms"); setLogsPage(1); }}
                className={`panel glass ${logsType === 'sms' ? 'active-glow' : ''}`}
                style={{ padding: '0.75rem', textAlign: 'center', transition: 'all 0.3s', border: logsType === 'sms' ? '1px solid #10b981' : '1px solid var(--border)', cursor: 'pointer' }}
              >
                <Activity size={18} style={{ margin: '0 auto 6px', color: logsType === 'sms' ? '#10b981' : 'var(--text-muted)' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>SMS</div>
              </button>
              <button 
                onClick={() => { setLogsType("whatsapp"); setLogsPage(1); }}
                className={`panel glass ${logsType === 'whatsapp' ? 'active-glow' : ''}`}
                style={{ padding: '0.75rem', textAlign: 'center', transition: 'all 0.3s', border: logsType === 'whatsapp' ? '1px solid #ec4899' : '1px solid var(--border)', cursor: 'pointer' }}
              >
                <Send size={18} style={{ margin: '0 auto 6px', color: logsType === 'whatsapp' ? '#ec4899' : 'var(--text-muted)' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>WhatsApp</div>
              </button>
            </div>

            <div className="panel glass" style={{ minHeight: '500px' }}>
              {logsLoading ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" size={32} color="#6366f1" />
                </div>
              ) : (
                <>
                  <div className="logs-list">
                    {logsData?.logs?.length > 0 ? (
                      logsData.logs.map((log: any) => (
                        <div key={log.id} className="log-item" onClick={() => setSelectedLog(log)} style={{ cursor: 'pointer' }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{log.to}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              {logsType === 'email' ? log.subject : log.message?.substring(0, 50) + (log.message?.length > 50 ? '...' : '')}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className={`status-pill ${log.status === 'SENT' ? 'status-sent' : log.status === 'FAILED' ? 'status-failed' : 'status-pending'}`}>
                              {log.status}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              {new Date(log.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        No {logsType} logs found.
                      </div>
                    )}
                  </div>

                  {logsData?.pagination && logsData.pagination.totalPages > 1 && (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                      <button 
                        disabled={logsPage <= 1}
                        onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', opacity: logsPage <= 1 ? 0.5 : 1 }}
                      >
                        Previous
                      </button>
                      <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        Page {logsPage} of {logsData.pagination.totalPages}
                      </span>
                      <button 
                        disabled={logsPage >= logsData.pagination.totalPages}
                        onClick={() => setLogsPage(p => p + 1)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', opacity: logsPage >= logsData.pagination.totalPages ? 0.5 : 1 }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "sandbox" && (
          <MessagingSandbox apiKey={TEST_API_KEY} />
        )}

        {activeTab === "templates" && (
          <TemplateGallery 
            onSelect={(tpl) => {
              setPendingTemplate({
                name: `New ${tpl.name} Campaign`,
                subject: tpl.name === 'Classic Elegance' ? 'A Timeless Message' : 'Welcome to the Future',
                html: `<h1>${tpl.name}</h1><p>Start customizing your email here...</p>`
              });
              setActiveTab("campaigns");
            }} 
          />
        )}
        {activeTab === "campaigns" && (
          <CampaignsManager 
            apiKey={TEST_API_KEY} 
            initialData={pendingTemplate} 
          />
        )}
        {activeTab === "contacts" && <ContactsManager apiKey={TEST_API_KEY} />}
        {activeTab === "verification" && (
          <div className="animate-fade">
            <h1 className="page-title">Infrastructure Center</h1>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.85rem' }}>Secure your sending reputation by verifying your domains and managing DNS records.</p>
            <DomainManager apiKey={TEST_API_KEY} />
          </div>
        )}
        {activeTab === "api" && (
          <div className="animate-fade panel glass">
            <h1 className="page-title">API Configuration</h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Manage your programmatic access to Relay Africa.</p>
            <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Live Secret Key</h3>
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                 <input type="text" readOnly value={userData?.apiKey || "Loading..."} className="input-styled" style={{ fontFamily: 'monospace', width: '100%', maxWidth: '400px' }} />
                 <button className="btn btn-primary" onClick={copyToClipboard}>{copied ? "Copied!" : "Copy Key"}</button>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>Keep this key secret. Never expose it in client-side code.</p>
            </div>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="animate-fade panel glass">
            <h1 className="page-title">Account Settings</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Account Email</label>
                <input type="text" readOnly value={userData?.email || ""} className="input-styled" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Billing Plan</label>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', borderRadius: '0.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <strong>MVP Developer Tier</strong> — 100,000 emails/mo
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Log Details Modal */}
      {selectedLog && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass" style={{ 
            width: '100%', maxWidth: '700px', maxHeight: '90vh', 
            overflow: 'hidden', borderRadius: '1.5rem', display: 'flex', 
            flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedLog.subject || 'Message Details'}</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>To: {selectedLog.to}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="btn-icon"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}
              >
                <AlertCircle size={20} style={{ transform: 'rotate(45deg)', color: 'var(--text-secondary)' }} />
              </button>
            </div>
            
            <div style={{ padding: '2rem', overflowY: 'auto', background: '#ffffff', minHeight: '300px', border: '1px solid #e2e8f0', margin: '0 1.5rem', borderRadius: '0.5rem' }}>
               {selectedLog.html !== undefined ? (
                 <>
                   <div dangerouslySetInnerHTML={{ __html: selectedLog.html }} style={{ color: '#000000', fontSize: '1rem', lineHeight: '1.5' }} />
                   {!selectedLog.html && <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No content available for this message.</div>}
                 </>
               ) : (
                 <div style={{ color: '#000000', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'monospace', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                   {selectedLog.message || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No message content.</span>}
                 </div>
               )}
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>ID: {selectedLog.id}</div>
               <button className="btn btn-primary" onClick={() => setSelectedLog(null)}>Close Viewer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
