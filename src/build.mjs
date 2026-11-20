// Be Fit & Flex — zero-dependency static site generator. Usage: node src/build.mjs
// Env: BASE (path the site is served from, default "/"), PREVIEW=1 (claude.ai preview build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = __dirname;
const PREVIEW = !!process.env.PREVIEW;
const OUT = path.resolve(SRC, '..', PREVIEW ? 'docs-preview' : 'docs');
const BASE = process.env.BASE ?? '/';
const { site } = C;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const has = (f) => fs.existsSync(path.join(SRC, 'assets/img', f));
function dims(file) {
  const b = fs.readFileSync(path.join(SRC, 'assets/img', file));
  if (b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  const c = b.toString('ascii', 12, 16);
  if (c === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (c === 'VP8L') { const n = b.readUInt32LE(21); return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
  return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
}
function img(r, file, alt = '', { sizes = '100vw', eager = false, cls = '' } = {}) {
  const { w, h } = dims(file);
  const small = file.replace(/\.webp$/, '-800.webp');
  const srcset = has(small) ? ` srcset="${r}assets/img/${small} 800w, ${r}assets/img/${file} ${w}w" sizes="${sizes}"` : '';
  return `<img src="${r}assets/img/${file}"${srcset} width="${w}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const pimg = (r, p, i = 0, opts) => img(r, 'products/' + p.images[i], `${p.name}`, opts);
const price = (p) => (p.price ? `${Number(p.price).toFixed(2)} ${site.currency}` : 'Price coming soon');
const catName = (id) => (C.categories.find((c) => c.id === id) || {}).name || '';
const buyUrl = (p) => p.shopify || (site.shopifyStore ? site.shopifyStore.replace(/\/$/, '') + '/products/' + p.slug : '');

const I = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  bag: '<path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  ruler: '<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  spark: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
};
const icon = (n, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const wa = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

const NAV = [
  ['shop/', 'Shop', 'shop'],
  ...C.categories.filter((c) => C.products.some((p) => p.category === c.id)).map((c) => [`shop/#${c.id}`, c.name, '']),
  ['about/', 'Our Story', 'about'],
  ['size-guide/', 'Size Guide', 'size'],
  ['help/', 'Help', 'help'],
];

function layout({ r, title, key = '', body, desc = site.description, ogImg = 'hero-tree-pose.webp', base = '' }) {
  const t = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${base ? `<base href="${base}">` : ''}
<title>${esc(t)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0b0b0b">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${site.url}/assets/img/${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${r}assets/img/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="${r}assets/img/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/css/style.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="announce">Free UAE delivery on orders over 300 ${site.currency} · <a href="${r}size-guide/">Find your size</a></div>
<header class="header">
  <div class="wrap header__in">
    <button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Main"><ul>${NAV.map(([h, l, k]) => `<li><a href="${r}${h}"${k && k === key ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></nav>
    <a class="brand" href="${r}" aria-label="${site.name} home">${img(r, 'ff-logo.webp', '', { sizes: '44px', eager: true, cls: 'brand__mark' })}<span>Be Fit <i>&amp;</i> Flex</span></a>
    <a class="btn btn--gold btn--sm header__shop" href="${site.shopifyStore || r + 'shop/'}"${site.shopifyStore ? ' target="_blank" rel="noopener"' : ''}>${icon('bag')}<span>Shop now</span></a>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="wrap footer__grid">
    <div>
      <a class="brand brand--light" href="${r}">${img(r, 'ff-logo.webp', '', { sizes: '44px', cls: 'brand__mark' })}<span>Be Fit <i>&amp;</i> Flex</span></a>
      <p>${site.tagline}</p>
      <p class="footer__small">Designed by ${site.founder}. A sister brand of <a href="${site.sister.url}" target="_blank" rel="noopener">${site.sister.name}</a>.</p>
    </div>
    <div><h3>Shop</h3><ul><li><a href="${r}shop/">All products</a></li>${C.categories.map((c) => `<li><a href="${r}shop/#${c.id}">${c.name}</a></li>`).join('')}</ul></div>
    <div><h3>Help</h3><ul><li><a href="${r}size-guide/">Size guide</a></li><li><a href="${r}help/">Delivery & returns</a></li><li><a href="${r}help/#contact">Contact us</a></li><li><a href="${r}about/">Our story</a></li></ul></div>
    <div><h3>Join the movement</h3>
      <form class="news" data-news><label class="sr" for="news-email">Email</label><input id="news-email" type="email" required placeholder="Your email"><button class="btn btn--gold btn--sm" type="submit"><span>Join</span></button></form>
      <div class="social"><a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a><a href="${wa('Hi! I have a question about Be Fit & Flex.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a><a href="mailto:${site.email}" aria-label="Email">${icon('mail')}</a></div>
    </div>
  </div>
  <div class="wrap footer__bottom"><p>© <span data-year>2026</span> ${site.name}. All rights reserved.</p><p>${site.domain}</p></div>
</footer>
<a class="wa-float" href="${wa('Hi! I have a question about Be Fit & Flex.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('whatsapp')}</a>
<div class="toast" role="status" aria-live="polite"></div>
<script src="${r}assets/js/main.js" defer></script>
</body>
</html>
`;
}

const card = (r, p, i = 0) => `
<article class="card" data-reveal style="--d:${(i % 4) * 0.06}s" data-cat="${p.category}">
  <a class="card__img" href="${r}products/${p.slug}/">
    ${pimg(r, p, 0, { sizes: '(min-width: 1000px) 25vw, 50vw' })}
    ${p.images[1] ? pimg(r, p, 1, { sizes: '(min-width: 1000px) 25vw, 50vw', cls: 'card__alt' }) : ''}
    ${p.sample ? '<span class="badge">Sample</span>' : ''}
  </a>
  <div class="card__body">
    <p class="card__cat">${catName(p.category)}</p>
    <h3><a href="${r}products/${p.slug}/">${p.name}</a></h3>
    <p class="card__price">${price(p)}</p>
  </div>
</article>`;

function home(r) {
  const H = C.home;
  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div class="hero__text">
      <p class="kicker" data-reveal>Women 30+ · Designed in Dubai</p>
      <h1 data-reveal style="--d:.08s">${H.heroTitle}</h1>
      <p class="lead" data-reveal style="--d:.16s">${H.heroText}</p>
      <div class="row" data-reveal style="--d:.24s"><a class="btn btn--gold" href="${r}shop/"><span>Shop the collection</span>${icon('arrow')}</a><a class="btn btn--ghost" href="${r}about/"><span>Our story</span></a></div>
    </div>
    <div class="hero__media" data-reveal style="--d:.1s">
      <div class="hero__frame">${img(r, 'hero-tree-pose.webp', 'Letchance Ngassa in tree pose wearing the Be Fit & Flex zip jacket and biker shorts', { eager: true, sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
      <div class="hero__seal">${img(r, 'ff-logo.webp', 'Be Fit & Flex FF monogram', { sizes: '120px' })}</div>
    </div>
  </div>
</section>
<div class="ticker" aria-hidden="true"><div class="ticker__track">${Array(2).fill(['Sculpt', 'Stretch', 'Support', 'Squat-proof', 'Made to move', 'Women 30+']).flat().map((w) => `<span>${w}</span>`).join('')}</div></div>
<section class="section">
  <div class="wrap">
    <div class="head" data-reveal><div><p class="kicker">The collection</p><h2>Shop new arrivals</h2></div><a class="link" href="${r}shop/">View all ${icon('arrow')}</a></div>
    <div class="grid">${C.products.slice(0, 8).map((p, i) => card(r, p, i)).join('')}</div>
  </div>
</section>
<section class="section section--ink">
  <div class="wrap values">${H.values.map((v, i) => `<div class="value" data-reveal style="--d:${i * 0.08}s">${icon(['spark', 'swap', 'ruler'][i])}<h3>${v.title}</h3><p>${v.text}</p></div>`).join('')}</div>
</section>
<section class="section">
  <div class="wrap split">
    <div class="split__img" data-reveal>${img(r, 'hero-tree-pose.webp', 'Letchance Ngassa, founder of Be Fit & Flex', { sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
    <div data-reveal style="--d:.1s"><p class="kicker">Our story</p><h2>Born on the mat.</h2>${H.story.map((p) => `<p>${p}</p>`).join('')}<a class="btn btn--ghost-dark" href="${r}about/"><span>Read more</span>${icon('arrow')}</a></div>
  </div>
</section>
<section class="section section--gold">
  <div class="wrap cta" data-reveal><h2>Not sure about your size?</h2><p>Our size guide has you covered — or message us and we'll help you choose.</p><div class="row row--center"><a class="btn btn--ink" href="${r}size-guide/">${icon('ruler')}<span>Size guide</span></a><a class="btn btn--ghost-dark" href="${wa('Hi! Can you help me choose my size?')}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Ask on WhatsApp</span></a></div></div>
</section>`;
}

function shop(r) {
  const cats = C.categories.filter((c) => C.products.some((p) => p.category === c.id));
  return `
<section class="page-head"><div class="wrap"><p class="kicker">Be Fit & Flex</p><h1>Shop the collection</h1><p class="lead">${C.products.length} ${C.products.length === 1 ? 'piece' : 'pieces'} designed to sculpt, stretch and support.</p></div></section>
<section class="section section--tight">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter by category">
      <button class="chip is-on" data-filter="all">All</button>${cats.map((c) => `<button class="chip" data-filter="${c.id}" id="${c.id}">${c.name}</button>`).join('')}
    </div>
    <div class="grid" data-grid>${C.products.map((p, i) => card(r, p, i)).join('')}</div>
  </div>
</section>`;
}

function product(r, p) {
  const url = buyUrl(p);
  const related = C.products.filter((x) => x !== p).slice(0, 4);
  return `
<section class="section section--tight">
  <div class="wrap pdp">
    <div class="gallery" data-gallery>
      <div class="gallery__main">${pimg(r, p, 0, { eager: true, sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
      ${p.images.length > 1 ? `<div class="gallery__thumbs">${p.images.map((im, i) => `<button class="thumb${i === 0 ? ' is-on' : ''}" data-src="${r}assets/img/products/${im}" aria-label="Show photo ${i + 1}">${img(r, 'products/' + im, '', { sizes: '90px' })}</button>`).join('')}</div>` : ''}
    </div>
    <div class="pdp__info">
      <nav class="crumbs"><a href="${r}shop/">Shop</a> / <a href="${r}shop/#${p.category}">${catName(p.category)}</a></nav>
      <h1>${p.name}</h1>
      <p class="pdp__price">${price(p)}</p>
      ${p.sample ? '<p class="note">Sample product — the real catalogue is on its way.</p>' : ''}
      <p>${p.description}</p>
      ${p.colours?.length ? `<div class="opt"><p class="opt__label">Colour: <b data-colour>${p.colours[0]}</b></p><div class="opt__row">${p.colours.map((c, i) => `<button class="chip${i === 0 ? ' is-on' : ''}" data-colour-pick="${esc(c)}">${c}</button>`).join('')}</div></div>` : ''}
      ${p.sizes?.length ? `<div class="opt"><p class="opt__label">Size <a href="${r}size-guide/">Size guide</a></p><div class="opt__row">${p.sizes.map((s) => `<button class="chip chip--size" data-size-pick="${s}">${s}</button>`).join('')}</div></div>` : ''}
      <div class="pdp__buy">
        ${url
          ? `<a class="btn btn--gold btn--wide" href="${url}" target="_blank" rel="noopener">${icon('bag')}<span>Buy on our Shopify store</span></a>`
          : `<a class="btn btn--gold btn--wide" data-wa-order data-product="${esc(p.name)}" href="${wa(`Hi! I'd like to order the ${p.name}.`)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Order on WhatsApp</span></a><p class="small">Online checkout opening soon.</p>`}
      </div>
      <ul class="perks"><li>${icon('truck')} Free UAE delivery over 300 ${site.currency}</li><li>${icon('swap')} Easy exchanges within 14 days</li></ul>
      ${p.details?.length ? `<details open><summary>Details</summary><ul>${p.details.map((d) => `<li>${d}</li>`).join('')}</ul></details>` : ''}
      <details><summary>Care</summary><p>Wash cold, inside out, with similar colours. Do not tumble dry or iron the logo. Air dry flat.</p></details>
    </div>
  </div>
</section>
${related.length ? `<section class="section"><div class="wrap"><div class="head"><h2>Complete the look</h2></div><div class="grid">${related.map((x, i) => card(r, x, i)).join('')}</div></div></section>` : ''}`;
}

function about(r) {
  return `
<section class="page-head page-head--img"><div class="wrap"><p class="kicker">Our story</p><h1>Born on the mat.</h1></div></section>
<section class="section"><div class="wrap split">
  <div class="split__img" data-reveal>${img(r, 'hero-tree-pose.webp', 'Letchance Ngassa wearing Be Fit & Flex', { sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
  <div data-reveal>${C.home.story.map((p) => `<p class="lead">${p}</p>`).join('')}
    <p>Be Fit & Flex is the activewear sister brand of <a href="${site.sister.url}" target="_blank" rel="noopener">${site.sister.name}</a> — coaching for women 30+ through mindset, movement and breathwork.</p>
    <a class="btn btn--gold" href="${r}shop/"><span>Shop the collection</span>${icon('arrow')}</a></div>
</div></section>`;
}

function sizeGuide(r) {
  const S = C.sizeGuide;
  return `
<section class="page-head"><div class="wrap"><p class="kicker">Fit</p><h1>Size guide</h1><p class="lead">${S.note}</p></div></section>
<section class="section section--tight"><div class="wrap"><div class="table-wrap"><table class="sizes"><thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hips</th></tr></thead><tbody>${S.rows.map((r2) => `<tr>${r2.map((c, i) => (i ? `<td>${c}</td>` : `<th>${c}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>
<p class="small">Still unsure? <a href="${wa('Hi! Can you help me choose my size?')}" target="_blank" rel="noopener">Message us on WhatsApp</a> with your measurements.</p></div></section>`;
}

function help(r) {
  return `
<section class="page-head"><div class="wrap"><p class="kicker">Help</p><h1>Delivery, returns & contact</h1></div></section>
<section class="section section--tight"><div class="wrap narrow">
  <div class="faq">${C.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}${icon('plus')}</summary><p>${a}</p></details>`).join('')}</div>
  <div class="contact" id="contact"><h2>Contact us</h2><p>We usually reply within a day.</p>
    <div class="row"><a class="btn btn--gold" href="${wa('Hi! I have a question about Be Fit & Flex.')}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp ${site.phoneDisplay}</span></a><a class="btn btn--ghost-dark" href="mailto:${site.email}">${icon('mail')}<span>${site.email}</span></a></div></div>
</div></section>`;
}

function notFound(r) {
  return `<section class="page-head"><div class="wrap"><p class="kicker">404</p><h1>This page stretched a little too far.</h1><div class="row"><a class="btn btn--gold" href="${r}shop/"><span>Shop the collection</span>${icon('arrow')}</a></div></div></section>`;
}

/* write */
function write(rel, html) {
  if (PREVIEW && rel.endsWith('.html')) {
    html = html.replace(/href="(\.{1,2}\/[^"]*|[a-z0-9-]+\/[^"]*|)"/g, (m, u) => {
      if (/^(https?:|mailto:|tel:|#)/.test(u) || u.includes('assets/')) return m;
      const cut = u.search(/[?#]/);
      const [p, rest] = cut < 0 ? [u, ''] : [u.slice(0, cut), u.slice(cut)];
      return p === '' || p.endsWith('/') ? `href="${p}index.html${rest}"` : m;
    });
  }
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}
const rootFor = (rel) => '../'.repeat(rel.split('/').length - 1) || './';

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(SRC, 'assets'), path.join(OUT, 'assets'), { recursive: true });
const pages = [
  ['index.html', '', 'home', home],
  ['shop/index.html', 'Shop', 'shop', shop],
  ['about/index.html', 'Our Story', 'about', about],
  ['size-guide/index.html', 'Size Guide', 'size', sizeGuide],
  ['help/index.html', 'Help', 'help', help],
];
for (const [rel, title, key, fn] of pages) { const r = rootFor(rel); write(rel, layout({ r, title, key, body: fn(r) })); }
for (const p of C.products) {
  const rel = `products/${p.slug}/index.html`; const r = rootFor(rel);
  write(rel, layout({ r, title: p.name, key: 'shop', body: product(r, p), desc: p.description, ogImg: 'products/' + p.images[0] }));
}
write('404.html', layout({ r: '', base: BASE, title: 'Not found', body: notFound('') }));
const urls = [...pages.map((p) => p[0]), ...C.products.map((p) => `products/${p.slug}/index.html`)].map((u) => site.url + '/' + u.replace(/index\.html$/, ''));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write('.nojekyll', '');
if (process.env.CNAME) write('CNAME', process.env.CNAME + '\n');
console.log(`Built ${pages.length + C.products.length + 1} pages → ${path.basename(OUT)}`);
