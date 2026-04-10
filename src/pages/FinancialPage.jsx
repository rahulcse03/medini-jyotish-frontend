import { useState, useEffect } from 'react';
import { getFinancialAnalysis } from '../api';
import { SectionHeader, Divider } from '../components/Shared';
import { useLang } from '../i18n/LanguageContext';
import { GRAHA_INFO } from '../data/constants';

const OUTLOOK_STYLES = {
  strongly_bullish: { color: '#2D6B3F', bg: 'rgba(45,107,63,0.12)', label: '▲▲' },
  bullish:          { color: '#2D6B3F', bg: 'rgba(45,107,63,0.08)', label: '▲' },
  neutral:          { color: '#9A7209', bg: 'rgba(154,114,9,0.08)', label: '—' },
  bearish:          { color: '#8B2500', bg: 'rgba(139,37,0,0.08)', label: '▼' },
  strongly_bearish: { color: '#8B2500', bg: 'rgba(139,37,0,0.12)', label: '▼▼' },
};

function CyclePhaseCard({ cycle }) {
  const { t } = useLang();
  const phase = cycle.current_phase || {};
  const progress = phase.cycle_progress_pct || 0;

  return (
    <div style={{
      background: 'rgba(245,230,200,0.5)', border: '1px solid rgba(92,64,51,0.15)',
      borderLeft: '3px solid var(--ochre)', padding: '20px 24px', marginBottom: 16,
    }}>
      <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 12, color: 'var(--ochre)', letterSpacing: 2, marginBottom: 10 }}>
        गुरु-शनि चक्र · GURU-SHANI CYCLE
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 32 }}>{phase.icon}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 20, color: 'var(--ink)', fontWeight: 600 }}>{phase.phase_name_sa}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)' }}>{phase.phase_name}</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.8, marginBottom: 14 }}>
        {phase.description}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)', marginBottom: 10 }}>
        <span>गुरु Guru: {cycle.guru_longitude}°</span>
        <span>शनि Shani: {cycle.shani_longitude}°</span>
        <span>Separation: {phase.separation_degrees}°</span>
      </div>
      {/* Progress bar */}
      <div style={{ background: 'rgba(92,64,51,0.08)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--ochre)', borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', marginTop: 4 }}>
        {t('financial.cycleProgress')}{progress}%
      </div>
    </div>
  );
}

function EventCard({ label, children }) {
  return (
    <div style={{
      background: 'rgba(245,230,200,0.5)', border: '1px solid rgba(92,64,51,0.15)',
      padding: '16px 20px', marginBottom: 12,
    }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
      {children}
    </div>
  );
}

function SentimentGauge({ sentiment }) {
  const { t } = useLang();
  const score = sentiment.score || 0;
  const color = score > 0 ? 'var(--sage, #2D6B3F)' : score < 0 ? 'var(--blood, #8B2500)' : 'var(--ochre)';

  return (
    <div style={{
      background: 'rgba(245,230,200,0.5)', border: '1px solid rgba(92,64,51,0.15)',
      borderLeft: `3px solid ${color}`, padding: '20px 24px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <span style={{ fontSize: 36, fontFamily: 'var(--font-body)', fontWeight: 'bold', color }}>{score > 0 ? '+' : ''}{score.toFixed(1)}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 17, color: 'var(--ink)' }}>{sentiment.label_sa}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)' }}>{sentiment.label}</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', marginBottom: 8 }}>
        {t('financial.gaugeScale')}
      </div>
      {/* Visual gauge */}
      <div style={{ position: 'relative', height: 8, background: 'linear-gradient(to right, #8B2500, #9A7209, #2D6B3F)', borderRadius: 4, marginBottom: 14 }}>
        <div style={{
          position: 'absolute', top: -3, left: `${((score + 5) / 10) * 100}%`,
          width: 14, height: 14, borderRadius: '50%', background: 'var(--ink)',
          border: '2px solid var(--parchment-light)', transform: 'translateX(-50%)',
        }} />
      </div>
      <ul style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.9, margin: 0, paddingLeft: 20 }}>
        {sentiment.factors?.map((f, i) => <li key={i} style={{ marginBottom: 4 }}>{f}</li>)}
      </ul>
    </div>
  );
}

function CommodityCard({ commodity, index }) {
  const [expanded, setExpanded] = useState(false);
  const style = OUTLOOK_STYLES[commodity.outlook] || OUTLOOK_STYLES.neutral;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(!expanded)}
      style={{
        background: 'rgba(245,230,200,0.5)', border: '1px solid rgba(92,64,51,0.15)',
        padding: '18px 22px', marginBottom: 14, cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        animation: `fadeSlideIn 0.6s ease ${index * 0.1}s both`,
        borderColor: expanded ? 'rgba(184,134,11,0.4)' : 'rgba(92,64,51,0.15)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{commodity.icon}</span>
          <span style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 16, color: 'var(--ink)', fontWeight: 600 }}>{commodity.name_sa}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)' }}>{commodity.name}</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: style.color,
          background: style.bg, border: `1px solid ${style.color}`,
          padding: '3px 12px', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span>{style.label}</span> {commodity.outlook_sa}
        </span>
      </div>

      {/* Primary graha info */}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)', marginBottom: 6 }}>
        Primary: {commodity.primary_graha_sa} in {commodity.primary_rashi_sa} ({commodity.primary_dignity_sa})
      </div>

      {/* Validity period */}
      {commodity.validity && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)',
          background: 'rgba(184,134,11,0.06)', padding: '4px 10px', marginBottom: 8,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontFamily: 'var(--font-sanskrit)' }}>⏳</span>
          <span>{commodity.validity.label_sa}</span>
          <span style={{ color: 'var(--ochre)' }}>·</span>
          <span>{commodity.validity.label}</span>
          <span style={{ color: 'var(--ochre)' }}>({commodity.validity.duration})</span>
        </div>
      )}

      {/* Factors */}
      {commodity.factors?.length > 0 && (
        <ul style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink)', lineHeight: 1.8, margin: '8px 0 0', paddingLeft: 18 }}>
          {commodity.factors.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      )}

      {/* Expanded description */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(92,64,51,0.1)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7 }}>
            {commodity.description}
          </div>
          <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 13, color: 'var(--ochre)', marginTop: 6, lineHeight: 1.7 }}>
            {commodity.description_sa}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryTimeline({ history }) {
  const { t } = useLang();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--burnt-sienna)', textAlign: 'left' }}>
            <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11, letterSpacing: 1 }}>{t('financial.colYear')}</th>
            <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11 }}>{t('financial.colRashi')}</th>
            <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11 }}>{t('financial.colEvent')}</th>
          </tr>
        </thead>
        <tbody>
          {history?.map((h, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(92,64,51,0.08)' }}>
              <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--ink)' }}>{h.year}</td>
              <td style={{ padding: '10px 8px', fontFamily: 'var(--font-sanskrit)', color: 'var(--ink)' }}>
                {h.rashi_sa} ({h.rashi})
              </td>
              <td style={{ padding: '10px 8px', color: 'var(--burnt-sienna)', fontSize: 12, lineHeight: 1.6 }}>
                {h.event}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FinancialPage() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFinancialAnalysis()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--ochre)', fontFamily: 'var(--font-sanskrit)', fontSize: 18 }}>
        गणना चल रही है...
      </div>
    );
  }

  if (!data) return null;

  const cycle = data.guru_shani_cycle || {};
  const sentiment = data.market_sentiment || {};
  const commodities = data.commodities || [];
  const history = cycle.history || [];
  const lastConj = cycle.last_conjunction;
  const nextConj = cycle.next_conjunction;
  const nextOpp = cycle.next_opposition;

  const graha_summary = data.graha_summary || [];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader
        sa="आर्थिक ज्योतिष"
        en={t('financial.title')}
        sub={`${t('financial.subtitle')} · ${data.analysis_date}`}
      />

      {/* Guru-Shani Cycle Phase */}
      <CyclePhaseCard cycle={cycle} />

      {/* Key Events */}
      {lastConj && (
        <EventCard label={t('financial.lastConj')}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>
            {lastConj.year} — <span style={{ fontFamily: 'var(--font-sanskrit)' }}>{lastConj.rashi_sa}</span> ({lastConj.rashi})
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', lineHeight: 1.7, marginTop: 4 }}>
            {lastConj.event}
          </div>
        </EventCard>
      )}
      {nextConj && (
        <EventCard label={t('financial.nextConj')}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>
            {nextConj.date} — <span style={{ fontFamily: 'var(--font-sanskrit)' }}>{nextConj.rashi_sa}</span> ({nextConj.rashi})
          </div>
        </EventCard>
      )}
      {nextOpp && (
        <EventCard label={t('financial.nextOppo')}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>
            {nextOpp.date} — Guru in <span style={{ fontFamily: 'var(--font-sanskrit)' }}>{nextOpp.guru_rashi_sa}</span> / Shani in <span style={{ fontFamily: 'var(--font-sanskrit)' }}>{nextOpp.shani_rashi_sa}</span>
          </div>
        </EventCard>
      )}

      <Divider />

      {/* Market Sentiment */}
      <SectionHeader sa="बाज़ार भावना" en={t('financial.sentiment')} sub={t('financial.sentimentDesc')} />
      <SentimentGauge sentiment={sentiment} />

      <Divider />

      {/* Commodity Outlook */}
      <SectionHeader sa="वस्तु दृष्टि" en={t('financial.commodity')} sub={t('financial.commodityDesc')} />
      {commodities.map((c, i) => <CommodityCard key={c.key} commodity={c} index={i} />)}

      <Divider />

      {/* Transit Validity Timeline */}
      <SectionHeader sa="ग्रह गोचर काल" en={t('financial.validity')} sub={t('financial.validityDesc')} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--burnt-sienna)', textAlign: 'left' }}>
              <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11, letterSpacing: 1 }}>{t('financial.colGraha')}</th>
              <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11 }}>{t('financial.colCurRashi')}</th>
              <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11 }}>{t('financial.colNextChange')}</th>
              <th style={{ padding: '10px 8px', color: 'var(--ochre)', fontSize: 11 }}>{t('financial.colValidFor')}</th>
            </tr>
          </thead>
          <tbody>
            {graha_summary.map((g, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(92,64,51,0.08)' }}>
                <td style={{ padding: '10px 8px', fontFamily: 'var(--font-sanskrit)', fontWeight: 600, color: 'var(--ink)' }}>
                  {g.graha_sa} {g.is_retrograde ? '↺' : ''}
                </td>
                <td style={{ padding: '10px 8px', color: 'var(--ink)' }}>
                  {g.rashi_sa} ({g.rashi})
                </td>
                <td style={{ padding: '10px 8px', color: 'var(--burnt-sienna)', fontSize: 12 }}>
                  {g.next_sign_change || '—'}
                </td>
                <td style={{ padding: '10px 8px' }}>
                  {g.validity_label ? (
                    <span style={{
                      fontSize: 11, padding: '2px 8px',
                      background: g.days_in_sign < 30 ? 'rgba(139,37,0,0.08)' : g.days_in_sign < 180 ? 'rgba(154,114,9,0.08)' : 'rgba(45,107,63,0.08)',
                      color: g.days_in_sign < 30 ? '#8B2500' : g.days_in_sign < 180 ? '#9A7209' : '#2D6B3F',
                      border: `1px solid ${g.days_in_sign < 30 ? 'rgba(139,37,0,0.2)' : g.days_in_sign < 180 ? 'rgba(154,114,9,0.2)' : 'rgba(45,107,63,0.2)'}`,
                    }}>
                      {g.validity_label}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      {/* Historical Timeline */}
      <SectionHeader sa="ऐतिहासिक गुरु-शनि युति" en={t('financial.historical')} sub={t('financial.historicalDesc')} />
      <HistoryTimeline history={history} />

      <div style={{
        textAlign: 'center', marginTop: 24, fontSize: 11,
        color: 'var(--burnt-sienna)', fontStyle: 'italic', lineHeight: 1.8,
      }}>
        {t('financial.attribution')}
        <br />{t('financial.disclaimer')}
      </div>
    </div>
  );
}
