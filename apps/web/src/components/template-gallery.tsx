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
      <div className="animate-fade" style={{ 
        position: 'fixed', inset: 0, zIndex: 1000, 
        background: '#020617', display: 'flex', flexDirection: 'column',
        padding: '2rem'
      }}>
        {/* Full-Screen Editor Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.2rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button 
              onClick={() => setView("gallery")}
              className="btn-icon glass"
              style={{ padding: '0.8rem', borderRadius: '1rem' }}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{selectedTemplate.name}</h1>
                {selectedTemplate.isPro && (
                  <span style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6)', padding: '0.3rem 0.8rem', borderRadius: '0.6rem', fontSize: '0.7rem', fontWeight: 900, color: 'white' }}>PRO</span>
                )}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Full Immersive Builder — Pixel Perfect Preview</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
               <button className="btn-icon" style={{ borderRadius: '0.6rem', background: 'rgba(255,255,255,0.1)' }}><Smartphone size={20} /></button>
               <button className="btn-icon" style={{ borderRadius: '0.6rem', marginLeft: '0.5rem' }}><Globe size={20} /></button>
            </div>
            <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '1.2rem', fontWeight: 800, fontSize: '1rem' }} onClick={() => onSelect?.(selectedTemplate)}>
              Publish & Launch
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '3rem', flexGrow: 1, minHeight: 0 }}>
          
          {/* 1. COMPONENTS PANEL - LARGER */}
          <div className="panel glass" style={{ padding: '2rem', overflowY: 'auto', borderRadius: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '2rem' }}>Blocks Gallery</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: Type, label: "Hero Title", desc: "For announcements" },
                { icon: ImageIcon, label: "Product Grid", desc: "Display images" },
                { icon: MousePointer2, label: "CTA Button", desc: "Driving actions" },
                { icon: Layout, label: "Split View", desc: "Text & Image side" },
                { icon: Plus, label: "Footer Link", desc: "Terms & Socials" }
              ].map(comp => (
                <div key={comp.label} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', cursor: 'grab', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }}>
                   <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: 'var(--primary)' }}><comp.icon size={22} /></div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800 }}>{comp.label}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{comp.desc}</div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. MAIN CANVAS - THE "BIG" ONE */}
          <div style={{ 
            display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#0a0f1e', 
            borderRadius: '2.5rem', border: '1px solid rgba(255,255,255,0.03)', padding: '4rem 0', 
            position: 'relative', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)' 
          }}>
             {/* Center Frame */}
             <div style={{ 
               width: '100%', maxWidth: '850px', margin: '0 auto', background: '#ffffff', 
               boxShadow: '0 50px 120px rgba(0,0,0,0.8)', borderRadius: '2px', 
               minHeight: '1200px', display: 'flex', flexDirection: 'column'
             }}>
                {/* Immersive Header Indicator */}
                <div style={{ height: '8px', background: accentColor }}></div>
                
                <div style={{ padding: '5rem 6rem' }}>
                   <div className="edit-block" style={{ marginBottom: '4rem', fontFamily: selectedTemplate.id === 'classy' ? 'serif' : 'inherit' }}>
                      <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.04em', margin: 0 }}>
                        {selectedTemplate.name === 'Classic Elegance' ? 'A Timeless Message' : 'Welcome to the Future of Cloud Messaging'}
                      </h1>
                   </div>

                   <div className="edit-block" style={{ marginBottom: '4rem' }}>
                      <div style={{ width: '100%', height: '450px', background: '#f8fafc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                         <ImageIcon size={64} color="#cbd5e1" />
                      </div>
                   </div>

                   <div className="edit-block" style={{ marginBottom: '5rem' }}>
                      <p style={{ color: '#475569', fontSize: '1.4rem', lineHeight: 1.6, margin: 0 }}>
                        Your story deserves to be heard. Use this premium WordPress-inspired preset to build stunning email experiences for your audience. 
                        Relay Africa's infrastructure ensures that every pixel you design here arrives exactly as intended.
                      </p>
                   </div>

                   <div className="edit-block" style={{ marginBottom: '6rem', textAlign: 'center' }}>
                      <button style={{ 
                        background: accentColor, color: '#ffffff', border: 'none', padding: '1.8rem 5rem', 
                        borderRadius: '0', fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em'
                      }}>
                        Claim Your Access
                      </button>
                   </div>

                   <div style={{ marginTop: '10rem', paddingTop: '5rem', borderTop: '2.5px solid #0f172a', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Relay Africa</div>
                      <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                        Building the internet infrastructure for Africa. <br/>
                        123 Tech Hub, Lagos • hello@relay.africa
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. SETTINGS & STYLES - REFINED */}
          <div className="panel glass" style={{ padding: '2rem', overflowY: 'auto', borderRadius: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '2rem' }}>Global Theme</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1.2rem' }}>Primary Accent</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
                  {["#6366f1", "#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#0f172a", "#ef4444", "#8b5cf6"].map(c => (
                    <div 
                      key={c} 
                      onClick={() => setAccentColor(c)}
                      style={{ 
                        width: 'auto', aspectRatio: '1/1', borderRadius: '1rem', background: c, cursor: 'pointer',
                        border: accentColor === c ? '3px solid white' : '1px solid rgba(255,255,255,0.1)',
                        transform: accentColor === c ? 'scale(1.15)' : 'scale(1)',
                        transition: '0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }} 
                    />
                  ))}
               </div>
              </div>

              <div>
                 <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1.2rem' }}>Master Typography</label>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem' }}>
                    <button className="glass" style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--primary)', textAlign: 'left', fontSize: '0.95rem', fontWeight: 600 }}>Inter (Sans)</button>
                    <button className="glass" style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid transparent', textAlign: 'left', fontSize: '0.95rem', fontWeight: 600 }}>Outfit (Modern)</button>
                    <button className="glass" style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid transparent', textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'serif' }}>Garamond (Style)</button>
                 </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Auto-Save</span>
                   <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>ACTIVE</span>
                 </div>
                 <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <div style={{ width: '70%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                 </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
               <button className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem', borderRadius: '1.5rem', fontWeight: 800 }}>Reset to Defaults</button>
            </div>
          </div>

        </div>

        <style jsx>{`
          .edit-block {
            border: 2px solid transparent;
            transition: 0.3s;
            position: relative;
            border-radius: 8px;
            cursor: pointer;
          }
          .edit-block:hover {
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.02);
          }
          .edit-block:hover::after {
            content: 'EDIT BLOCK';
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
