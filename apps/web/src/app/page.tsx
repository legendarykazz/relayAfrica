"use client";

import { useState } from "react";
import { 
  Mail, ShieldCheck, Zap, Globe, MessageSquare, ArrowRight, 
  ChevronRight, BarChart3, Lock, Coins, Check, Code, 
  Server, Smartphone, Layers, HelpCircle, Twitter, Github, Key
} from "lucide-react";
import TypingEffect from "@/components/typing-effect";

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <main style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <section style={{ padding: '8rem 1rem 12rem', position: 'relative' }}>
        <div className="max-w-7xl" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="animate-fade">
            <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, fontWeight: 800, marginBottom: '1.5rem' }}>
              Send emails your users <br/>
              <TypingEffect />
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', maxWidth: '540px' }}>
              Built for developers in Africa. Simple API. Reliable delivery. Local payments.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                Start Sending Free <ArrowRight size={20} />
              </a>
              <button className="btn btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                View Docs
              </button>
            </div>
          </div>
          
          <div className="animate-fade delay-2">
            <div className="glass" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>api.relayafrica.com</div>
              </div>
              <pre style={{ padding: '2rem', color: '#f8fafc', fontSize: '0.9rem', lineHeight: 1.6, overflowX: 'auto' }}>
{`POST /send HTTP/1.1
Host: api.relayafrica.com
Authorization: Bearer re_live_...
Content-Type: application/json

{
  "to": "user@email.com",
  "subject": "Welcome",
  "html": "<h1>Hello Africa</h1>"
}`}
              </pre>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: -1 }}></div>
      </section>

      {/* 2. TRUST SECTION */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3rem' }}>
          Built for modern African startups
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5rem', opacity: 0.5, filter: 'grayscale(1)' }}>
           <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>PAYSTACK</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>FLUTTERWAVE</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>KIPPA</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>BAMBOO</div>
        </div>
      </section>

      {/* 3. WHAT WE DO */}
      <section style={{ padding: '8rem 1rem' }}>
        <div className="max-w-7xl">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
             <div>
                <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  <Mail size={24} />
                </div>
                <h3 className="panel-title" style={{ marginBottom: '1rem' }}>Email API</h3>
                <p style={{ color: '#94a3b8' }}>Send high-transactional emails with a simple REST API. Built for speed and reliability.</p>
             </div>
             <div>
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '1.5rem' }}>
                  <Zap size={24} />
                </div>
                <h3 className="panel-title" style={{ marginBottom: '1rem' }}>Delivery Optimization</h3>
                <p style={{ color: '#94a3b8' }}>Our engine intelligently routes messages through local ISPs to avoid regional spam filters.</p>
             </div>
             <div>
                <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', marginBottom: '1.5rem' }}>
                  <Layers size={24} />
                </div>
                <h3 className="panel-title" style={{ marginBottom: '1rem' }}>Multi-channel</h3>
                <p style={{ color: '#94a3b8' }}>Future-ready infrastructure with upcoming support for SMS and WhatsApp failover.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section style={{ padding: '8rem 1rem', background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl">
           <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '6rem' }}>How it works</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
              {[
                { step: "Step 1", title: "Create account → get API key", icon: Key },
                { step: "Step 2", title: "Send request", icon: Smartphone },
                { step: "Step 3", title: "We deliver your message", icon: Globe }
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                   <div style={{ width: '4rem', height: '4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                      <item.icon size={24} style={{ color: 'var(--primary)' }} />
                   </div>
                   <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}>{item.step}</div>
                   <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</h4>
                </div>
              ))}
           </div>
           
           <div className="glass animate-fade" style={{ marginTop: '6rem', borderRadius: '1.5rem', padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Node.js</span>
                <span style={{ color: '#64748b' }}>Example</span>
              </div>
              <pre style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
{`// Developers love the simplicity
const relay = require('relay-africa')('pk_live_... ');

await relay.send({
  to: 'founder@startup.ng',
  subject: 'Hello from Relay Africa!',
  html: 'Your delivery just got 10x better.'
});`}
              </pre>
           </div>
        </div>
      </section>

      {/* 5. CORE FEATURES */}
      <section style={{ padding: '10rem 1rem' }}>
        <div className="max-w-7xl">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '6rem' }}>Everything you need to ship</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '2rem' }}>
            {[
              { title: "Email API", desc: "Reliable transactional infrastructure.", icon: Mail },
              { title: "Domain Verification", desc: "SPF, DKIM, DMARC automated.", icon: ShieldCheck },
              { title: "Real-time Logs", desc: "Every delivery recorded.", icon: BarChart3 },
              { title: "High Deliverability", desc: "Regional ISP optimization.", icon: Zap },
              { title: "Local Payments", desc: "Pay in NGN, GHS, KES.", icon: Coins },
              { title: "Omnichannel", desc: "SMS/WhatsApp fallback soon.", icon: MessageSquare }
            ].map((f, i) => (
              <div key={i} className="panel glass">
                <f.icon size={24} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DIFFERENTIATION */}
      <section style={{ padding: '8rem 1rem', background: 'linear-gradient(rgba(15,23,42,0) 0%, rgba(99,102,241,0.05) 100%)' }}>
        <div className="max-w-7xl" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '4rem' }}>Built for Africa. <span style={{ color: '#94a3b8' }}>Not adapted for it.</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
             {[
               { title: "Local Payments", desc: "Paystack & Flutterwave ready." },
               { title: "Better Delivery", desc: "African domain optimization." },
               { title: "Simple Onboarding", desc: "Live in under 5 minutes." },
               { title: "Real Support", desc: "Built by local developers." }
             ].map((p, i) => (
               <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>✓</div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{p.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section id="pricing" style={{ padding: '10rem 1rem' }}>
        <div className="max-w-7xl">
           <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Simple, predictable pricing</h2>
              
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '100rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                 <button 
                  onClick={() => setBillingCycle("monthly")}
                  style={{ padding: '0.6rem 2rem', borderRadius: '100rem', border: 'none', background: billingCycle === "monthly" ? "var(--primary)" : "transparent", color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}
                 >
                   Monthly
                 </button>
                 <button 
                  onClick={() => setBillingCycle("yearly")}
                  style={{ padding: '0.6rem 2rem', borderRadius: '100rem', border: 'none', background: billingCycle === "yearly" ? "var(--primary)" : "transparent", color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}
                 >
                   Yearly (-20%)
                 </button>
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Free */}
              <div className="panel glass" style={{ padding: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>Starter</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1.5rem 0' }}>$0</div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Perfect for side projects and small experiments.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#10b981' }} /> 1,000 emails/month</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#10b981' }} /> Basic logs</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#10b981' }} /> Community support</div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }}>Start Free</button>
              </div>

              {/* Growth */}
              <div className="panel glass" style={{ padding: '3.5rem 3rem', border: '2px solid var(--primary)', position: 'relative', transform: 'scale(1.05)', zIndex: 10 }}>
                <div style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800 }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Growth</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1.5rem 0' }}>{billingCycle === "monthly" ? "$29" : "$23"}</div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2.5rem' }}>For growing startups that ship production features.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: 'var(--primary)' }} /> 50,000 emails</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: 'var(--primary)' }} /> Priority delivery</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: 'var(--primary)' }} /> Domain tools</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: 'var(--primary)' }} /> Email support</div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>Get Started</button>
              </div>

              {/* Scale */}
              <div className="panel glass" style={{ padding: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ec4899' }}>Scale</h3>
                <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1.5rem 0' }}>Custom</div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Enterprise-grade communication infrastructure.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#ec4899' }} /> Unlimited emails</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#ec4899' }} /> Multi-channel (SMS/WA)</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#ec4899' }} /> Dedicated support</div>
                   <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}><Check size={18} style={{ color: '#ec4899' }} /> Custom SLAs</div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }}>Contact Sales</button>
              </div>
           </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section style={{ padding: '10rem 1rem' }}>
        <div className="max-w-5xl glass" style={{ borderRadius: '3rem', padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' }}>
           <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Start sending emails <br/>that actually land.</h2>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Get Started Free</a>
              <button className="btn btn-secondary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Read Docs</button>
           </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '6rem 1rem 4rem' }}>
         <div className="max-w-7xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
            <div>
               <div className="sidebar-brand" style={{ marginBottom: '1.5rem' }}>Relay Africa</div>
               <p style={{ color: '#64748b', fontSize: '0.85rem' }}>The communication infrastructure layer for African startups.</p>
            </div>
            <div>
               <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Product</h5>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                  <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
                  <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>API Reference</a>
               </div>
            </div>
            <div>
               <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Developers</h5>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>API Status</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Open Source</a>
               </div>
            </div>
            <div>
               <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Connect</h5>
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="#" style={{ color: '#94a3b8' }}><Twitter size={20} /></a>
                  <a href="#" style={{ color: '#94a3b8' }}><Github size={20} /></a>
               </div>
            </div>
         </div>
         <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            © 2026 Relay Africa. All rights reserved. Made in Lagos & Accra.
         </div>
      </footer>
    </main>
  );
}
