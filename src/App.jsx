import { useState, useEffect, useCallback } from 'react';
import { getGrahaPositions, getPanchang, getMediniPredictions, getEclipseAnalysis, getSamvatsaraPhala } from './api';
import { Nav, Divider, LoadingSkeleton } from './components/Shared';
import GrahaPage from './pages/GrahaPage';
import PanchangPage from './pages/PanchangPage';
import MediniPage from './pages/MediniPage';
import EclipsePage from './pages/EclipsePage';
import SamvatsaraPage from './pages/SamvatsaraPage';
import KundliPage from './pages/KundliPage';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function App() {
  const [active, setActive] = useState('graha');
  const [grahaData, setGrahaData] = useState(null);
  const [panchangData, setPanchangData] = useState(null);
  const [mediniData, setMediniData] = useState(null);
  const [eclipseData, setEclipseData] = useState(null);
  const [samvatsaraData, setSamvatsaraData] = useState(null);
  const [hitCounts, setHitCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [g, p, m, e, sv] = await Promise.all([
        getGrahaPositions(), getPanchang(), getMediniPredictions(), getEclipseAnalysis(), getSamvatsaraPhala(),
      ]);
      setGrahaData(g); setPanchangData(p); setMediniData(m); setEclipseData(e); setSamvatsaraData(sv);
    } catch (e) { console.error('API fetch error:', e); setError('Unable to connect to the Jyotish engine.'); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    fetch(`${API_BASE}/api/v1/counter/hit?tz=${encodeURIComponent(tz)}`, { method: 'POST' })
      .then(r => r.json()).then(data => setHitCounts(data)).catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const i = setInterval(fetchData, 300000); return () => clearInterval(i); }, [fetchData]);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 50%, rgba(196,135,59,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(184,134,11,0.04) 0%, transparent 50%), linear-gradient(180deg, #F5E6C8 0%, #E8D5B0 50%, #D4BC96 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '256px 256px' }} />

      {['top:12px;left:12px', 'top:12px;right:12px', 'bottom:12px;left:12px', 'bottom:12px;right:12px'].map((pos, i) => (
        <div key={i} style={{ position: 'fixed', fontSize: 28, color: 'var(--ochre)', opacity: 0.2, fontFamily: 'var(--font-devanagari)', zIndex: 1, ...Object.fromEntries(pos.split(';').map(p => p.split(':'))) }}>॰</div>
      ))}

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 20px 60px', position: 'relative', zIndex: 2 }}>
        <header style={{ textAlign: 'center', marginBottom: 12, padding: '28px 0 20px', animation: 'fadeIn 1s ease' }}>
          <div style={{ fontSize: 11, color: 'var(--ochre)', letterSpacing: 6, textTransform: 'uppercase', marginBottom: 14, fontFamily: 'var(--font-body)' }}>Based on Varahamihira's Brihat Samhita</div>
          <h1 style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 400, color: 'var(--ink)', margin: '0 0 4px', letterSpacing: 4, lineHeight: 1.2 }}>मेदिनी ज्योतिष</h1>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--burnt-sienna)', letterSpacing: 6, textTransform: 'uppercase' }}>Medini Jyotish</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', marginTop: 14, letterSpacing: 1 }}>
            {time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{' · '}{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </header>

        <Divider />

        {error && (
          <div style={{ background: 'rgba(139,37,0,0.06)', border: '1px solid rgba(139,37,0,0.2)', padding: '12px 16px', marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', textAlign: 'center' }}>
            {error}
            <button onClick={fetchData} style={{ marginLeft: 12, background: 'var(--burnt-sienna)', color: 'var(--parchment-light)', border: 'none', padding: '4px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12 }}>Retry</button>
          </div>
        )}

        <Nav active={active} setActive={setActive} />

        {active === 'kundli' ? (
          <KundliPage />
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {active === 'graha' && <GrahaPage data={grahaData} />}
            {active === 'panchang' && <PanchangPage data={panchangData} />}
            {active === 'medini' && <MediniPage data={mediniData} />}
            {active === 'eclipse' && <EclipsePage data={eclipseData} />}
            {active === 'samvatsara' && <SamvatsaraPage data={samvatsaraData} />}
          </>
        )}

        <Divider />

        <footer style={{ textAlign: 'center', padding: '20px 0 8px' }}>
          <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 16, color: 'var(--ochre)', marginBottom: 14 }}>ॐ गुरवे नमः</div>
          {hitCounts && (
            <div style={{ display: 'inline-block', padding: '14px 28px', marginBottom: 16, border: '1px solid rgba(92,64,51,0.12)', background: 'rgba(245,230,200,0.4)' }}>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 10, color: 'var(--ochre)', letterSpacing: 1, marginBottom: 2 }}>आज के दर्शक</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: 'var(--ink)', fontWeight: 600 }}>{hitCounts.today?.toLocaleString()}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--burnt-sienna)', letterSpacing: 1, textTransform: 'uppercase' }}>Today</div>
                </div>
                <div style={{ width: 1, background: 'rgba(92,64,51,0.15)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 10, color: 'var(--ochre)', letterSpacing: 1, marginBottom: 2 }}>कुल दर्शक</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: 'var(--ink)', fontWeight: 600 }}>{hitCounts.total?.toLocaleString()}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--burnt-sienna)', letterSpacing: 1, textTransform: 'uppercase' }}>Total</div>
                </div>
              </div>
              {hitCounts.top_countries?.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(92,64,51,0.1)', paddingTop: 10 }}>
                  <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 10, color: 'var(--ochre)', letterSpacing: 1, marginBottom: 6 }}>विश्व से दर्शक</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                    {hitCounts.top_countries.slice(0, 8).map(c => (
                      <span key={c.country} style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--burnt-sienna)', padding: '2px 8px', background: 'rgba(184,134,11,0.06)', border: '1px solid rgba(184,134,11,0.1)' }}>
                        {c.country} <strong style={{ color: 'var(--ink)' }}>{c.count}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--burnt-sienna)', lineHeight: 2, maxWidth: 500, margin: '0 auto' }}>
            Based on classical texts of Vedic Jyotish for educational purposes.<br />Not financial, medical, or professional advice.<br />Planetary positions calculated using Swiss Ephemeris (accuracy &lt; 0.001 arc-seconds).
          </div>
        </footer>
      </div>
    </div>
  );
}
