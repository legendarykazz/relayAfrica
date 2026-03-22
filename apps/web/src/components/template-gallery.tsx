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
        padding: '1.5rem'
      }}>
        {/* Full-Screen Editor Toolbar - High Fidelity */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.2rem', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                onClick={() => setView("gallery")}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '0.8rem', fontSize: '0.85rem' }}
              >
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Exit Studio
              </button>
              <button 
                className="btn glass"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '0.8rem', fontSize: '0.85rem' }}
                onClick={() => onSelect?.(selectedTemplate)}
              >
                Save Draft
              </button>
            </div>
            <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{selectedTemplate.name}</h1>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>• Dynamic Design Studio</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
               className={`btn-icon ${!showSidebars ? 'btn-primary' : 'glass'}`} 
               onClick={() => setShowSidebars(!showSidebars)}
               style={{ borderRadius: '0.8rem', width: '3rem', height: '3rem' }}
               title="Focus Mode (Hide Panels)"
            >
               <Layout size={20} />
            </button>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem', padding: '0.4rem', border: '1px solid rgba(255,255,255,0.05)' }}>
               <button className="btn-icon" style={{ borderRadius: '0.6rem', background: 'rgba(255,255,255,0.1)', height: '2.2rem', width: '2.2rem' }}><Smartphone size={18} /></button>
               <button className="btn-icon" style={{ borderRadius: '0.6rem', marginLeft: '0.4rem', height: '2.2rem', width: '2.2rem' }}><Globe size={18} /></button>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '1rem', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }} onClick={() => onSelect?.(selectedTemplate)}>
              Send & Launch
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: showSidebars ? '300px 1fr 300px' : '0 1fr 0', 
          gap: showSidebars ? '2rem' : '0', 
          flexGrow: 1, 
          transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: 0 
        }}>
          
          {/* 1. COMPONENTS PANEL */}
          <div className="panel glass" style={{ padding: '2rem', overflowY: 'auto', borderRadius: '1.8rem', opacity: showSidebars ? 1 : 0, pointerEvents: showSidebars ? 'all' : 'none', transition: '0.3s' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '1.8rem' }}>Add Blocks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { icon: Type, label: "Headline", desc: "H1, H2, H3" },
                { icon: ImageIcon, label: "Hero Media", desc: "Focus image" },
                { icon: MousePointer2, label: "Custom Link", desc: "CTA Button" },
                { icon: Layout, label: "Pricing Table", desc: "Grids" }
              ].map(comp => (
                <div key={comp.label} className="glass" style={{ padding: '1.2rem', borderRadius: '1.2rem', cursor: 'grab', border: '1px solid rgba(255,255,255,0.05)', transition: '0.2s' }}>
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem' }}><comp.icon size={20} /></div>
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
            transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
             {/* Dynamic Canvas width for Focus Mode */}
             <div style={{ 
               width: '100%', maxWidth: showSidebars ? '850px' : '950px', margin: '0 auto', background: '#ffffff', 
               boxShadow: '0 50px 120px rgba(0,0,0,0.8)', borderRadius: '4px', 
               minHeight: '1300px', display: 'flex', flexDirection: 'column',
               transition: '0.4s'
             }}>
                <div style={{ height: '8px', background: accentColor }}></div>
                
                <div style={{ padding: showSidebars ? '5rem 6rem' : '6rem 8rem' }}>
                   {/* 1. DYNAMIC HERO SECTION - HIGH FIDELITY */}
                   {selectedTemplate.id === 'corporate-bold' && (
                     <div style={{ background: accentColor, padding: '7rem 5rem', color: 'white', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.1))' }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', opacity: 0.9 }}>
                              <Globe size={28} /> <span style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.1em' }}>NEXUS STRATEGY</span>
                           </div>
                           <h1 style={{ fontSize: '4.8rem', fontWeight: 900, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>We keep our promises to you.</h1>
                           <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '3.5rem', maxWidth: '550px', lineHeight: 1.5 }}>
                             Scaling financial infrastructure with high-fidelity, industrial-grade messaging across Africa.
                           </p>
                           <button style={{ background: 'white', color: accentColor, border: 'none', padding: '1.8rem 4.5rem', fontWeight: 900, borderRadius: '4px', fontSize: '1.1rem', cursor: 'pointer' }}>GET STARTED NOW</button>
                        </div>
                     </div>
                   )}

                   {selectedTemplate.id === 'resort-immersive' && (
                     <div style={{ background: '#2d1b4e', padding: '0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', height: '600px', background: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(45,27,78,0.1), rgba(45,27,78,0.9))' }}></div>
                           <div style={{ position: 'relative', textAlign: 'center', color: 'white', padding: '0 3rem' }}>
                              <h1 style={{ fontSize: '5.2rem', fontWeight: 900, lineHeight: 0.9, marginBottom: '2.5rem', letterSpacing: '-0.05em' }}>Capture Your <br/>Memories Here.</h1>
                              <button style={{ background: accentColor, color: 'white', border: 'none', padding: '1.5rem 4rem', fontWeight: 900, borderRadius: '4px', fontSize: '1.1rem' }}>BOOK NOW</button>
                           </div>
                        </div>
                        <div style={{ padding: '5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                           <div className="edit-block" style={{ padding: '3rem', background: 'white', color: '#0f172a', borderRadius: '8px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', transform: 'translateY(-6rem)' }}>
                              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>$350 / NIGHT</h3>
                              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7 }}>Luxury Mediterranean View with Infinity Pool Access and Private Dining Experiences.</p>
                           </div>
                           <div style={{ background: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80)', backgroundSize: 'cover', borderRadius: '8px', height: '300px' }}></div>
                        </div>
                     </div>
                   )}

                   {selectedTemplate.id === 'ecom-pro' && (
                     <div style={{ padding: '2rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
                           <div style={{ background: '#f8fafc', padding: '1.2rem 2.5rem', borderRadius: '3rem', display: 'flex', alignItems: 'center', gap: '1.2rem', border: '1px solid #e2e8f0' }}>
                              <Smartphone size={24} color={accentColor} /> <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em' }}>MAILTO PRIME</span>
                           </div>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', textAlign: 'center', marginBottom: '2rem', letterSpacing: '-0.03em' }}>Order Confirmed.</h1>
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.3rem', marginBottom: '5rem', maxWidth: '600px', margin: '0 auto 5rem' }}>
                          We've received your payment and our logistics team in Lagos is now preparing your high-fidelity package.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', borderTop: '2px dashed #e2e8f0', paddingTop: '45rem', position: 'relative' }}>
                           <div style={{ position: 'absolute', top: '10rem', width: '100%', height: '300px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <h3 style={{ color: '#94a3b8', fontWeight: 800 }}>Order Items Preview</h3>
                           </div>
                           <div>
                              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '1rem' }}>Order Info</h4>
                              <p style={{ color: accentColor, fontWeight: 900, fontSize: '1.2rem' }}>#REL-AFR-0092</p>
                           </div>
                           <div>
                              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '1rem' }}>Dispatch Address</h4>
                              <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>123 Tech Avenue, Victoria Island, Lagos</p>
                           </div>
                        </div>
                     </div>
                   )}

                   {!['corporate-bold', 'resort-immersive', 'ecom-pro'].includes(selectedTemplate.id) && (
                     <div style={{ padding: '0' }}>
                        <div className="edit-block" style={{ marginBottom: '4rem', fontFamily: selectedTemplate.id === 'classy' ? 'serif' : 'inherit' }}>
                           <h1 style={{ fontSize: '5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.05em', margin: 0 }}>
                             {selectedTemplate.name} — Premium Builder.
                           </h1>
                        </div>
                        <div className="edit-block" style={{ marginBottom: '5rem' }}>
                           <div style={{ width: '100%', height: '500px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                              <ImageIcon size={72} color="#cbd5e1" />
                           </div>
                        </div>
                        <p style={{ color: '#475569', fontSize: '1.5rem', lineHeight: 1.7, maxWidth: '700px' }}>{selectedTemplate.description}</p>
                     </div>
                   )}

                   <div className="edit-block" style={{ marginTop: '6rem', textAlign: 'center' }}>
                      <a href={buttonLink} target="_blank" rel="noopener noreferrer" style={{ 
                        background: accentColor, color: '#ffffff', border: 'none', padding: '2rem 6rem', 
                        borderRadius: '0', fontWeight: 900, fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.15em', 
                        textDecoration: 'none', display: 'inline-block'
                      }}>
                        Unlock Exclusive Access
                      </a>
                   </div>

                   <div style={{ marginTop: '12rem', paddingTop: '6rem', borderTop: '3px solid #0f172a', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>RELAY AFRICA</div>
                      <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0, lineHeight: 1.8 }}>
                        Building the modern messaging internet for Africa. <br/>
                        HQ: 123 Tech Hub, Victoria Island, Lagos • hello@relay.africa <br/>
                        <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>Sent with high-fidelity infrastructure</span>
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. SETTINGS & STYLES */}
          <div className="panel glass" style={{ padding: '2rem', overflowY: 'auto', borderRadius: '1.8rem', opacity: showSidebars ? 1 : 0, pointerEvents: showSidebars ? 'all' : 'none', transition: '0.3s' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '2rem' }}>Block Controls</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                 <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1.2rem' }}>CTA Link (URL)</label>
                 <input 
                   type="text" 
                   value={buttonLink} 
                   onChange={(e) => setButtonLink(e.target.value)}
                   className="input-styled glass" 
                   style={{ width: '100%', fontSize: '0.9rem', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} 
                   placeholder="https://example.com"
                 />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1.2rem' }}>Brand Theme</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
                  {["#6366f1", "#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#0f172a", "#ef4444", "#8b5cf6"].map(c => (
                    <div 
                      key={c} 
                      onClick={() => setAccentColor(c)}
                      style={{ 
                        width: 'auto', aspectRatio: '1/1', borderRadius: '0.8rem', background: c, cursor: 'pointer',
                        border: accentColor === c ? '3px solid white' : '1px solid rgba(255,255,255,0.1)',
                        transform: accentColor === c ? 'scale(1.15)' : 'scale(1)',
                        transition: '0.s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }} 
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
          }
          .edit-block:hover {
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.05) !important;
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
