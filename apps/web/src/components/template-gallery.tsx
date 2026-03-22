import { useState } from "react";
import { Layout, Palette, Type, MousePointer2, Check, ArrowLeft, Image as ImageIcon, Plus, Smartphone, Globe } from "lucide-react";

const PRESET_TEMPLATES = [
  {
    id: "corporate-bold",
    name: "Corporate Nexus",
    tag: "Finance",
    category: "Business",
    isPro: true,
    preview: "/templates/nexus.png",
    colors: ["#2563eb", "#0f172a", "#f8fafc"],
    description: "High-impact blue theme with icon-driven feature grids and professional trust elements."
  },
  {
    id: "resort-immersive",
    name: "Aura Resort",
    tag: "Hospitality",
    category: "Landing Page",
    isPro: true,
    preview: "/templates/aura.png",
    colors: ["#7c3aed", "#2d1b4e", "#ffffff"],
    description: "Deep violet palette with overlapping image cards and immersive luxury vibes."
  },
  {
    id: "ecom-pro",
    name: "Mailto Prime",
    tag: "Ecommerce",
    category: "System",
    isPro: true,
    preview: "/templates/mailto.png",
    colors: ["#000000", "#ffffff", "#f1f5f9"],
    description: "Clean, structured ecommerce layout for high-clarity transactional messaging."
  },
  {
    id: "founders-update",
    name: "Founder's Memo",
    tag: "Newsletter",
    category: "Personal",
    isPro: false,
    preview: "/templates/founder.png",
    colors: ["#0f172a", "#f8fafc", "#ffffff"],
    description: "A sophisticated, personal-touch template for important leadership updates."
  },
  {
    id: "launch",
    name: "Visionary Launch",
    tag: "Landing Page",
    category: "Marketing",
    isPro: true,
    preview: "/templates/launch.png",
    colors: ["#4f46e5", "#ec4899", "#0f172a"],
    description: "High-impact gradients and bold call-to-actions inspired by modern landing pages."
  },
  {
    id: "transactional",
    name: "Clean Flow",
    tag: "Transactional",
    category: "System",
    isPro: false,
    preview: "/templates/transactional.png",
    colors: ["#ffffff", "#f8fafc", "#64748b"],
    description: "Ultra-clean design focused on information hierarchy for receipts and OTPs."
  }
];

const CATEGORIES = ["All", "Marketing", "Transactional", "Newsletter", "System"];

export default function TemplateGallery({ onSelect }: { onSelect?: (template: any) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [view, setView] = useState<"gallery" | "editor">("gallery");
  const [activeCategory, setActiveCategory] = useState("All");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [showSidebars, setShowSidebars] = useState(true);
  const [buttonLink, setButtonLink] = useState("https://relay.africa");
  const [isSaving, setIsSaving] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);

  const filteredTemplates = activeCategory === "All" 
    ? PRESET_TEMPLATES 
    : PRESET_TEMPLATES.filter(t => t.category === activeCategory || t.tag === activeCategory);

  const handleSelect = (template: any) => {
    setSelectedTemplate(template);
    setAccentColor(template.colors[0]);
    // Initialize with a default hero block matching the template style
    setBlocks([
      { id: 'h1', type: 'headline', content: template.name + " — Premium Update" },
      { id: 'p1', type: 'text', content: template.description }
    ]);
    setView("editor");
  };

  const addBlock = (type: string) => {
    const newBlock = {
       id: Math.random().toString(36).substr(2, 9),
       type,
       content: type === 'headline' ? 'New Headline' : 'Your new content goes here...'
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleSave = () => {
     setIsSaving(true);
     setTimeout(() => {
        setIsSaving(false);
        // In a real app, this would call onSelect with the full state
        onSelect?.({ ...selectedTemplate, blocks, accentColor, buttonLink });
     }, 800);
  };

  if (view === "editor") {
    return (
      <div className="animate-fade" style={{ 
        position: 'fixed', inset: 0, zIndex: 1000, 
        background: '#020617', display: 'flex', flexDirection: 'column',
        padding: '1.5rem'
      }}>
        {/* Full-Screen Editor Toolbar - Functionalized */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.2rem', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                onClick={() => setView("gallery")}
                className="btn glass"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '0.8rem', fontSize: '0.85rem' }}
              >
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Exit Studio
              </button>
              <button 
                className="btn glass"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '0.8rem', fontSize: '0.85rem', color: isSaving ? '#10b981' : 'white' }}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
            </div>
            <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{selectedTemplate.name}</h1>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>• Live Editor</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button 
                className={`btn-icon ${!showSidebars ? 'btn-primary' : 'glass'}`} 
                onClick={() => setShowSidebars(!showSidebars)}
                style={{ 
                  borderRadius: '0.8rem', width: '3.5rem', height: '3.5rem',
                  border: !showSidebars ? 'none' : '2px solid var(--primary)',
                  boxShadow: !showSidebars ? 'none' : '0 0 15px rgba(99, 102, 241, 0.4)',
                  animation: showSidebars ? 'pulse 2s infinite' : 'none'
                }}
              >
                 <Layout size={24} />
              </button>
              {showSidebars && (
                <div style={{ position: 'absolute', top: '-110%', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 900, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                   FULL SCREEN
                </div>
              )}
            </div>

            <button className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem' }} onClick={handleSave}>
              Publish Now
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: showSidebars ? '300px 1fr 300px' : '0 1fr 0', 
          gap: showSidebars ? '2rem' : '0', 
          flexGrow: 1, 
          transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: 0,
          position: 'relative'
        }}>
          
          {/* FLOATING QUICK-EDIT (Visible in Focus Mode) */}
          {!showSidebars && (
            <div className="animate-fade-in" style={{ 
               position: 'fixed', top: '15rem', right: '4rem', zIndex: 100,
               display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
               <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', marginBottom: '0.5rem' }}>QUICK URL</label>
                  <input 
                    type="text" 
                    value={buttonLink} 
                    onChange={(e) => setButtonLink(e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 0', outline: 'none', width: '150px' }}
                  />
               </div>
               <button onClick={() => setShowSidebars(true)} className="btn btn-primary" style={{ padding: '0.8rem', borderRadius: '1rem' }}>
                 <ArrowLeft size={20} />
               </button>
            </div>
          )}

          {/* 1. COMPONENTS PANEL - NOW WORKING */}
          <div className="panel glass" style={{ padding: '2rem', overflowY: 'auto', borderRadius: '1.8rem', opacity: showSidebars ? 1 : 0, pointerEvents: showSidebars ? 'all' : 'none', transition: '0.3s' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '1.8rem' }}>Add Blocks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { type: 'headline', icon: Type, label: "Headline", desc: "Interactive Title" },
                { type: 'media', icon: ImageIcon, label: "Hero Media", desc: "Focus Image" },
                { type: 'link', icon: MousePointer2, label: "Action Link", desc: "CTA Button" },
                { type: 'grid', icon: Layout, label: "Pricing Table", desc: "Complex Grid" }
              ].map(comp => (
                <div 
                  key={comp.label} 
                  className="glass-hover" 
                  onClick={() => addBlock(comp.type)}
                  style={{ padding: '1.2rem', borderRadius: '1.2rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: '0.2s' }}
                >
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.6rem', background: accentColor, borderRadius: '0.8rem', color: 'white' }}><comp.icon size={20} /></div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{comp.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{comp.desc}</div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. MAIN CANVAS - THE "BIG" FULL PAGE EXPERIENCE */}
          <div style={{ 
            display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#0a0f1e', 
            borderRadius: showSidebars ? '2.5rem' : '1rem', border: '1px solid rgba(255,255,255,0.03)', padding: '3rem 0', 
            position: 'relative', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)', 
            transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
             <div style={{ 
               width: '100%', maxWidth: showSidebars ? '850px' : '950px', margin: '0 auto', background: '#ffffff', 
               boxShadow: '0 50px 120px rgba(0,0,0,0.8)', borderRadius: '4px', 
               minHeight: '1300px', display: 'flex', flexDirection: 'column',
               transition: '0.5s'
             }}>
                <div style={{ height: '8px', background: accentColor }}></div>
                
                <div style={{ padding: showSidebars ? '4rem 5rem' : '6rem 7rem' }}>
                   {/* DYNAMIC BLOCKS RENDERING */}
                   {blocks.map((block, index) => (
                     <div key={block.id} className="edit-block" style={{ position: 'relative', marginBottom: '2.5rem' }}>
                        {block.type === 'headline' && (
                          <h1 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => {
                               const newBlocks = [...blocks];
                               newBlocks[index].content = e.currentTarget.innerText;
                               setBlocks(newBlocks);
                            }}
                            style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: '#0f172a', border: 'none', outline: 'none' }}
                          >
                             {block.content}
                          </h1>
                        )}
                        {block.type === 'text' && (
                          <p 
                            contentEditable 
                            style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#475569', outline: 'none' }}
                          >
                             {block.content}
                          </p>
                        )}
                        {block.type === 'media' && (
                          <div style={{ width: '100%', height: '400px', background: '#f8fafc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                             <ImageIcon size={48} color="#cbd5e1" />
                          </div>
                        )}
                        {block.type === 'link' && (
                           <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                              <a href={buttonLink} target="_blank" rel="noopener noreferrer" style={{ 
                                background: accentColor, color: 'white', padding: '1.5rem 4rem', borderRadius: '4px', fontWeight: 900, textDecoration: 'none', display: 'inline-block' 
                              }}>
                                ACTION BUTTON
                              </a>
                           </div>
                        )}
                        {block.type === 'grid' && (
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                              <div style={{ padding: '2rem', border: '1px solid #f1f5f9', borderRadius: '4px' }}>
                                 <h3 style={{ fontWeight: 800 }}>Feature One</h3>
                                 <p style={{ color: '#64748b' }}>Details about this premium feature.</p>
                              </div>
                              <div style={{ padding: '2rem', border: '1px solid #f1f5f9', borderRadius: '4px' }}>
                                 <h3 style={{ fontWeight: 800 }}>Feature Two</h3>
                                 <p style={{ color: '#64748b' }}>Details about another premium feature.</p>
                              </div>
                           </div>
                        )}
                     </div>
                   ))}

                   {/* Template specific footer */}
                   <div style={{ marginTop: '10rem', paddingTop: '5rem', borderTop: '2px solid #0f172a', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>RELAY AFRICA</div>
                      <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>Building infrastructure for Africa. <br/> Lagos • Victoria Island</p>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. SETTINGS & STYLES */}
          <div className="panel glass" style={{ padding: '2rem', overflowY: 'auto', borderRadius: '1.8rem', opacity: showSidebars ? 1 : 0, pointerEvents: showSidebars ? 'all' : 'none', transition: '0.3s' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '2rem' }}>Block Controls</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '1rem' }}>CTA LINK</label>
                 <input 
                   type="text" 
                   value={buttonLink} 
                   onChange={(e) => setButtonLink(e.target.value)}
                   className="glass" 
                   style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} 
                 />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '1rem' }}>THEME COLOR</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
                  {["#6366f1", "#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#0f172a", "#ef4444", "#8b5cf6"].map(c => (
                    <div 
                      key={c} 
                      onClick={() => setAccentColor(c)}
                      style={{ width: '100%', aspectRatio: '1/1', borderRadius: '4px', background: c, cursor: 'pointer', border: accentColor === c ? '2px solid white' : 'none' }} 
                    />
                  ))}
                </div>
              </div>
              <div>
                 <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1.2rem' }}>Master Typos</label>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem' }}>
                    <button className="glass" style={{ width: '100%', padding: '1rem', borderRadius: '0.8rem', border: '1px solid var(--primary)', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600 }}>Standard Inter</button>
                    <button className="glass" style={{ width: '100%', padding: '1rem', borderRadius: '0.8rem', border: '1px solid transparent', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'serif' }}>Premium Serif</button>
                 </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
               <button className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem', borderRadius: '1.2rem', fontWeight: 800 }}>Reset Options</button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .edit-block {
            border: 2.5px solid transparent;
            transition: 0.3s;
            position: relative;
            border-radius: 8px;
            cursor: pointer;
            padding: 1rem;
          }
          .edit-block:hover {
            border-color: var(--primary);
            background: rgba(0, 0, 0, 0.02) !important;
          }
           ${selectedTemplate.id === 'corporate-bold' && `.edit-block:hover { border-color: white !important; }`}
          .edit-block:hover::after {
            content: 'EDIT';
            position: absolute;
            top: -12px;
            right: 0px;
            background: var(--primary);
            color: white;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 900;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Design Gallery</h1>
          <p style={{ color: '#94a3b8' }}>Select a starting point for your next message. Optimized for all devices.</p>
        </div>
        
        <div className="glass" style={{ display: 'flex', padding: '0.4rem', borderRadius: '0.8rem', border: '1px solid var(--glass-border)' }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ 
                padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', 
                background: activeCategory === cat ? 'var(--primary)' : 'transparent', 
                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: '0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
        {filteredTemplates.map((t, i) => (
          <div key={t.id} className="panel glass animate-fade" style={{ padding: 0, overflow: 'hidden', transition: '0.3s', borderRadius: '1.5rem', animationDelay: `${i * 0.1}s`, border: t.isPro ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid var(--glass-border)' }}>
            <div style={{ height: '200px', background: `linear-gradient(135deg, ${t.colors[0]}22, ${t.colors[1]}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', position: 'relative' }}>
               <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {t.isPro && (
                    <div style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.65rem', fontWeight: 800, color: 'white', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }}>
                      PRO
                    </div>
                  )}
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', backdropFilter: 'blur(4px)' }}>
                    {t.tag}
                  </div>
               </div>
               <div style={{ fontSize: '1.2rem', fontWeight: 800, color: t.colors[0], opacity: 0.6 }}>PREVIEW</div>
            </div>
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {t.name}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>{t.description}</p>
              <button 
                className={`btn ${t.isPro ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => handleSelect(t)}
              >
                {t.isPro ? 'Customize with Pro' : 'Customize Template'} <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
