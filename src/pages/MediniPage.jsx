import { useState } from 'react';
import { SectionHeader, SeverityBadge } from '../components/Shared';
import { useLang } from '../i18n/LanguageContext';

function PredictionCard({ pred, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(!expanded)}
      style={{
        background: 'rgba(245,230,200,0.5)',
        border: '1px solid rgba(92,64,51,0.15)',
        padding: '20px 24px', marginBottom: 16, cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        animation: `fadeSlideIn 0.6s ease ${index * 0.15}s both`,
        borderColor: expanded ? 'rgba(184,134,11,0.4)' : 'rgba(92,64,51,0.15)',
      }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ochre)',
          letterSpacing: 2, textTransform: 'uppercase',
        }}>
          {pred.source} — Ch. {pred.chapter}, v. {pred.verse}
        </span>
        <SeverityBadge severity={pred.severity} sa={pred.severity_sa} />
      </div>

      {/* Sanskrit shloka */}
      <div style={{
        fontFamily: 'var(--font-sanskrit)', fontSize: 17, color: 'var(--ink)',
        lineHeight: 1.9, marginBottom: 12,
        borderLeft: '2px solid var(--ochre)', paddingLeft: 16,
      }}>
        {pred.sanskrit}
      </div>

      {/* Condition */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)',
        marginBottom: 8, fontStyle: 'italic',
      }}>
        {pred.condition_summary}
      </div>

      {/* Effect */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.7,
      }}>
        {pred.effect}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          marginTop: 14, paddingTop: 14,
          borderTop: '1px solid rgba(92,64,51,0.1)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', lineHeight: 2 }}>
            <div><strong>Category:</strong> {pred.category} ({pred.category_sa})</div>
            <div><strong>Affected regions:</strong> {pred.regions?.join(', ')}</div>
            <div><strong>Duration:</strong> {pred.duration?.replace(/_/g, ' ')}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MediniPage({ data }) {
  const { t } = useLang();
  if (!data) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader
        sa="मेदिनी फल"
        en={t('medini.title')}
        sub={`${data.total_active_rules}${data.total_active_rules !== 1 ? t('medini.activePlural') : t('medini.activeSingular')}${t('medini.basedOn')}`}
      />

      {data.predictions?.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 40, color: 'var(--burnt-sienna)', fontStyle: 'italic',
        }}>
          {t('medini.none')}
        </div>
      ) : (
        data.predictions?.map((pred, i) => (
          <PredictionCard key={pred.rule_id} pred={pred} index={i} />
        ))
      )}

      <div style={{
        textAlign: 'center', marginTop: 24, fontSize: 11,
        color: 'var(--burnt-sienna)', fontStyle: 'italic', lineHeight: 1.8,
      }}>
        {t('medini.source')}
        <br />{t('medini.tapDetails')}
      </div>
    </div>
  );
}
