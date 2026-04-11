import { useEffect, useRef } from 'react';

/**
 * Google AdSense ad unit that blends with the parchment manuscript theme.
 * Replace data-ad-client and data-ad-slot with your actual values.
 *
 * Props:
 *   slot   – AdSense ad slot ID (string)
 *   format – 'auto' | 'horizontal' | 'vertical' | 'rectangle' (default: 'auto')
 *   style  – additional container style overrides
 */
export default function AdUnit({ slot = 'XXXXXXXXXX', format = 'auto', style = {} }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded (adblocker, dev mode, etc.)
    }
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      margin: '20px 0',
      padding: '12px 0',
      borderTop: '1px solid rgba(92,64,51,0.08)',
      borderBottom: '1px solid rgba(92,64,51,0.08)',
      minHeight: 90,
      ...style,
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5942964160941180"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
