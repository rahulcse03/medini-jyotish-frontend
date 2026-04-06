import { useState } from 'react';
import { SectionHeader, Divider, SeverityBadge } from '../components/Shared';
import { GRAHA_INFO, findGrahaKey, DIGNITY_COLORS, SEVERITY_STYLES } from '../data/constants';

const API_BASE = import.meta.env.VITE_API_BASE || '';

function KundliForm({ onGenerate, loading }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');
  const [tz, setTz] = useState('5.5');
  const [name, setName] = useState('');

  const commonPlaces = [
    { label: 'Delhi', lat: 28.6139, lon: 77.2090, tz: 5.5 },
    { label: 'Mumbai', lat: 19.0760, lon: 72.8777, tz: 5.5 },
    { label: 'Bangalore', lat: 12.9716, lon: 77.5946, tz: 5.5 },
    { label: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 5.5 },
    { label: 'Kolkata', lat: 22.5726, lon: 88.3639, tz: 5.5 },
    { label: 'Hyderabad', lat: 17.3850, lon: 78.4867, tz: 5.5 },
    { label: 'Pune', lat: 18.5204, lon: 73.8567, tz: 5.5 },
    { label: 'Jaipur', lat: 26.9124, lon: 75.7873, tz: 5.5 },
    { label: 'London', lat: 51.5074, lon: -0.1278, tz: 0 },
    { label: 'New York', lat: 40.7128, lon: -74.0060, tz: -5 },
    { label: 'Dubai', lat: 25.2048, lon: 55.2708, tz: 4 },
    { label: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
  ];

  const selectPlace = (p) => { setPlace(p.label); setLat(String(p.lat)); setLon(String(p.lon)); setTz(String(p.tz)); };
  const handleSubmit = () => { if (date && time) onGenerate({ date, time, lat: parseFloat(lat), lon: parseFloat(lon), tz: parseFloat(tz), name, place }); };

  const inputStyle = { fontFamily: 'var(--font-body)', fontSize: 14, padding: '10px 14px', border: '1px solid rgba(92,64,51,0.25)', background: 'rgba(245,230,200,0.5)', color: 'var(--ink)', width: '100%', outline: 'none' };
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, display: 'block' };

  return (
    <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={labelStyle}>Name (optional)</label><input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></div>
        <div><label style={labelStyle}>Birth Place</label><input style={inputStyle} type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="City" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={labelStyle}>Birth Date</label><input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div><label style={labelStyle}>Birth Time (local)</label><input style={inputStyle} type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={labelStyle}>Latitude</label><input style={inputStyle} type="number" step="0.0001" value={lat} onChange={e => setLat(e.target.value)} /></div>
        <div><label style={labelStyle}>Longitude</label><input style={inputStyle} type="number" step="0.0001" value={lon} onChange={e => setLon(e.target.value)} /></div>
        <div><label style={labelStyle}>Timezone (UTC±)</label><input style={inputStyle} type="number" step="0.5" value={tz} onChange={e => setTz(e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Quick Select</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {commonPlaces.map(p => (
            <button key={p.label} onClick={() => selectPlace(p)} style={{ fontFamily: 'var(--font-body)', fontSize: 11, padding: '4px 10px', background: place === p.label ? 'var(--burnt-sienna)' : 'rgba(184,134,11,0.08)', color: place === p.label ? 'var(--parchment-light)' : 'var(--burnt-sienna)', border: '1px solid rgba(92,64,51,0.15)', cursor: 'pointer' }}>{p.label}</button>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit} disabled={!date || !time || loading} style={{ width: '100%', padding: '14px', fontFamily: 'var(--font-devanagari)', fontSize: 16, background: 'var(--burnt-sienna)', color: 'var(--parchment-light)', border: 'none', cursor: date && time ? 'pointer' : 'not-allowed', letterSpacing: 2, opacity: date && time ? 1 : 0.5 }}>
        {loading ? 'गणना हो रही है...' : 'कुण्डली बनाएं — Generate Kundli'}
      </button>
    </div>
  );
}

function Cell({ house, isLagna }) {
  if (!house) return <div style={{ background: 'var(--parchment-light)', padding: 6 }} />;
  return (
    <div style={{ background: isLagna ? 'rgba(184,134,11,0.08)' : 'var(--parchment-light)', padding: '6px 4px', minHeight: 60, position: 'relative' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--ochre)', position: 'absolute', top: 2, left: 4 }}>{house.house_number}</div>
      <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 9, color: 'var(--burnt-sienna)', position: 'absolute', top: 2, right: 4 }}>{house.rashi_sa}</div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {house.grahas?.map(gk => { const info = GRAHA_INFO[gk]; return info ? <span key={gk} style={{ fontFamily: 'var(--font-devanagari)', fontSize: 12, color: info.color, fontWeight: 700, margin: '0 2px' }}>{info.sym}</span> : null; })}
      </div>
    </div>
  );
}

function RashiChart({ houses, lagna, title, titleSa }) {
  if (!houses) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, color: 'var(--ink)' }}>{titleSa}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(92,64,51,0.2)', border: '2px solid var(--burnt-sienna)', maxWidth: 400, margin: '0 auto' }}>
        <Cell house={houses[11]} /><Cell house={houses[0]} isLagna /><Cell house={houses[1]} /><Cell house={houses[2]} />
        <Cell house={houses[10]} />
        <div style={{ gridColumn: 'span 2', gridRow: 'span 2', background: 'var(--parchment-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 8, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 12, color: 'var(--ochre)' }}>{titleSa}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--burnt-sienna)', marginTop: 4 }}>Lagna: {lagna?.rashi_sa} {lagna?.degree?.toFixed(1)}°</div>
        </div>
        <Cell house={houses[3]} />
        <Cell house={houses[9]} /><Cell house={houses[4]} />
        <Cell house={houses[8]} /><Cell house={houses[7]} /><Cell house={houses[6]} /><Cell house={houses[5]} />
      </div>
    </div>
  );
}

function InterpretationSection({ interpretation }) {
  if (!interpretation) return null;
  const interp = interpretation;

  return (
    <div style={{ animation: 'fadeSlideIn 0.5s ease 0.2s both' }}>
      {/* Overall Assessment */}
      <div style={{ background: 'rgba(184,134,11,0.06)', border: '1px solid rgba(184,134,11,0.15)', padding: '16px 20px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.8, fontStyle: 'italic' }}>
          {interp.overall_assessment}
        </div>
      </div>

      {/* Lagna Personality */}
      {interp.lagna_personality?.personality && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)' }}>लग्न व्यक्तित्व</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Your Personality</span>
          </div>
          <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.8, marginBottom: 12 }}>
              {interp.lagna_personality.personality}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--sage)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Strengths</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)' }}>{interp.lagna_personality.strengths}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--blood)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Challenges</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)' }}>{interp.lagna_personality.challenges}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dignity Highlights */}
      {interp.dignity_highlights?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)' }}>विशेष ग्रह स्थिति</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Notable Planetary Positions</span>
          </div>
          {interp.dignity_highlights.map((h, i) => (
            <div key={i} style={{
              background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)',
              padding: '14px 20px', marginBottom: 8,
              borderLeft: `3px solid ${h.severity === 'shubh' ? 'var(--sage)' : 'var(--blood)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, color: 'var(--ink)' }}>
                  {h.graha_sa} <span style={{ fontFamily: 'var(--font-body)', fontSize: 12 }}>{h.graha}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, padding: '2px 10px',
                  background: h.severity === 'shubh' ? 'rgba(74,103,65,0.1)' : 'rgba(139,37,0,0.1)',
                  color: h.severity === 'shubh' ? 'var(--sage)' : 'var(--blood)',
                  border: `1px solid ${h.severity === 'shubh' ? 'var(--sage)' : 'var(--blood)'}`,
                }}>
                  {h.dignity_sa} {h.dignity_en}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', marginBottom: 6 }}>
                {h.rashi_sa} {h.rashi} · House {h.house}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>
                {h.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Planet Readings — collapsible */}
      <PlanetReadings readings={interp.planet_readings} />

      {/* Current Dasha */}
      {interp.current_dasha?.meaning && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)' }}>वर्तमान दशा</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Current Life Phase</span>
          </div>
          <div style={{ background: 'rgba(74,103,65,0.05)', border: '1px solid rgba(74,103,65,0.15)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 18, color: 'var(--ink)', textAlign: 'center', marginBottom: 4 }}>
              {interp.current_dasha.lord_sa} महादशा
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', textAlign: 'center', marginBottom: 12 }}>
              {interp.current_dasha.start} to {interp.current_dasha.end}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.8 }}>
              {interp.current_dasha.meaning}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', marginTop: 8, fontStyle: 'italic' }}>
              Keywords: {interp.current_dasha.keywords}
            </div>
          </div>
        </div>
      )}

      {/* Ask the Sage — Premium Placeholder */}
      <AskTheSage />
    </div>
  );
}

function PlanetReadings({ readings }) {
  const [expanded, setExpanded] = useState(false);
  if (!readings?.length) return null;

  const shown = expanded ? readings : readings.slice(0, 3);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)' }}>ग्रह फल</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Planetary Readings</span>
      </div>
      {shown.map((r, i) => {
        const info = GRAHA_INFO[findGrahaKey(r.graha)];
        return (
          <div key={i} style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.1)', padding: '12px 16px', marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: info?.color || 'var(--ink)', fontWeight: 700 }}>
                {r.graha_sa} <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 400, color: 'var(--burnt-sienna)' }}>in {r.rashi_sa} {r.rashi}, House {r.house}</span>
              </span>
              {r.dignity !== 'neutral' && <span style={{ fontSize: 10, color: DIGNITY_COLORS[r.dignity], fontStyle: 'italic' }}>{r.dignity}</span>}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>{r.interpretation}</div>
          </div>
        );
      })}
      {readings.length > 3 && (
        <button onClick={() => setExpanded(!expanded)} style={{
          display: 'block', margin: '8px auto', fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'var(--ochre)', background: 'none', border: '1px solid var(--ochre)',
          padding: '6px 20px', cursor: 'pointer',
        }}>
          {expanded ? 'Show Less' : `Show All ${readings.length} Readings`}
        </button>
      )}
    </div>
  );
}

function AskTheSage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(184,134,11,0.08) 0%, rgba(196,135,59,0.08) 100%)',
      border: '2px solid var(--ochre)', padding: '24px 20px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative corner elements */}
      <div style={{ position: 'absolute', top: 8, left: 8, color: 'var(--ochre)', opacity: 0.3, fontSize: 20 }}>॰</div>
      <div style={{ position: 'absolute', top: 8, right: 8, color: 'var(--ochre)', opacity: 0.3, fontSize: 20 }}>॰</div>
      <div style={{ position: 'absolute', bottom: 8, left: 8, color: 'var(--ochre)', opacity: 0.3, fontSize: 20 }}>॰</div>
      <div style={{ position: 'absolute', bottom: 8, right: 8, color: 'var(--ochre)', opacity: 0.3, fontSize: 20 }}>॰</div>

      <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 22, color: 'var(--ochre)', marginBottom: 6 }}>
        ऋषि से पूछें
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
        Ask the Sage
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.8, maxWidth: 400, margin: '0 auto 16px' }}>
        Get a deeply personalized reading from our Vedic AI Sage. Ask questions about marriage, career, health, wealth, and spiritual growth — answered in the tradition of classical Jyotish.
      </div>
      <button disabled style={{
        fontFamily: 'var(--font-devanagari)', fontSize: 15, padding: '12px 32px',
        background: 'var(--ochre)', color: 'var(--parchment-light)', border: 'none',
        cursor: 'not-allowed', letterSpacing: 2, opacity: 0.7,
      }}>
        शीघ्र आ रहा है — Coming Soon
      </button>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--burnt-sienna)', marginTop: 10, fontStyle: 'italic' }}>
        Powered by AI, rooted in Parashara and Varahamihira's wisdom
      </div>
    </div>
  );
}

export default function KundliPage() {
  const [kundli, setKundli] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (params) => {
    setLoading(true); setError(null);
    try {
      const q = new URLSearchParams({ date: params.date, time: params.time, lat: String(params.lat), lon: String(params.lon), tz: String(params.tz), name: params.name || '', place: params.place || '' });
      const res = await fetch(`${API_BASE}/api/v1/kundli/generate?${q}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setKundli(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader sa="जन्म कुण्डली" en="Birth Chart" sub="Enter birth details to generate your Vedic horoscope with interpretation" />
      <KundliForm onGenerate={handleGenerate} loading={loading} />

      {error && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(139,37,0,0.06)', border: '1px solid rgba(139,37,0,0.2)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--blood)', textAlign: 'center' }}>{error}</div>
      )}

      {kundli && (
        <div style={{ marginTop: 24, animation: 'fadeSlideIn 0.5s ease' }}>
          {kundli.name && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--ink)' }}>{kundli.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)' }}>{kundli.birth_details?.date} · {kundli.birth_details?.time} · {kundli.birth_details?.place}</div>
            </div>
          )}

          {/* Lagna */}
          <div style={{ textAlign: 'center', padding: '12px 20px', marginBottom: 20, background: 'rgba(184,134,11,0.06)', border: '1px solid rgba(184,134,11,0.15)' }}>
            <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: 'var(--ochre)' }}>लग्न</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Ascendant:</span>
            <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)', marginLeft: 8, fontWeight: 600 }}>{kundli.lagna?.rashi_sa}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', marginLeft: 6 }}>{kundli.lagna?.rashi} {kundli.lagna?.degree?.toFixed(2)}°</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>{kundli.lagna?.nakshatra} P{kundli.lagna?.pada}</span>
          </div>

          <RashiChart houses={kundli.houses} lagna={kundli.lagna} title="Rashi Chart (D1)" titleSa="राशि चक्र" />

          <Divider />

          {/* Interpretation */}
          <InterpretationSection interpretation={kundli.interpretation} />

          <Divider />

          {/* Graha Table */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, color: 'var(--ink)' }}>ग्रह स्थिति</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Detailed Positions</span>
            </div>
            <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', overflow: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '55px 80px 50px 90px 40px 65px 60px', padding: '8px 12px', borderBottom: '2px solid rgba(92,64,51,0.2)', fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--burnt-sienna)', letterSpacing: 1, textTransform: 'uppercase', minWidth: 500 }}>
                <div>Graha</div><div>Rashi</div><div>Deg</div><div>Nakshatra</div><div>House</div><div>Dignity</div><div>D9</div>
              </div>
              {Object.entries(kundli.grahas || {}).map(([key, g]) => {
                const info = GRAHA_INFO[key];
                return (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '55px 80px 50px 90px 40px 65px 60px', padding: '8px 12px', borderBottom: '1px solid rgba(92,64,51,0.08)', alignItems: 'center', minWidth: 500 }}>
                    <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: info?.color || 'var(--ink)', fontWeight: 700 }}>{g.name_sa}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink)' }}>{g.rashi_sa} {g.rashi}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)' }}>{g.degree?.toFixed(1)}°</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)' }}>{g.nakshatra} P{g.pada}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink)', fontWeight: 600 }}>{g.house}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: DIGNITY_COLORS[g.dignity] || 'var(--burnt-sienna)', fontStyle: 'italic' }}>{g.dignity !== 'neutral' ? g.dignity : ''}{g.is_retrograde ? ' ℞' : ''}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--burnt-sienna)' }}>{g.navamsha_rashi_sa}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dasha Timeline */}
          {kundli.vimshottari_dasha?.periods && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, color: 'var(--ink)' }}>विंशोत्तरी दशा</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Dasha Periods</span>
              </div>
              <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)' }}>
                {kundli.vimshottari_dasha.periods.slice(0, 12).map((d, i) => {
                  const isActive = kundli.vimshottari_dasha.current_dasha?.lord === d.lord && kundli.vimshottari_dasha.current_dasha?.start === d.start;
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 80px', padding: '8px 16px', borderBottom: '1px solid rgba(92,64,51,0.08)', background: isActive ? 'rgba(74,103,65,0.06)' : 'transparent', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, color: isActive ? 'var(--sage)' : 'var(--ink)', fontWeight: isActive ? 700 : 400 }}>{d.lord_sa}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)' }}>{d.start} → {d.end}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', textAlign: 'right' }}>{d.years} yrs</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
