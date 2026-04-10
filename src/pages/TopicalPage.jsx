import { useState, useEffect } from 'react';
import { getTopicalAnalysis } from '../api';
import { SectionHeader, Divider } from '../components/Shared';

const SEV_STYLES = {
  calm:     { color: '#2D6B3F', bg: 'rgba(45,107,63,0.08)',  border: '#2D6B3F' },
  watchful: { color: '#4A6885', bg: 'rgba(74,104,133,0.08)', border: '#4A6885' },
  alert:    { color: '#9A7209', bg: 'rgba(154,114,9,0.08)',  border: '#9A7209' },
  warning:  { color: '#8B2500', bg: 'rgba(139,37,0,0.08)',   border: '#8B2500' },
};

function OverviewCard({ narrative, totalRules, date }) {
  return (
    <div style={{
      background: 'rgba(245,230,200,0.5)', border: '1px solid rgba(92,64,51,0.15)',
      borderLeft: '3px solid var(--ochre)', padding: '20px 24px', marginBottom: 20,
    }}>
      <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 12, color: 'var(--ochre)', letterSpacing: 2, marginBottom: 10 }}>
        समग्र दृष्टि · OVERVIEW
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.8 }}>
        {narrative}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', marginTop: 10 }}>
        {totalRules} Brihat Samhita rules active · {date}
      </div>
    </div>
  );
}

function EvidenceItem({ ev }) {
  const icon = ev.type === 'aggravating' ? '⚠️' : ev.type === 'calming' ? '🛡️' : '🌑';
  return (
    <li style={{ marginBottom: 4, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
      {icon} {ev.detail}
    </li>
  );
}

function PredictionCard({ pred, sevColor }) {
  return (
    <div style={{
      background: 'rgba(92,64,51,0.03)', padding: '10px 14px', marginTop: 8,
      borderLeft: `2px solid ${sevColor}`,
    }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)' }}>
        {pred.source} Ch.{pred.chapter} v.{pred.verse}
      </div>
      {pred.sanskrit && (
        <div style={{
          fontFamily: 'var(--font-sanskrit)', fontSize: 13, borderLeft: '2px solid var(--ochre)',
          paddingLeft: 10, margin: '6px 0', color: 'var(--ink)', lineHeight: 1.7,
        }}>
          {pred.sanskrit}
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', lineHeight: 1.6, marginTop: 4 }}>
        {pred.effect}
      </div>
    </div>
  );
}

function TopicCard({ topic }) {
  const [expanded, setExpanded] = useState(false);
  const sev = topic.severity || {};
  const style = SEV_STYLES[sev.key] || SEV_STYLES.watchful;
  const evidence = topic.evidence || [];
  const preds = topic.top_predictions || [];

  return (
    <div style={{
      background: 'rgba(245,230,200,0.5)', border: '1px solid rgba(92,64,51,0.15)',
      borderLeft: `3px solid ${style.border}`, padding: '18px 22px', marginBottom: 14,
      cursor: 'pointer',
    }} onClick={() => setExpanded(!expanded)}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{topic.icon}</span>
          <div>
            <span style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 17, color: 'var(--ink)', fontWeight: 600 }}>
              {topic.name_sa}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 8 }}>
              {topic.name}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 12, color: style.color, border: `1px solid ${style.color}`,
          padding: '2px 12px', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
        }}>
          {sev.label_sa} · {sev.label}
        </span>
      </div>

      {/* Narrative */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)',
        lineHeight: 1.8, marginTop: 10,
      }}>
        {topic.narrative}
      </div>

      {/* Score bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <div style={{ flex: 1, background: 'rgba(92,64,51,0.06)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${Math.min(100, Math.max(5, ((topic.score || 0) + 2) * 14))}%`,
            background: style.color, borderRadius: 2, transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)' }}>
          {evidence.length} indicators · {preds.length} predictions
        </span>
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(92,64,51,0.1)' }} onClick={e => e.stopPropagation()}>
          {evidence.length > 0 && (
            <>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>
                Planetary Evidence
              </div>
              <ul style={{ margin: '0 0 12px', paddingLeft: 18 }}>
                {evidence.map((ev, i) => <EvidenceItem key={i} ev={ev} />)}
              </ul>
            </>
          )}
          {preds.length > 0 && (
            <>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>
                Brihat Samhita References
              </div>
              {preds.map((p, i) => <PredictionCard key={i} pred={p} sevColor={style.color} />)}
            </>
          )}
        </div>
      )}

      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)', textAlign: 'right', marginTop: 6 }}>
        {expanded ? '▲ collapse' : '▼ tap to expand'}
      </div>
    </div>
  );
}

function GrahaSnapshot({ grahas }) {
  if (!grahas || grahas.length === 0) return null;

  const dignityLabel = {
    uccha: 'उच्च Exalted', neecha: 'नीच Debilitated',
    swakshetra: 'स्वक्षेत्र Own Sign', moolatrikona: 'मूलत्रिकोण Moolatrikona',
  };

  return (
    <>
      <Divider />
      <SectionHeader sa="ग्रह स्थिति" en="Current Planetary Positions" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--burnt-sienna)', textAlign: 'left' }}>
              <th style={{ padding: 6, color: 'var(--ochre)', fontSize: 11 }}>GRAHA</th>
              <th style={{ padding: 6, color: 'var(--ochre)', fontSize: 11 }}>RASHI</th>
              <th style={{ padding: 6, color: 'var(--ochre)', fontSize: 11 }}>DIGNITY</th>
            </tr>
          </thead>
          <tbody>
            {grahas.map((g, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(92,64,51,0.08)' }}>
                <td style={{ padding: 6, fontFamily: 'var(--font-sanskrit)', fontWeight: 600 }}>
                  {g.graha_sa}{g.is_retrograde ? ' वक्री' : ''}
                </td>
                <td style={{ padding: 6 }}>{g.rashi_sa} ({g.rashi})</td>
                <td style={{ padding: 6, fontFamily: 'var(--font-sanskrit)', fontSize: 12 }}>
                  {dignityLabel[g.dignity] || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function TopicalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTopicalAnalysis()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-msg">Analysing the sky…</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;
  if (!data) return null;

  const topics = data.topics || [];
  const sorted = [...topics].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="page-content" style={{ maxWidth: 780, margin: '0 auto' }}>
      <SectionHeader sa="सामयिक विश्लेषण" en="What Does the Sky Say Right Now?" />
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)', textAlign: 'center', marginBottom: 16 }}>
        आज आकाश क्या कहता है? · Live topical analysis based on Brihat Samhita · {data.analysis_date}
      </div>

      <OverviewCard
        narrative={data.overall_narrative}
        totalRules={data.total_active_rules}
        date={data.analysis_date}
      />

      <Divider />

      {sorted.map((t, i) => <TopicCard key={i} topic={t} />)}

      <GrahaSnapshot grahas={data.key_grahas} />
    </div>
  );
}
