import { useState } from "react";
import { Layout, Palette, Type, MousePointer2, Check, ArrowLeft, Image as ImageIcon, Plus, Smartphone, Globe } from "lucide-react";

const PRESET_TEMPLATES = [
  {
    id: "classy",
    name: "Classic Elegance",
    tag: "Transactional",
    category: "Business",
    isPro: false,
    preview: "/templates/classy.png",
    colors: ["#1e293b", "#ffffff", "#f8fafc"],
    description: "Serif typography and refined spacing for high-end corporate communication."
  },
  {
    id: "founders-update",
    name: "Founder's Memo",
    tag: "Newsletter",
    category: "Personal",
    isPro: true,
    preview: "/templates/founder.png",
    colors: ["#0f172a", "#f8fafc", "#ffffff"],
    description: "A sophisticated, personal-touch template for important leadership updates."
  },
  {
    id: "newsletter",
    name: "Modern Pulse",
    tag: "Newsletter",
    category: "Marketing",
    isPro: false,
    preview: "/templates/newsletter.png",
    colors: ["#6366f1", "#ffffff", "#f1f5f9"],
    description: "Balanced multi-column layout optimized for readability and engagement."
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
    id: "ecom-sale",
    name: "Flash Wave",
    tag: "Ecommerce",
    category: "Marketing",
    isPro: false,
    preview: "/templates/sale.png",
    colors: ["#ef4444", "#fef2f2", "#ffffff"],
    description: "Urgent, conversion-focused design for sales and limited-time offers."
  },
  {
    id: "abandoned-cart",
    name: "Retrieve Pro",
    tag: "Ecommerce",
    category: "System",
    isPro: true,
    preview: "/templates/abandoned.png",
    colors: ["#10b981", "#ecfdf5", "#ffffff"],
    description: "Proven layout to recover lost revenue from abandoned shopping carts."
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

  const filteredTemplates = activeCategory === "All" 
    ? PRESET_TEMPLATES 
    : PRESET_TEMPLATES.filter(t => t.category === activeCategory || t.tag === activeCategory);

  const handleSelect = (template: any) => {
    setSelectedTemplate(template);
    setAccentColor(template.colors[0]);
    setView("editor");
  };

  if (view === "editor") {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '85vh' }}>
        {/* Editor Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              onClick={() => setView("gallery")}
              className="btn-icon glass"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <h1 className="page-title" style={{ margin: 0, fontSize: '1.2rem' }}>{selectedTemplate.name}</h1>
                {selectedTemplate.isPro && (
                  <span style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6)', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.6rem', fontWeight: 800, color: 'white' }}>PRO</span>
                )}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>Visual Builder — Everything is editable</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '0.6rem', padding: '0.3rem' }}>
               <button className="btn-icon" style={{ borderRadius: '0.4rem', background: 'rgba(255,255,255,0.05)' }}><Smartphone size={16} /></button>
               <button className="btn-icon" style={{ borderRadius: '0.4rem' }}><Globe size={16} /></button>
            </div>
            <button className="btn btn-primary" onClick={() => onSelect?.(selectedTemplate)}>
              Save & Send
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '2rem', flexGrow: 1, minHeight: 0 }}>
          
          {/* 1. COMPONENTS PANEL */}
          <div className="panel glass" style={{ padding: '1.5rem', overflowY: 'auto' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1.5rem' }}>Components</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: Type, label: "Headline", desc: "H1, H2, H3" },
                { icon: ImageIcon, label: "Hero Image", desc: "Full width" },
                { icon: MousePointer2, label: "Button", desc: "Call to action" },
                { icon: Layout, label: "Grid Block", desc: "2-3 Columns" },
                { icon: Plus, label: "Spacer", desc: "Visual gap" }
              ].map(comp => (
                <div key={comp.label} className="glass" style={{ padding: '1rem', borderRadius: '1rem', cursor: 'grab', border: '1px solid rgba(255,255,255,0.03)', transition: '0.2s' }}>
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.6rem' }}><comp.icon size={18} /></div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{comp.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{comp.desc}</div>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '1rem', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
               <p style={{ fontSize: '0.7rem', color: '#a5b4fc', lineHeight: 1.5 }}>
                 Drag these blocks onto the canvas to add sections.
               </p>
            </div>
          </div>

          {/* 2. CANVAS (CANVAS) */}
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', border: '1px solid var(--border)', padding: '2rem', position: 'relative' }}>
             {/* Canvas Frame */}
             <div style={{ 
               width: '100%', maxWidth: '650px', margin: '0 auto', background: '#ffffff', 
               boxShadow: '0 25px 70px rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' 
             }}>
                {/* Visual Header */}
                <div style={{ height: '4px', background: accentColor }}></div>
                <div style={{ padding: '3rem' }}>
                   {/* Editable Sections with hover-frames */}
                   <div className="edit-block" style={{ padding: '1rem', position: 'relative', border: '1px dashed transparent', transition: '0.2s', fontFamily: selectedTemplate.id === 'classy' ? 'serif' : 'inherit' }}>
                      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, margin: 0 }}>
                        {selectedTemplate.name === 'Classic Elegance' ? 'A Timeless Message' : 'Welcome to the Future of Messaging'}
                      </h1>
                   </div>

                   <div className="edit-block" style={{ marginTop: '2rem', position: 'relative' }}>
                      <div style={{ width: '100%', height: '300px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                         <ImageIcon size={48} color="#cbd5e1" />
                      </div>
                   </div>

                   <div className="edit-block" style={{ marginTop: '3rem', padding: '1rem', position: 'relative' }}>
                      <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>
                        Your message starts here. This premium preset is fully responsive and tested across 50+ email clients. 
                        Relay Africa ensures your design remains consistent, beautiful, and high-converting.
                      </p>
                   </div>

                   <div className="edit-block" style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                      <button style={{ 
                        background: accentColor, color: '#ffffff', border: 'none', padding: '1.2rem 3rem', 
                        borderRadius: '8px', fontWeight: 800, fontSize: '1rem', transition: '0.3s'
                      }}>
                        Unlock Access Now
                      </button>
                   </div>

                   <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Relay Africa</div>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                        © 2026 Relay Africa Ltd. All rights reserved. <br/>
                        Sent to hello@relay.africa • Unsubscribe
                      </p>
                   </div>
                </div>
             </div>

             {/* Drag Indicator Overlay (Mock) */}
             <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '0.8rem 1.5rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <MousePointer2 size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>Hover over sections to edit or drag new blocks</span>
             </div>
          </div>

          {/* 3. PROPERTIES PANEL */}
          <div className="panel glass" style={{ padding: '1.5rem', overflowY: 'auto' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1.5rem' }}>Global Styles</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>Accent Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {["#6366f1", "#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#0f172a", "#ef4444"].map(c => (
                    <div 
                      key={c} 
                      onClick={() => setAccentColor(c)}
                      style={{ 
                        width: '2.2rem', height: '2.2rem', borderRadius: '0.6rem', background: c, cursor: 'pointer',
                        border: accentColor === c ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
                        transform: accentColor === c ? 'scale(1.1)' : 'scale(1)',
                        transition: '0.2s',
                        boxShadow: accentColor === c ? `0 0 15px ${c}66` : 'none'
                      }} 
                    />
                  ))}
               </div>
              </div>

              <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>Typography</label>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button className="glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.6rem', border: '1px solid var(--primary)', textAlign: 'left', fontSize: '0.85rem' }}>Inter (Sans-serif)</button>
                    <button className="glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.6rem', border: '1px solid transparent', textAlign: 'left', fontSize: '0.85rem' }}>Outfit (Modern)</button>
                    <button className="glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.6rem', border: '1px solid transparent', textAlign: 'left', fontSize: '0.85rem', fontFamily: 'serif' }}>EB Garamond (Serif)</button>
                 </div>
              </div>

              <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>Canvas Settings</label>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Width</div>
                       <input type="text" readOnly value="650px" className="input-styled" style={{ fontSize: '0.8rem', padding: '0.5rem' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Corner</div>
                       <input type="text" readOnly value="4px" className="input-styled" style={{ fontSize: '0.8rem', padding: '0.5rem' }} />
                    </div>
                 </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
               <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>Reset to Preset</button>
            </div>
          </div>

        </div>

        <style jsx>{`
          .edit-block:hover {
            border: 1px dashed var(--primary) !important;
            cursor: pointer;
          }
          .edit-block:hover::after {
            content: 'Edit Section';
            position: absolute;
            top: -10px;
            right: 0;
            background: var(--primary);
            color: white;
            padding: 2px 8px;
            font-size: 10px;
            font-weight: 800;
            border-radius: 4px;
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
