// Everyday Turkish — internetsiz çalışma
// Kabuk (sayfa, veri, simgeler, yazı tipi) her sürümde yenilenir; ses paketleri ayrı ve kalıcı önbellekte durur,
// adlarında içerik özeti olduğu için yalnızca değişen paketler yeniden iner. Sesleri sayfa tek tek indirir.
const KABUK = 'turkce-kabuk-48ebc58d6d';
const SES = 'turkce-ses';
const KABUK_DOSYALAR = ["./", "ikon-180.png", "ikon-192.png", "ikon-512.png", "ikon-maskable-512.png", "manifest.webmanifest", "veri.js", "yazitipi/7a3188b65975.woff2", "yazitipi/9fecae86b15d.woff2", "yazitipi/c0dd90c78986.woff2", "yazitipi/yazitipi.css"];
const SES_DOSYALAR = new Set(["ses/acil-e.78b7e73b.js", "ses/acil.087e3b32.js", "ses/alisveris-e.80a99421.js", "ses/alisveris.aa98290e.js", "ses/banka-e.7f47c2bc.js", "ses/banka.65adbc62.js", "ses/berber-e.b99618c3.js", "ses/berber.1461f0e5.js", "ses/bulusma-e.d329bb56.js", "ses/bulusma.8bc965d4.js", "ses/duygular-e.b6d6b746.js", "ses/duygular.877ddfbb.js", "ses/ev-e.dcdc7c7f.js", "ses/ev.bad2f8ac.js", "ses/is-e.32a1a9be.js", "ses/is.378f390d.js", "ses/kafe-e.90f377ec.js", "ses/kafe.ebe4691f.js", "ses/kendim-e.461a8980.js", "ses/kendim.5200c5c9.js", "ses/komsu-e.60176863.js", "ses/komsu.722e21b7.js", "ses/kutuphane-e.0b5b0506.js", "ses/kutuphane.04c9646f.js", "ses/lokanta-e.3eee70b6.js", "ses/lokanta.5ffabebe.js", "ses/manav-e.d537f0d1.js", "ses/manav.7efb4011.js", "ses/market-e.b88c2b60.js", "ses/market.511a8433.js", "ses/nezaket-e.bd7eafba.js", "ses/nezaket.093ae3b1.js", "ses/okul-e.f2245b7a.js", "ses/okul.fd5dca20.js", "ses/otel-e.172b6b65.js", "ses/otel.87642a35.js", "ses/renkler-e.05bfd40a.js", "ses/renkler.a5fc0a12.js", "ses/saglik-e.37ffa29e.js", "ses/saglik.adad387d.js", "ses/sayilar-e.69455107.js", "ses/sayilar.2f866dfe.js", "ses/sesler-e.cb570ae0.js", "ses/sesler.34200ec4.js", "ses/sohbet-e.153f5516.js", "ses/sohbet.431da5a0.js", "ses/stratejiler-e.7ff8935d.js", "ses/stratejiler.2d3d647e.js", "ses/tanisma-e.8871e48f.js", "ses/tanisma.82102384.js", "ses/telefon-e.b1043c19.js", "ses/telefon.7e3b25c0.js", "ses/ulasim-e.7f7e0cdc.js", "ses/ulasim.c44150ef.js", "ses/yol-e.4b53432f.js", "ses/yol.54df0ec2.js", "ses/zaman-e.5220b260.js", "ses/zaman.c3c8d6a0.js"]);
self.addEventListener('install', e => {
  // tarayıcının kendi önbelleğindeki eski kopyalar değil, sunucudaki yeni dosyalar alınsın
  e.waitUntil(caches.open(KABUK).then(c => c.addAll(KABUK_DOSYALAR.map(d => new Request(d, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('turkce-') && k !== KABUK && k !== SES) await caches.delete(k);  // yalnızca bu programın eski önbellekleri
    const c = await caches.open(SES);   // artık kullanılmayan eski ses paketlerini temizle
    for (const r of await c.keys()) { const p = new URL(r.url).pathname.split('/').slice(-2).join('/'); if (!SES_DOSYALAR.has(p)) await c.delete(r); }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.includes('/ses/')) {
    e.respondWith(caches.open(SES).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r ||
      fetch(e.request).then(y => { if (y.ok) c.put(e.request, y.clone()); return y; }))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r ||
    (e.request.mode === 'navigate' ? caches.match('./') : null)).then(r => r || fetch(e.request)));
});
