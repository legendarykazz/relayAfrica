import { useState } from "react";
import { Layout, Palette, Type, MousePointer2, Check, ArrowLeft, Image as ImageIcon, Plus } from "lucide-react";

const PRESET_TEMPLATES = [
  {
    id: "classy",
    name: "Classic Elegance",
    tag: "Business",
    preview: "/templates/classy.png",
    colors: ["#1e293b", "#ffffff", "#f8fafc"],
    description: "Serif typography and refined spacing for high-end corporate communication."
  },
  {
    id: "newsletter",
    name: "Modern Pulse",
    tag: "Newsletter",
    preview: "/templates/newsletter.png",
    colors: ["#6366f1", "#ffffff", "#f1f5f9"],
    description: "Balanced multi-column layout optimized for readability and engagement."
  },
  {
    id: "landing",
    name: "Impact Hub",
    tag: "Promotion",
    preview: "/templates/landing.png",
    colors: ["#4f46e5", "#ec4899", "#0f172a"],
    description: "High-impact gradients and bold call-to-actions inspired by modern landing pages."
  },
  {
    id: "transactional",
    name: "Clean Flow",
    tag: "System",
    preview: "/templates/transactional.png",
    colors: ["#ffffff", "#f8fafc", "#64748b"],
    description: "Ultra-clean design focused on information hierarchy for receipts and OTPs."
  }
];

export default function TemplateGallery({ onSelect }: { onSelect?: (template: any) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [view, setView] = useState<"gallery" | "editor">("gallery");
  const [accentColor, setAccentColor] = useState("#6366f1");

  const handleSelect = (template: any) => {
    setSelectedTemplate(template);
    setAccentColor(template.colors[0]);
    setView("editor");
  };

  if (view === "editor") {
    return (
      <div className="animate-fade">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setView("gallery")}
              className="btn-icon"
              style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.5rem' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="page-title" style={{ margin: 0 }}>Customizing: {selectedTemplate.name}</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Visual Editor — Drag elements or click to customize</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onSelect?.(selectedTemplate)}
          >
            Use Template
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Editor Sidebar */}
          <div className="panel glass" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
               <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Palette size={16} /> Brand Colors
               </h4>
               <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {["#6366f1", "#10b981", "#ec4899", "#f59e0b", "#1e293b"].map(c => (
                    <div 
                      key={c} 
                      onClick={() => setAccentColor(c)}
                      style={{ 
                        width: '2rem', height: '2rem', borderRadius: '50%', background: c, cursor: 'pointer',
                        border: accentColor === c ? '2px solid white' : '2px solid transparent',
                        boxShadow: accentColor === c ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                      }} 
                    />
                  ))}
               </div>
            </div>

            <div>
               <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Layout size={16} /> Elements
               </h4>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {[
                    { icon: Type, label: "Text" },
                    { icon: ImageIcon, label: "Image" },
                    { icon: MousePointer2, label: "Button" },
                    { icon: Plus, label: "Section" }
                  ].map(e => (
                    <div key={e.label} className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '0.8rem', cursor: 'pointer', transition: '0.2s' }}>
                      <e.icon size={20} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{e.label}</div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '1rem', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
              <p style={{ fontSize: '0.8rem', color: '#a5b4fc', lineHeight: 1.5 }}>
                <strong>Tip:</strong> You can drag these elements directly into the preview window to add new content blocks.
              </p>
            </div>
          </div>

          {/* Preview Window */}
          <div className="panel" style={{ background: '#f8fafc', borderRadius: '1.5rem', padding: '4rem', display: 'flex', justifyContent: 'center', overflowY: 'auto', maxHeight: '70vh' }}>
             <div style={{ 
               width: '100%', maxWidth: '600px', background: '#ffffff', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
               borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e2e8f0' 
             }}>
                {/* Mock Template Content */}
                <div style={{ height: '5px', background: accentColor }}></div>
                <div style={{ padding: '3rem' }}>
                   <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: '#1e293b', fontFamily: selectedTemplate.id === 'classy' ? 'serif' : 'inherit' }}>
                      {selectedTemplate.name === 'Classic Elegance' ? 'A Timeless Message' : 'Welcome to the Future'}
                   </div>
                   <div style={{ width: '100%', height: '200px', background: '#f1f5f9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                      <ImageIcon size={40} color="#cbd5e1" />
                   </div>
                   <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '3rem' }}>
                      This is a preview of your {selectedTemplate.tag.toLowerCase()}. You can customize the text, images, and colors to match your brand perfectly. Relay Africa ensures this looks stunning in every inbox.
                   </p>
                   <button style={{ 
                     background: accentColor, color: '#ffffff', border: 'none', padding: '1rem 2.5rem', 
                     borderRadius: '0.4rem', fontWeight: 700, cursor: 'default' 
                   }}>
                      Get Started Now
                   </button>
                   <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                      © 2026 Relay Africa • Sent via Premium Infrastructure
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Design Gallery</h1>
        <p style={{ color: '#94a3b8' }}>Select a starting point for your next message. Optimized for all devices.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
        {PRESET_TEMPLATES.map((t, i) => (
          <div key={t.id} className="panel glass animate-fade" style={{ padding: 0, overflow: 'hidden', transition: '0.3s', borderRadius: '1.5rem', animationDelay: `${i * 0.1}s` }}>
            <div style={{ height: '200px', background: `linear-gradient(135deg, ${t.colors[0]}22, ${t.colors[1]}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', position: 'relative' }}>
               <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                 {t.tag}
               </div>
               <div style={{ fontSize: '1.2rem', fontWeight: 800, color: t.colors[0], opacity: 0.6 }}>PREVIEW</div>
            </div>
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>{t.description}</p>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => handleSelect(t)}
              >
                Customize <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
