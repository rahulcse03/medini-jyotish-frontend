import { SectionHeader, Divider } from '../components/Shared';
import { useLang } from '../i18n/LanguageContext';

/**
 * Convert a UTC ISO string (e.g. "2026-04-05T00:32:00Z") to local time string.
 * Automatically uses the user's device timezone.
 */
function utcToLocal(utcStr) {
  if (!utcStr) return '--:--';
  try {
    const date = new Date(utcStr);
    if (isNaN(date.getTime())) return utcStr;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return utcStr;
  }
}

/** Get the user's timezone abbreviation (e.g. "IST", "EST", "PST") */
function getTimezoneAbbr() {
  try {
    return Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(new Date())
      .find(p => p.type === 'timeZoneName')?.value || 'Local';
  } catch {
    return 'Local';
  }
}

function PanchangItem({ label, labelSa, value, valueSa, extra }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(92,64,51,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 14, color: 'var(--ink)' }}>{labelSa}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', marginLeft: 8, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{value}</span>
          {valueSa && <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: 'var(--ochre)', marginLeft: 8 }}>{valueSa}</span>}
        </div>
      </div>
      {extra && <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)', marginTop: 4, fontStyle: 'italic' }}>{extra}</div>}
    </div>
  );
}

export default function PanchangPage({ data }) {
  const { t } = useLang();
  if (!data) return null;
  const d = data;
  const tz = getTimezoneAbbr();

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader sa="पञ्चाङ्ग" en={t('panchang.title')} sub={t('panchang.subtitle')} />

      {/* Five Angas */}
      <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '8px 24px' }}>
        <PanchangItem label={t('panchang.tithi')} labelSa="तिथि"
          value={`${d.tithi?.paksha} ${d.tithi?.tithi_name}`}
          valueSa={d.tithi?.paksha_sa}
          extra={`${t('panchang.tithi')} ${d.tithi?.tithi_number} · ${t('panchang.remaining')} ${d.tithi?.remaining_degrees?.toFixed(1)}°`} />

        <PanchangItem label={t('panchang.nakshatra')} labelSa="नक्षत्र"
          value={`${d.nakshatra?.nakshatra} (${t('panchang.pada')} ${d.nakshatra?.pada})`}
          valueSa={d.nakshatra?.nakshatra_sa}
          extra={`${t('panchang.lord')} ${d.nakshatra?.nakshatra_lord} · ${t('panchang.remaining')} ${d.nakshatra?.remaining_degrees?.toFixed(1)}°`} />

        <PanchangItem label={t('panchang.yoga')} labelSa="योग"
          value={d.yoga?.yoga}
          extra={`${t('panchang.remaining')} ${d.yoga?.remaining_degrees?.toFixed(1)}°`} />

        <PanchangItem label={t('panchang.karana')} labelSa="करण"
          value={d.karana?.karana}
          extra={`${t('panchang.remaining')} ${d.karana?.remaining_degrees?.toFixed(1)}°`} />

        <PanchangItem label={t('panchang.vara')} labelSa="वार"
          value={d.vara?.vara}
          valueSa={d.vara?.vara_sa}
          extra={`${t('panchang.lord')} ${d.vara?.vara_lord}`} />
      </div>

      <Divider />

      {/* Sunrise / Sunset + Abhijit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: 'var(--ink)', marginBottom: 10 }}>सूर्योदय / सूर्यास्त</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--burnt-sienna)', lineHeight: 2 }}>
            <div>{t('panchang.sunrise')} <strong style={{ color: 'var(--ink)' }}>{utcToLocal(d.sunrise_utc)}</strong> {tz}</div>
            <div>{t('panchang.sunset')} <strong style={{ color: 'var(--ink)' }}>{utcToLocal(d.sunset_utc)}</strong> {tz}</div>
          </div>
        </div>
        <div style={{ background: 'rgba(245,230,200,0.3)', border: '1px solid rgba(92,64,51,0.15)', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: 'var(--ink)', marginBottom: 10 }}>अभिजित मुहूर्त</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--sage)', fontWeight: 600 }}>
            {utcToLocal(d.abhijit_muhurat?.start_utc)} – {utcToLocal(d.abhijit_muhurat?.end_utc)} {tz}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--burnt-sienna)', marginTop: 4, fontStyle: 'italic' }}>
            {t('panchang.abhijit')}
          </div>
        </div>
      </div>

      {/* Inauspicious periods */}
      <div style={{
        marginTop: 16, background: 'rgba(139,37,0,0.04)',
        border: '1px solid rgba(139,37,0,0.12)', padding: '16px 20px',
      }}>
        <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 13, color: 'var(--blood)', marginBottom: 12 }}>
          अशुभ काल — Inauspicious Periods ({tz})
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, color: 'var(--blood)' }}>{t('panchang.rahuKalam')}</div>
            <strong style={{ color: 'var(--ink)' }}>{utcToLocal(d.rahu_kalam?.start_utc)} – {utcToLocal(d.rahu_kalam?.end_utc)}</strong>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, color: 'var(--blood)' }}>{t('panchang.gulikaKalam')}</div>
            <strong style={{ color: 'var(--ink)' }}>{utcToLocal(d.gulika_kalam?.start_utc)} – {utcToLocal(d.gulika_kalam?.end_utc)}</strong>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, color: 'var(--blood)' }}>{t('panchang.yamaghanda')}</div>
            <strong style={{ color: 'var(--ink)' }}>{utcToLocal(d.yamaghanda?.start_utc)} – {utcToLocal(d.yamaghanda?.end_utc)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
