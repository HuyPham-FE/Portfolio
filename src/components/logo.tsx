/**
 * HUYLAB lockup: the supplied bird mark (background keyed out, otherwise untouched)
 * beside a live-text wordmark so it stays crisp at header size. The parent link
 * carries the accessible name.
 */
export function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <img src="/images/huylab-mark.webp" alt="" width="64" height="80" />
      <span>HUYLΛB</span>
    </span>
  );
}
