import { useState, useEffect } from 'react';
import { SectionHeader, LoadingSkeleton } from '../components/Shared';
import { GRAHA_INFO, findGrahaKey, DIGNITY_COLORS } from '../data/constants';
import { getNationsList, getNationKundli } from '../api';

const cardStyle = { background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '16px 20px', marginBottom: 16 };
const labelStyle = { fontFamily: 'var(--font-devanagari)', fontSize: 14, color: 'var(--ink)' };
const subStyle = { fontSize: 12, color: 'var(--burnt-sienna)' };
const thStyle = { padding: '8px 6px', color: 'var(--ochre)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'left' };
const tdStyle = { padding: '8px 6px', borderBottom: '1px solid rgba(92,64,51,0.08)', fontSize: 13 };

function NationCard({ nation, onClick, selected }) {
  return (
    <button onClick={() => onClick(nation.key)} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', width: '100%', textAlign: 'left', cursor: 'pointer',
      background: selected ? 'var(--burnt-sienna)' : 'rgba(245,230,200,0.3)', color: selected ? 'var(--parchment-light)' : 'var(--ink)',
      border: '1px solid rgba(92,64,51,0.15)', marginBottom: 8, transition: 'all 0.2s', fontFamily: 'var(--font-body)',
    }}>
      <span style={{ fontSize: 24 }}>{nation.flag}</span>
      <div>
        <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, fontWeight: 500 }}>{nation.name_sa}</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{nation.name}</div>
        <div style={{ fontSize: 10, opacity: 0.6 }}>{nation.date} · {nation.place}</div>
      </div>
    </button>
  );
}

function GrahaTable({ grahas }) {
  const order = ['surya', 'chandra', 'mangal', 'budh', 'guru', 'shukra', 'shani', 'rahu', 'ketu'];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--burnt-sienna)' }}>
            <th style={thStyle}>Graha</th><th style={thStyle}>Rashi</th><th style={thStyle}>Nak</th>
            <th style={thStyle}>House</th><th style={thStyle}>Dignity</th>
          </tr>
        </thead>
        <tbody>
          {order.map(key => {
            const g = grahas[key];
            if (!g) return null;
            const info = GRAHA_INFO[key] || {};
            const dig = g.dignity || '';
            const digColor = DIGNITY_COLORS[dig] || 'var(--burnt-sienna)';
            const digLabels = { uccha: 'उच्च', neecha: 'नीच', swakshetra: 'स्वक्षेत्र', moolatrikona: 'मूलत्रिकोण' };
            const retro = g.is_retrograde ? ' ᴿ' : '';
            return (
              <tr key={key}>
                <td style={{ ...tdStyle, fontFamily: 'var(--font-devanagari)', fontWeight: 600, color: info.color || 'var(--ink)' }}>
                  {info.sym || ''} {g.name_sa}{retro}
                </td>
                <td style={tdStyle}>{g.rashi_sa} {(g.degree || 0).toFixed(1)}°</td>
                <td style={tdStyle}>{g.nakshatra} P{g.pada}</td>
                <td style={tdStyle}>H{g.house}</td>
                <td style={{ ...tdStyle, color: digColor, fontFamily: 'var(--font-devanagari)', fontSize: 12 }}>
                  {digLabels[dig] || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DashaTable({ dasha }) {
  if (!dasha?.periods) return null;
  const currentLord = dasha.current_dasha?.lord;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--burnt-sienna)' }}>
            <th style={thStyle}>Lord</th><th style={thStyle}>Years</th><th style={thStyle}>Period</th>
          </tr>
        </thead>
        <tbody>
          {dasha.periods.slice(0, 9).map((d, i) => {
            const isCurrent = d.lord === currentLord;
            return (
              <tr key={i} style={isCurrent ? { background: 'rgba(184,134,11,0.08)', fontWeight: 600 } : {}}>
                <td style={{ ...tdStyle, fontFamily: 'var(--font-devanagari)' }}>{d.lord_sa} {isCurrent ? '←' : ''}</td>
                <td style={tdStyle}>{d.years} yrs</td>
                <td style={tdStyle}>{d.start} — {d.end}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function NationPage() {
  const [nations, setNations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [kundli, setKundli] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    getNationsList().then(data => { setNations(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selectNation = async (key) => {
    setSelected(key);
    setChartLoading(true);
    setKundli(null);
    try {
      const data = await getNationKundli(key);
      setKundli(data);
    } catch (e) { console.error(e); }
    setChartLoading(false);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <SectionHeader sa="राष्ट्र कुण्डली" en="Nation Horoscopes" sub="Vedic birth charts of nations based on their founding moments" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8, marginBottom: 24 }}>
        {nations.map(n => <NationCard key={n.key} nation={n} onClick={selectNation} selected={selected === n.key} />)}
      </div>

      {chartLoading && <LoadingSkeleton />}

      {kundli && !kundli.error && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          {/* Nation info */}
          {kundli.nation && (
            <div style={{ ...cardStyle, fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7 }}>
              {kundli.nation.note}
            </div>
          )}

          {/* Lagna */}
          <div style={{ ...cardStyle, textAlign: 'center', padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 12, color: 'var(--ochre)', letterSpacing: 2, marginBottom: 8 }}>लग्न</div>
            <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 32, color: 'var(--ink)' }}>{kundli.lagna?.rashi_sa}</div>
            <div style={{ fontSize: 15, color: 'var(--burnt-sienna)', marginTop: 4 }}>
              {kundli.lagna?.rashi} · {(kundli.lagna?.degree || 0).toFixed(1)}°
            </div>
            <div style={{ fontSize: 12, color: 'var(--ochre)', marginTop: 4 }}>
              {kundli.lagna?.nakshatra} Pada {kundli.lagna?.pada} · Navamsha: {kundli.lagna?.navamsha_rashi_sa} {kundli.lagna?.navamsha_rashi}
            </div>
          </div>

          {/* Interpretation - Lagna summary */}
          {kundli.interpretation?.lagna_summary?.personality && (
            <div style={cardStyle}>
              <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7 }}>
                <strong>Personality:</strong> {kundli.interpretation.lagna_summary.personality}
              </div>
              <div style={{ fontSize: 13, color: 'var(--sage)', marginTop: 6 }}>
                <strong>Strengths:</strong> {kundli.interpretation.lagna_summary.strengths}
              </div>
              <div style={{ fontSize: 13, color: 'var(--blood)', marginTop: 4 }}>
                <strong>Challenges:</strong> {kundli.interpretation.lagna_summary.challenges}
              </div>
            </div>
          )}

          {/* Graha positions */}
          <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>ग्रह स्थिति</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>Planetary Positions</div>
          </div>
          <GrahaTable grahas={kundli.grahas} />

          {/* Dasha */}
          <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>विंशोत्तरी दशा</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>Vimshottari Dasha</div>
            {kundli.vimshottari_dasha && (
              <div style={{ fontSize: 11, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>
                Birth Nakshatra: {kundli.vimshottari_dasha.birth_nakshatra_sa} · Lord: {kundli.vimshottari_dasha.birth_nakshatra_lord}
              </div>
            )}
          </div>
          <DashaTable dasha={kundli.vimshottari_dasha} />

          {/* House interpretations */}
          {kundli.interpretation?.houses?.length > 0 && (
            <>
              <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>कुण्डली व्याख्या</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>Chart Interpretation</div>
              </div>
              {kundli.interpretation.houses.filter(h => h.text).map((h, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, marginBottom: 4 }}>
                    {h.graha_sa} in {h.rashi_sa} — House {h.house}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--burnt-sienna)' }}>{h.text}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {kundli?.error && (
        <div style={{ ...cardStyle, color: 'var(--blood)' }}>Error: {kundli.error}</div>
      )}
    </div>
  );
}
