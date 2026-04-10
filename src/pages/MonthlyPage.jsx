import { useState, useEffect } from 'react';
import { SectionHeader, LoadingSkeleton } from '../components/Shared';
import { useLang } from '../i18n/LanguageContext';
import { GRAHA_INFO, DIGNITY_COLORS } from '../data/constants';
import { getMonthlySummary } from '../api';

const cardStyle = { background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '16px 20px', marginBottom: 16 };
const thStyle = { padding: '8px 6px', color: 'var(--ochre)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'left' };
const tdStyle = { padding: '8px 6px', borderBottom: '1px solid rgba(92,64,51,0.08)', fontSize: 13 };

function MonthNav({ year, month, onChange }) {
  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const btnStyle = {
    background: 'rgba(245,230,200,0.4)', border: '1px solid rgba(92,64,51,0.2)', padding: '8px 18px',
    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)',
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <button style={btnStyle} onClick={() => onChange(prev.y, prev.m)}>← {names[prev.m]} {prev.y}</button>
      <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)' }}>{names[month]} {year}</div>
      <button style={btnStyle} onClick={() => onChange(next.y, next.m)}>{names[next.m]} {next.y} →</button>
    </div>
  );
}

function SignChangeCard({ c }) {
  const impColor = { high: 'var(--blood)', medium: 'var(--ochre)', low: 'var(--burnt-sienna)' }[c.importance] || 'var(--burnt-sienna)';
  const { t } = useLang();
  const impLabel = { high: t('monthly.major'), medium: t('monthly.notable'), low: t('monthly.minor') }[c.importance] || '';
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)', fontWeight: 600 }}>{c.graha_sa}</span>
          <span style={{ fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 6 }}>{c.graha}</span>
        </div>
        <span style={{ fontSize: 11, color: impColor, border: `1px solid ${impColor}`, padding: '2px 10px' }}>{impLabel}</span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 6 }}>
        {c.from_rashi_sa} ({c.from_rashi}) → {c.to_rashi_sa} ({c.to_rashi})
      </div>
      <div style={{ fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7 }}>{c.commentary}</div>
    </div>
  );
}

function PredictionCard({ p }) {
  const sevStyles = {
    shubh: { bg: 'rgba(74,103,65,0.08)', color: 'var(--sage)', label: 'शुभ' },
    savdhan: { bg: 'rgba(184,134,11,0.08)', color: 'var(--ochre)', label: 'सावधान' },
    chetavani: { bg: 'rgba(139,37,0,0.08)', color: 'var(--blood)', label: 'चेतावनी' },
  };
  const sev = sevStyles[p.severity] || sevStyles.savdhan;
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--ochre)', letterSpacing: 1 }}>{p.source} {p.chapter}.{p.verse}</div>
        <span style={{ fontSize: 11, color: sev.color, background: sev.bg, border: `1px solid ${sev.color}`, padding: '2px 10px' }}>
          {sev.label}
        </span>
      </div>
      {p.sanskrit && (
        <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 16, color: 'var(--ink)', borderLeft: '2px solid var(--ochre)', paddingLeft: 14, margin: '10px 0', lineHeight: 1.8 }}>
          {p.sanskrit}
        </div>
      )}
      <div style={{ fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7, marginTop: 8 }}>{p.effect}</div>
      <div style={{ fontSize: 11, color: 'var(--ochre)', marginTop: 6, fontStyle: 'italic' }}>Condition: {p.condition_summary}</div>
    </div>
  );
}

export default function MonthlyPage() {
  const { t } = useLang();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMonth = async (y, m) => {
    setYear(y);
    setMonth(m);
    setLoading(true);
    setData(null);
    try {
      const result = await getMonthlySummary(y, m);
      setData(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadMonth(year, month); }, []);

  return (
    <div>
      <SectionHeader sa="मासिक सारांश" en={t('monthly.title')} sub={t('monthly.subtitle')} />
      <MonthNav year={year} month={month} onChange={loadMonth} />

      {loading && <LoadingSkeleton />}

      {data && !data.error && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 22, color: 'var(--ink)' }}>{data.title_sa}</div>
            <div style={{ fontSize: 14, color: 'var(--burnt-sienna)', letterSpacing: 2 }}>{data.title}</div>
          </div>

          {/* Theme */}
          <div style={{ ...cardStyle, borderLeft: '3px solid var(--ochre)', lineHeight: 1.8 }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 12, color: 'var(--ochre)', letterSpacing: 2, marginBottom: 8 }}>मासिक विषय</div>
            <div style={{ fontSize: 14, color: 'var(--ink)' }}>{data.theme}</div>
          </div>

          {/* Sign Changes */}
          {data.sign_changes?.length > 0 && (
            <>
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>राशि परिवर्तन</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>{t('monthly.signChanges')}</div>
                <div style={{ fontSize: 10, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>{t('monthly.signChangesDesc')}</div>
              </div>
              {data.sign_changes.map((c, i) => <SignChangeCard key={i} c={c} />)}
            </>
          )}

          {/* Retrogrades */}
          {data.retrogrades?.length > 0 && (
            <>
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>वक्री ग्रह</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>{t('monthly.retrogrades')}</div>
                <div style={{ fontSize: 10, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>{t('monthly.retroDesc')}</div>
              </div>
              {data.retrogrades.map((r, i) => (
                <div key={i} style={cardStyle}>
                  <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{r.graha_sa}</span>
                  <span style={{ fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 6 }}>{r.graha} — वक्री Retrograde in {r.rashi_sa} ({r.rashi})</span>
                </div>
              ))}
            </>
          )}

          {/* Eclipses */}
          {data.eclipses?.length > 0 && (
            <>
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>ग्रहण</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>{t('monthly.eclipses')}</div>
              </div>
              {data.eclipses.map((e, i) => (
                <div key={i} style={{ ...cardStyle, borderLeft: '3px solid var(--blood)' }}>
                  <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)', fontWeight: 600 }}>{e.type_sa} — {e.type}</div>
                  <div style={{ fontSize: 13, color: 'var(--ochre)', margin: '6px 0' }}>{e.date} · {e.rashi_sa} {e.rashi} · {e.nakshatra_sa} {e.nakshatra}</div>
                  <div style={{ fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7 }}>{e.interpretation}</div>
                </div>
              ))}
            </>
          )}

          {/* Planetary Snapshot */}
          {data.planet_snapshot?.length > 0 && (
            <>
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>ग्रह स्थिति</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>
                  {t('monthly.positions')}{data.month_name} 1, {data.year}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--burnt-sienna)' }}>
                      <th style={thStyle}>{t('monthly.colGraha')}</th><th style={thStyle}>{t('monthly.colRashi')}</th><th style={thStyle}>{t('monthly.colNak')}</th><th style={thStyle}>{t('monthly.colDignity')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.planet_snapshot.map((g, i) => {
                      const digLabels = { uccha: 'उच्च', neecha: 'नीच', swakshetra: 'स्वक्षेत्र', moolatrikona: 'मूलत्रिकोण' };
                      const digColor = DIGNITY_COLORS[g.dignity] || 'var(--burnt-sienna)';
                      const retro = g.is_retrograde ? ' वक्री' : '';
                      return (
                        <tr key={i}>
                          <td style={{ ...tdStyle, fontFamily: 'var(--font-devanagari)', fontWeight: 600 }}>{g.graha_sa}{retro}</td>
                          <td style={tdStyle}>{g.rashi_sa} {g.rashi} {g.degree}°</td>
                          <td style={tdStyle}>{g.nakshatra}</td>
                          <td style={{ ...tdStyle, color: digColor, fontFamily: 'var(--font-devanagari)', fontSize: 12 }}>{digLabels[g.dignity] || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Brihat Samhita Predictions */}
          {data.predictions?.length > 0 && (
            <>
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 20, color: 'var(--ink)' }}>बृहत् संहिता — सक्रिय फल</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', letterSpacing: 2, textTransform: 'uppercase' }}>{t('monthly.bsPredictions')}</div>
                <div style={{ fontSize: 10, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>{data.total_predictions}{t('monthly.rulesActive')}</div>
              </div>
              {data.predictions.map((p, i) => <PredictionCard key={i} p={p} />)}
            </>
          )}
        </div>
      )}

      {data?.error && (
        <div style={{ ...cardStyle, color: 'var(--blood)' }}>Error: {data.error}</div>
      )}

      <MonthNav year={year} month={month} onChange={loadMonth} />
    </div>
  );
}
