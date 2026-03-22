import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Mail, Loader2, Save } from "lucide-react";

export default function ContactsManager({ apiKey }: { apiKey: string }) {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // New List State
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

  // New Contact State
  const [showNewContact, setShowNewContact] = useState(false);
  const [newContact, setNewContact] = useState({ email: "", firstName: "", lastName: "", phone: "" });

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch("/api/contacts/lists", { headers: { Authorization: `Bearer ${apiKey}` } });
      const data = await res.json();
      setLists(data);
      if (data.length > 0 && !selectedListId) setSelectedListId(data[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedListId) return;
    const fetchContacts = async () => {
      setContactsLoading(true);
      try {
        const res = await fetch(`/api/contacts/lists/${selectedListId}/contacts`, { headers: { Authorization: `Bearer ${apiKey}` } });
        setContacts(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setContactsLoading(false);
      }
    };
    fetchContacts();
  }, [selectedListId]);

  const handleCreateList = async () => {
    if (!newListName) return;
    try {
      await fetch("/api/contacts/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ name: newListName }),
      });
      setNewListName("");
      setShowNewList(false);
      fetchLists();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddContact = async () => {
    if (!selectedListId || !newContact.email) return;
    try {
      await fetch(`/api/contacts/lists/${selectedListId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(newContact),
      });
      setShowNewContact(false);
      setNewContact({ email: "", firstName: "", lastName: "", phone: "" });
      // Refresh contacts
      const res = await fetch(`/api/contacts/lists/${selectedListId}/contacts`, { headers: { Authorization: `Bearer ${apiKey}` } });
      setContacts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Sidebar: Audience Lists */}
      <div className="panel glass" style={{ width: '300px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="panel-title" style={{ margin: 0 }}>Audiences</h3>
          <button className="btn-icon" onClick={() => setShowNewList(!showNewList)} title="New List">
            <Plus size={18} />
          </button>
        </div>

        {showNewList && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" className="input-styled" placeholder="List Name..." 
              value={newListName} onChange={e => setNewListName(e.target.value)}
              style={{ fontSize: '0.85rem' }} 
            />
            <button className="btn btn-primary" onClick={handleCreateList} style={{ padding: '0.5rem' }}><Save size={16} /></button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.8rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
                background: selectedListId === list.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: selectedListId === list.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                color: selectedListId === list.id ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Users size={16} color={selectedListId === list.id ? '#6366f1' : '#64748b'} />
                <span style={{ fontWeight: selectedListId === list.id ? 600 : 400 }}>{list.name}</span>
              </div>
              <span className="api-badge">{list._count?.contacts || 0}</span>
            </button>
          ))}
          {lists.length === 0 && <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>No audiences found.</div>}
        </div>
      </div>

      {/* Main Area: Contacts Table */}
      <div className="panel glass" style={{ flexGrow: 1, minHeight: '500px' }}>
        {selectedListId ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Contacts Directory</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage subscribers for {lists.find(l => l.id === selectedListId)?.name}</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowNewContact(!showNewContact)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} /> Add Contact
              </button>
            </div>

            {showNewContact && (
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                 <div><label style={{display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem'}}>Email *</label><input type="email" className="input-styled" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} /></div>
                 <div><label style={{display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem'}}>Phone</label><input type="tel" className="input-styled" placeholder="+123456789" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} /></div>
                 <div><label style={{display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem'}}>First Name</label><input type="text" className="input-styled" value={newContact.firstName} onChange={e => setNewContact({...newContact, firstName: e.target.value})} /></div>
                 <div><label style={{display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem'}}>Last Name</label><input type="text" className="input-styled" value={newContact.lastName} onChange={e => setNewContact({...newContact, lastName: e.target.value})} /></div>
                 <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                   <button className="btn" style={{ background: 'transparent', color: '#94a3b8' }} onClick={() => setShowNewContact(false)}>Cancel</button>
                   <button className="btn btn-primary" onClick={handleAddContact}>Save Subscriber</button>
                 </div>
               </div>
            )}

            {contactsLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} /></div>
            ) : contacts.length > 0 ? (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>Email</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Phone</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} color="#64748b" /> {c.email}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{c.firstName || '-'} {c.lastName || '-'}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{c.phone || '-'}</td>
                        <td style={{ padding: '1rem 0.5rem', color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                <Users size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.2 }} />
                <p>No contacts in this audience yet.</p>
                <button className="btn" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)' }} onClick={() => setShowNewContact(true)}>Create the first one</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            Select or create an Audience List to view contacts.
          </div>
        )}
      </div>

    </div>
  );
}
