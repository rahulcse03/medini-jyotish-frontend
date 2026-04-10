import { SectionHeader, SeverityBadge, Divider } from '../components/Shared';
import { useLang } from '../i18n/LanguageContext';
import { useState } from 'react';

function utcToLocal(utcStr) {
  if (!utcStr) return '--';
  try {
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return utcStr;
    return d.toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
  } catch { return utcStr; }
}

function utcToDate(utcStr) {
  if (!utcStr) return '--';
  try {
    const d = new Date(utcStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return utcStr; }
}

function EclipseCard({ eclipse, index }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const isSolar = eclipse.kind === 'solar';

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>
            {isSolar ? 'सूर्यग्रहण' : 'चन्द्रग्रहण'}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--burnt-sienna)' }}>
            {eclipse.type}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <SeverityBadge severity={eclipse.severity} sa={eclipse.severity_sa} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)', marginTop: 6 }}>
            {utcToDate(eclipse.datetime_utc)}
          </div>
        </div>
      </div>

      {/* Rashi and Nakshatra */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12,
        padding: '12px 16px', background: 'rgba(184,134,11,0.05)',
        border: '1px solid rgba(184,134,11,0.1)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ochre)', marginBottom: 4 }}>{t('eclipse.rashi')}</div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, color: 'var(--ink)' }}>{eclipse.rashi_sa}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 8 }}>{eclipse.rashi} {eclipse.degree_in_rashi}°</span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ochre)', marginBottom: 4 }}>{t('eclipse.nakshatra')}</div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, color: 'var(--ink)' }}>{eclipse.nakshatra_sa}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Pada {eclipse.pada}</span>
        </div>
      </div>

      {/* Sanskrit */}
      <div style={{
        fontFamily: 'var(--font-sanskrit)', fontSize: 15, color: 'var(--ink)',
        lineHeight: 1.8, marginBottom: 10,
        borderLeft: '2px solid var(--ochre)', paddingLeft: 16,
      }}>
        {eclipse.sanskrit}
      </div>

      {/* Prediction */}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.7, marginBottom: 8 }}>
        {eclipse.prediction}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(92,64,51,0.1)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', lineHeight: 2.2 }}>
            <div><strong>{t('eclipse.affectedRegions')}</strong> {eclipse.affected_regions?.join(', ')}</div>
            <div><strong>{t('eclipse.direction')}</strong> {eclipse.direction}</div>
            <div><strong>{t('eclipse.effectCategory')}</strong> {eclipse.effect_category}</div>
            <div><strong>{t('eclipse.effectDuration')}</strong> {eclipse.effect_duration_months} {t('eclipse.months')}</div>
            <div><strong>{t('eclipse.nakshatraEffect')}</strong> {eclipse.nakshatra_effect}</div>
            <div><strong>{t('eclipse.source')}</strong> {eclipse.source}</div>

            {eclipse.timing && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(92,64,51,0.08)' }}>
                <strong>{t('eclipse.timing')}</strong>
                {eclipse.timing.penumbral_begin_utc && <div>{t('eclipse.penumbralBegin')} {utcToLocal(eclipse.timing.penumbral_begin_utc)}</div>}
                {eclipse.timing.partial_begin_utc && <div>{t('eclipse.partialBegin')} {utcToLocal(eclipse.timing.partial_begin_utc)}</div>}
                {eclipse.timing.total_begin_utc && <div>{t('eclipse.totalityBegin')} {utcToLocal(eclipse.timing.total_begin_utc)}</div>}
                {eclipse.timing.total_end_utc && <div>{t('eclipse.totalityEnd')} {utcToLocal(eclipse.timing.total_end_utc)}</div>}
                {eclipse.timing.partial_end_utc && <div>{t('eclipse.partialEnd')} {utcToLocal(eclipse.timing.partial_end_utc)}</div>}
                {eclipse.timing.penumbral_end_utc && <div>{t('eclipse.penumbralEnd')} {utcToLocal(eclipse.timing.penumbral_end_utc)}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EclipsePage({ data }) {
  const { t } = useLang();
  if (!data) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader
        sa="ग्रहण फल"
        en={t('eclipse.title')}
        sub={`${data.total_upcoming}${t('eclipse.subtitle')}`}
      />

      {data.eclipses?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--burnt-sienna)', fontStyle: 'italic' }}>
          {t('eclipse.none')}
        </div>
      ) : (
        data.eclipses?.map((ecl, i) => (
          <EclipseCard key={`${ecl.kind}-${ecl.date}`} eclipse={ecl} index={i} />
        ))
      )}

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--burnt-sienna)', fontStyle: 'italic', lineHeight: 1.8 }}>
        {t('eclipse.attribution')}
        <br />{t('eclipse.tapDetails')}
      </div>
    </div>
  );
}
