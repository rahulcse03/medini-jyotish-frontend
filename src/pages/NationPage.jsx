import { useState, useEffect, useRef } from 'react';
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

/* Compact bar shown after a nation is selected — replaces the full grid */
function SelectedNationBar({ nation, onChangeClick }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      background: 'var(--burnt-sienna)', color: 'var(--parchment-light)', padding: '14px 20px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>{nation.flag}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 17, fontWeight: 600 }}>{nation.name_sa}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{nation.name} · {nation.date}</div>
        </div>
      </div>
      <button onClick={onChangeClick} style={{
        background: 'rgba(255,255,255,0.15)', color: 'var(--parchment-light)', border: '1px solid rgba(255,255,255,0.3)',
        padding: '8px 18px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, letterSpacing: 1,
        transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
      >
        ↻ Change Nation
      </button>
    </div>
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

function TransitCard({ t }) {
  const toneColor = t.tone === 'positive' ? 'var(--sage)' : 'var(--blood)';
  const toneLabel = t.tone === 'positive' ? 'शुभ Favorable' : 'सावधान Challenging';
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{t.graha_sa}</span>
          <span style={{ fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 6 }}>{t.graha}{t.is_retrograde ? ' (वक्री Retrograde)' : ''}</span>
        </div>
        <span style={{ fontSize: 11, color: toneColor, border: `1px solid ${toneColor}`, padding: '2px 10px' }}>{toneLabel}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ochre)', marginBottom: 6 }}>
        Transiting {t.rashi_sa} {t.rashi} → House {t.transit_house} ({t.house_name_sa} · {t.house_name})
      </div>
      <div style={{ fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7 }}>
        {t.graha} currently {t.reading}
      </div>
    </div>
  );
}

export default function NationPage() {
  const [nations, setNations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [kundli, setKundli] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    getNationsList().then(data => { setNations(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selectNation = async (key) => {
    setSelected(key);
    setShowGrid(false);
    setChartLoading(true);
    setKundli(null);
    try {
      const data = await getNationKundli(key);
      setKundli(data);
      // scroll to chart after data loads
      setTimeout(() => chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (e) { console.error(e); }
    setChartLoading(false);
  };

  const handleChangeNation = () => {
    setShowGrid(true);
  };

  if (loading) return <LoadingSkeleton />;

  const selectedNation = nations.find(n => n.key === selected);

  return (
    <div>
      <SectionHeader sa="राष्ट्र कुण्डली" en="Nation Horoscopes" sub="Vedic birth charts of nations based on their founding moments" />

      {/* Show compact bar when a nation is selected and grid is hidden */}
      {selected && !showGrid && selectedNation && (
        <SelectedNationBar nation={selectedNation} onChangeClick={handleChangeNation} />
      )}

      {/* Show full grid when no nation selected OR user clicked "Change" */}
      {showGrid && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8, marginBottom: 24 }}>
          {nations.map(n => <NationCard key={n.key} nation={n} onClick={selectNation} selected={selected === n.key} />)}
        </div>
      )}

      {chartLoading && <LoadingSkeleton />}

      {kundli && !kundli.error && (
        <div ref={chartRef} style={{ animation: 'fadeIn 0.5s ease' }}>
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

          {/* ── Current Analysis (layman-friendly) ── */}
          {kundli.current_analysis && (
            <>
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 22, color: 'var(--ink)' }}>वर्तमान विश्लेषण</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>Current Analysis</div>
                <div style={{ fontSize: 11, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>What the stars say about {kundli.nation?.name || 'this nation'} right now</div>
              </div>

              {/* Current Mahadasha */}
              {kundli.current_analysis.current_dasha?.lord && (
                <div style={{ ...cardStyle, borderLeft: '3px solid var(--ochre)' }}>
                  <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 12, color: 'var(--ochre)', letterSpacing: 2, marginBottom: 6 }}>वर्तमान महादशा</div>
                  <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 24, color: 'var(--ink)', marginBottom: 4 }}>
                    {kundli.current_analysis.current_dasha.lord_sa} महादशा
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--burnt-sienna)', marginBottom: 10 }}>
                    {kundli.current_analysis.current_dasha.lord.charAt(0).toUpperCase() + kundli.current_analysis.current_dasha.lord.slice(1)} Mahadasha · {kundli.current_analysis.current_dasha.start} to {kundli.current_analysis.current_dasha.end}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, marginBottom: 6 }}>
                    {kundli.current_analysis.current_dasha.theme}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7 }}>
                    {kundli.current_analysis.current_dasha.effect}
                  </div>
                </div>
              )}

              {/* ── Yearly Transits (slow planets) ── */}
              {kundli.current_analysis.yearly_transits?.length > 0 && (
                <>
                  <div style={{ textAlign: 'center', margin: '24px 0 14px' }}>
                    <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 18, color: 'var(--ink)' }}>वार्षिक गोचर — {kundli.current_analysis.analysis_year || new Date().getFullYear()}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>This Year's Major Transits over {kundli.nation?.name || 'Nation'}'s Chart</div>
                    <div style={{ fontSize: 10, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>Slow-moving planets — these influences last months to years</div>
                  </div>
                  {kundli.current_analysis.yearly_transits.map((t, i) => <TransitCard key={`y${i}`} t={t} />)}
                </>
              )}

              {/* ── Monthly Transits (fast planets) ── */}
              {kundli.current_analysis.monthly_transits?.length > 0 && (
                <>
                  <div style={{ textAlign: 'center', margin: '24px 0 14px' }}>
                    <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 18, color: 'var(--ink)' }}>मासिक गोचर — {kundli.current_analysis.analysis_month || ''}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>This Month's Transits over {kundli.nation?.name || 'Nation'}'s Chart</div>
                    <div style={{ fontSize: 10, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>Faster planets — these influences shift every few weeks</div>
                  </div>
                  {kundli.current_analysis.monthly_transits.map((t, i) => <TransitCard key={`m${i}`} t={t} />)}
                </>
              )}

              {/* Key themes */}
              {kundli.current_analysis.key_themes?.length > 0 && (
                <>
                  <div style={{ textAlign: 'center', margin: '24px 0 14px' }}>
                    <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 18, color: 'var(--ink)' }}>स्थायी विशेषताएँ</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>Permanent Birth Chart Traits</div>
                    <div style={{ fontSize: 10, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>Enduring characteristics from the nation's founding chart</div>
                  </div>
                  {kundli.current_analysis.key_themes.map((th, i) => (
                    <div key={i} style={{ ...cardStyle, fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>{th}</div>
                  ))}
                </>
              )}
            </>
          )}

          {/* Graha positions */}
          <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>ग्रह स्थिति</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>Birth Chart Positions</div>
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
