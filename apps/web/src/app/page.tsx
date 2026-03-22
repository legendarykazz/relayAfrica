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
    <main style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      {/* Mesh Gradient Backgrounds */}
      <div className="mesh-gradient" style={{ opacity: 0.6 }}></div>
      <div className="mesh-gradient" style={{ top: '40%', left: '20%', width: '120%', height: '80%', opacity: 0.4, transform: 'rotate(-5deg)' }}></div>

      {/* 1. HERO SECTION */}
      <section style={{ padding: '10rem 1rem 12rem', position: 'relative' }}>
        <div className="max-w-7xl" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '6rem', alignItems: 'center' }}>
          <div className="animate-fade">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: '100rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '2rem' }}>
              <Zap size={16} /> <span>Now active in 12 African countries</span>
            </div>
            <h1 style={{ fontSize: '4rem', lineHeight: 1.1, fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
              Send emails that <br/>
              <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>actually land.</span>
            </h1>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', maxWidth: '580px', lineHeight: 1.7 }}>
              The first email infrastructure layer <TypingEffect /> built specifically for the unique connectivity challenges of the African continent.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
                Start Sending Free <ArrowRight size={20} />
              </a>
              <button className="btn btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
                Explore API
              </button>
            </div>
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--bg-main)', background: '#1e293b', marginLeft: i > 1 ? '-0.75rem' : 0 }}></div>
                ))}
              </div>
              <span>Trusted by 500+ developers across Africa</span>
            </div>
          </div>
          
          <div className="animate-fade delay-2">
            <div className="glass" style={{ borderRadius: '2rem', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>terminal — relay-africa</div>
              </div>
              <div style={{ padding: '2rem', background: 'rgba(2, 6, 23, 0.5)' }}>
                <pre style={{ color: '#f8fafc', fontSize: '0.9rem', lineHeight: 1.6, overflowX: 'auto', border: 'none', background: 'transparent' }}>
                  <span style={{ color: '#94a3b8' }}>{"// Fast, reliable, local."}</span>{"\n"}
                  <span style={{ color: '#c084fc' }}>POST</span> <span style={{ color: '#22d3ee' }}>/api/v1/send</span>{"\n"}
                  <span style={{ color: '#fbbf24' }}>Authorization:</span> Bearer <span style={{ color: '#4ade80' }}>re_live_7x92k...</span>{"\n\n"}
                  {"{"}{"\n"}
                  {"  "}<span style={{ color: '#6366f1' }}>"to"</span>: <span style={{ color: '#4ade80' }}>"founder@startup.ng"</span>,{"\n"}
                  {"  "}<span style={{ color: '#6366f1' }}>"subject"</span>: <span style={{ color: '#4ade80' }}>"Welcome to the Future"</span>,{"\n"}
                  {"  "}<span style={{ color: '#6366f1' }}>"provider"</span>: <span style={{ color: '#4ade80' }}>"optimized-african-node"</span>{"\n"}
                  {"}"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '6rem 0', background: 'rgba(2, 6, 23, 0.3)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4rem', textAlign: 'center', fontWeight: 600 }}>
            Powering the next generation of African unicorns
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6rem', opacity: 0.4, filter: 'brightness(0) invert(1)' }}>
             <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em' }}>PAYSTACK</div>
             <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em' }}>FLUTTERWAVE</div>
             <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em' }}>KIPPA</div>
             <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em' }}>BAMBOO</div>
             <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em' }}>MONIEPOINT</div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section style={{ padding: '10rem 1rem' }}>
        <div className="max-w-7xl">
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Built for scale.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to send transactional messages at any scale, without the infrastructure headache.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              { title: "Email API", desc: "Global-reach transactional infrastructure with local regional nodes.", icon: Mail, color: 'var(--primary)' },
              { title: "Smart Delivery", desc: "AI-powered routing that bypasses regional spam filters and network issues.", icon: Zap, color: '#10b981' },
              { title: "Omnichannel", desc: "Future-proof your stack with seamless SMS and WhatsApp fallback.", icon: MessageSquare, color: '#ec4899' },
              { title: "Verification", desc: "Automated SPF, DKIM, and DMARC setup to protect your sender reputation.", icon: ShieldCheck, color: '#8b5cf6' },
              { title: "Analytics", desc: "Real-time delivery insights and engagement tracking for every message sent.", icon: BarChart3, color: '#06b6d4' },
              { title: "Compliance", desc: "Regional data residency and GDPR/NDPR compliant infrastructure.", icon: Lock, color: '#f59e0b' }
            ].map((f, i) => (
              <div key={i} className="panel glass" style={{ transition: '0.4s', cursor: 'default', border: '1px solid var(--glass-border)' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: `rgba(${i % 2 === 0 ? '79,70,229' : '219,39,119'}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>{f.title}</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', opacity: 0, transition: '0.3s' }} className="feature-link">
                  Learn more <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section style={{ padding: '10rem 1rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl">
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8rem', alignItems: 'center' }}>
             <div>
                <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Developer first. <br/>Always.</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {[
                    { step: "01", title: "Generate API Keys", desc: "Get live in seconds with our intuitive dashboard and instant key generation." },
                    { step: "02", title: "Integrate SDK", desc: "Use our lightweight Node.js or Python SDKs, or hit our clean REST API directly." },
                    { step: "03", title: "Scale Effortlessly", desc: "We handle the massive scale so you can focus on building your product." }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '2rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.3 }}>{s.step}</div>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="glass animate-fade" style={{ borderRadius: '2rem', padding: '0.5rem', background: 'rgba(2, 6, 23, 0.4)' }}>
                <div style={{ background: '#0f172a', borderRadius: '1.5rem', padding: '3rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>Node.js</div>
                    <div style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Python</div>
                    <div style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Go</div>
                  </div>
                  <pre style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8 }}>
{`<span style={{ color: '#6366f1' }}>const</span> Relay = <span style={{ color: '#eab308' }}>require</span>(<span style={{ color: '#4ade80' }}>'relay-africa'</span>);
<span style={{ color: '#6366f1' }}>const</span> client = <span style={{ color: '#6366f1' }}>new</span> <span style={{ color: '#eab308' }}>Relay</span>(<span style={{ color: '#4ade80' }}>'pk_live_...'</span>);

<span style={{ color: '#6366f1' }}>await</span> client.<span style={{ color: '#38bdf8' }}>emails</span>.<span style={{ color: '#38bdf8' }}>send</span>({
  from: <span style={{ color: '#4ade80' }}>'Relay Africa &lt;hello@relay.africa&gt;'</span>,
  to: <span style={{ color: '#4ade80' }}>'founder@startup.io'</span>,
  subject: <span style={{ color: '#4ade80' }}>'Scale your startup'</span>,
  text: <span style={{ color: '#4ade80' }}>'Local delivery, global reach.'</span>
});`}
                  </pre>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 5. CORE FEATURES - REFINED */}
      <section style={{ padding: '8rem 1rem' }}>
        <div className="max-w-7xl">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div className="glass" style={{ padding: '4rem', borderRadius: '3rem', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 100% 0%, rgba(79, 70, 229, 0.1), transparent 50%)', zIndex: -1 }}></div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Optimized for the African Web.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem' }}>
                We've built a custom network of SMTP relays and regional nodes across Lagos, Nairobi, and Johannesburg to ensure sub-second delivery even on high-latency networks.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  "Regional Data Sovereignty",
                  "Local ISP White-listing",
                  "24/7 Local Support",
                  "Nigerian, Kenyan, and Ghanaian Nodes"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontWeight: 600 }}>
                    <div style={{ color: 'var(--primary)' }}><Check size={20} /></div> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { title: "99.9% Uptime", desc: "Reliability you can bank on.", icon: ShieldCheck },
                { title: "Local Pay", desc: "NGN, GHS, KES, ZAR.", icon: Coins },
                { title: "Developer First", desc: "API limits that don't bite.", icon: Code },
                { title: "Dark Mode", desc: "Built for late night ships.", icon: Server }
              ].map((item, i) => (
                <div key={i} className="glass" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
                  <item.icon size={24} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
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
      <section id="pricing" style={{ padding: '10rem 1rem', position: 'relative' }}>
        <div className="max-w-7xl">
           <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem' }}>Simple, transparent pricing.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>No hidden fees. No regional markup. Just reliable delivery.</p>
              
              <div className="glass" style={{ display: 'inline-flex', padding: '0.4rem', borderRadius: '100rem', border: '1px solid var(--glass-border)' }}>
                 <button 
                  onClick={() => setBillingCycle("monthly")}
                  style={{ padding: '0.8rem 2.5rem', borderRadius: '100rem', border: 'none', background: billingCycle === "monthly" ? "var(--primary)" : "transparent", color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}
                 >
                   Monthly
                 </button>
                 <button 
                  onClick={() => setBillingCycle("yearly")}
                  style={{ padding: '0.8rem 2.5rem', borderRadius: '100rem', border: 'none', background: billingCycle === "yearly" ? "var(--primary)" : "transparent", color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}
                 >
                   Yearly <span style={{ opacity: 0.7, fontSize: '0.8rem', marginLeft: '0.4rem' }}>(-20%)</span>
                 </button>
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', alignItems: 'center' }}>
              {/* Free */}
              <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981', marginBottom: '1rem' }}>Starter</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '4rem', fontWeight: 800 }}>$0</span>
                  <span style={{ color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Perfect for side projects and small experiments.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
                   {[
                     "1,000 emails / month",
                     "Basic delivery logs",
                     "Community support",
                     "Standard delivery speed"
                   ].map((item, i) => (
                     <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', alignItems: 'center' }}>
                       <Check size={18} style={{ color: '#10b981' }} /> {item}
                     </div>
                   ))}
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem' }}>Start Free</button>
              </div>

              {/* Growth */}
              <div className="glass" style={{ padding: '5rem 3.5rem', borderRadius: '3rem', border: '2px solid var(--primary)', position: 'relative', transform: 'scale(1.05)', zIndex: 10, background: 'rgba(79, 70, 229, 0.03)' }}>
                <div style={{ position: 'absolute', top: '-1.2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>Growth</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '4.5rem', fontWeight: 800 }}>{billingCycle === "monthly" ? "$29" : "$23"}</span>
                  <span style={{ color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>For growing startups that ship production features.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
                   {[
                     "50,000 emails / month",
                     "Priority regional delivery",
                     "Advanced domain tools",
                     "Direct email support",
                     "Shared IP protection"
                   ].map((item, i) => (
                     <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', alignItems: 'center' }}>
                       <Check size={20} style={{ color: 'var(--primary)' }} /> {item}
                     </div>
                   ))}
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1.4rem' }}>Get Started</button>
              </div>

              {/* Scale */}
              <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '1rem' }}>Scale</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1rem 0 1.5rem' }}>Custom</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Enterprise-grade communication infrastructure.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
                   {[
                     "Unlimited emails",
                     "Multi-channel (SMS/WA)",
                     "Dedicated support engineer",
                     "99.99% Uptime SLA",
                     "Dedicated IP pools"
                   ].map((item, i) => (
                     <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', alignItems: 'center' }}>
                       <Check size={18} style={{ color: 'var(--secondary)' }} /> {item}
                     </div>
                   ))}
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem' }}>Contact Sales</button>
              </div>
           </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section style={{ padding: '12rem 1rem' }}>
        <div className="max-w-5xl glass" style={{ borderRadius: '4rem', padding: '8rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.6))', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
           <div className="mesh-gradient" style={{ opacity: 0.2 }}></div>
           <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.04em' }}>Ready to send emails <br/>that actually work?</h2>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>Join 500+ African startups already using Relay Africa.</p>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '1.4rem 4rem', fontSize: '1.1rem' }}>Get Started Free</a>
              <button className="btn btn-secondary" style={{ padding: '1.4rem 4rem', fontSize: '1.1rem' }}>View the Docs</button>
           </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '10rem 1rem 6rem', background: 'rgba(2, 6, 23, 0.5)' }}>
         <div className="max-w-7xl">
           <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '6rem', marginBottom: '8rem' }}>
              <div>
                 <div className="sidebar-brand" style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Relay Africa</div>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '300px' }}>
                   Providing the communication layer for the next billion African internet users.
                 </p>
                 <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Twitter size={24} /></a>
                    <a href="#" style={{ color: 'var(--text-muted)', transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Github size={24} /></a>
                 </div>
              </div>
              {[
                { title: "Product", links: ["Features", "Pricing", "Integration", "Status"] },
                { title: "Developers", links: ["Documentation", "API Reference", "SDKs", "Open Source"] },
                { title: "Company", links: ["About Us", "Careers", "Security", "Contact"] }
              ].map((group, i) => (
                <div key={i}>
                   <h5 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2.5rem', color: 'white' }}>{group.title}</h5>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      {group.links.map((link, j) => (
                        <a key={j} href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1rem', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>{link}</a>
                      ))}
                   </div>
                </div>
              ))}
           </div>
           
           <div style={{ paddingTop: '4rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div>© 2026 Relay Africa. Built with ♥ in Lagos, Accra, and Nairobi.</div>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Policy</a>
              </div>
           </div>
         </div>
      </footer>
    </main>
  );
}
