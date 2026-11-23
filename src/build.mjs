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

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
for (const p of C.products) p.images = p.colours[0].images;
const pimg = (r, p, i = 0, opts) => img(r, 'products/' + p.images[i], `${p.name} — ${p.colours[0].name}`, opts);
const price = (p) => (p.price ? `${Number(p.price).toFixed(2)} ${site.currency}` : 'Coming soon');
const soon = (p) => p.status === 'coming-soon';
const hex = (n) => C.colourHex[n] || '#ccc';
const swatch = (n, cls = 'sw') => `<span class="${cls}" style="--c:${hex(n)}" title="${esc(n)}"></span>`;
const catColours = (id) => [...new Set(C.products.filter((p) => p.category === id).flatMap((p) => p.colours.map((c) => c.name)))];
const payPills = () => `<ul class="pay" aria-label="Payment methods">${site.payments.map((m) => `<li>${m}</li>`).join('')}</ul>`;
const newsForm = (id, dark = true) => `<form class="news${dark ? '' : ' news--light'}" data-news><label class="sr" for="${id}">Email</label><input id="${id}" type="email" required placeholder="Your email address" autocomplete="email"><button class="btn ${dark ? 'btn--gold' : 'btn--ink'} btn--sm" type="submit"><span>Subscribe</span></button></form>`;
const catOf = (id) => C.categories.find((c) => c.id === id) || {};
const gName = (g) => (C.genders.find((x) => x.id === g) || {}).name || '';
const catName = (id) => { const c = catOf(id); return c.name ? `${gName(c.gender)} · ${c.name}` : ''; };
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
  minus: '<path d="M5 12h14"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const icon = (n, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const wa = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

const NAV = [
  ['shop/', 'Shop all', 'shop'],
  ...C.genders.map((g) => [`shop/#${g.id}`, g.name, '']),
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
<div class="announce">Our first collection is coming soon · <a href="${r}shop/">Pre-order now</a> to reserve your size</div>
<header class="header">
  <div class="wrap header__in">
    <button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Main"><ul>${NAV.map(([h, l, k]) => `<li><a href="${r}${h}"${k && k === key ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></nav>
    <a class="brand" href="${r}" aria-label="${site.name} home">${img(r, 'ff-logo.webp', '', { sizes: '44px', eager: true, cls: 'brand__mark' })}<span>Be Fit <i>&amp;</i> Flex</span></a>
    <div class="header__end"><a class="btn btn--gold btn--sm header__shop" href="${r}shop/"><span>Pre-order</span></a><button class="basket-btn" data-basket-open aria-label="Open basket">${icon('bag')}<span class="basket-btn__n" data-basket-count>0</span></button></div>
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
    ${C.genders.map((g) => `<div><h3>${g.name}</h3><ul>${C.categories.filter((c) => c.gender === g.id).map((c) => `<li><a href="${r}shop/#${c.id}">${c.name}</a></li>`).join('')}</ul></div>`).join('')}
    <div><h3>Help</h3><ul><li><a href="${r}size-guide/">Size guide</a></li><li><a href="${r}help/">Delivery & returns</a></li><li><a href="${r}help/#contact">Contact us</a></li><li><a href="${r}about/">Our story</a></li></ul></div>
    <div><h3>Join the movement</h3>
      <p class="footer__small">Be first to know about new drops and pre-order offers.</p>
      ${newsForm('news-footer')}
      <div class="social"><a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a><a href="${wa('Hi! I have a question about Be Fit & Flex.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a><a href="mailto:${site.email}" aria-label="Email">${icon('mail')}</a></div>
    </div>
  </div>
  <div class="wrap footer__bottom"><p>© <span data-year>2026</span> ${site.name}. All rights reserved.</p>${payPills()}</div>
</footer>
<a class="wa-float" href="${wa('Hi! I have a question about Be Fit & Flex.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('whatsapp')}</a>
${drawer(r)}
<div class="toast" role="status" aria-live="polite"></div>
<script>window.BFF=${JSON.stringify({ wa: site.whatsapp, email: site.email, endpoint: site.formEndpoint, currency: site.currency, root: r })}</script>
<script src="${r}assets/js/main.js" defer></script>
</body>
</html>
`;
}

const card = (r, p, i = 0) => `
<article class="card" data-reveal style="--d:${(i % 4) * 0.06}s" data-cat="${p.category}">
  <a class="card__img" href="${r}products/${p.slug}/">
    ${pimg(r, p, 0, { sizes: '(min-width: 1000px) 25vw, 50vw' })}
    ${p.images[1] ? pimg(r, p, 1, { sizes: '(min-width: 1000px) 25vw, 50vw', cls: 'card__alt' }) : p.colours[1] ? img(r, 'products/' + p.colours[1].images[0], `${p.name} — ${p.colours[1].name}`, { sizes: '(min-width: 1000px) 25vw, 50vw', cls: 'card__alt' }) : ''}
    ${soon(p) ? '<span class="badge">Coming soon</span>' : ''}${p.unisex ? '<span class="badge badge--alt">Unisex</span>' : ''}
  </a>
  <div class="card__body">
    <p class="card__cat">${catName(p.category)}</p>
    <h3><a href="${r}products/${p.slug}/">${p.name}</a></h3>
    <div class="card__foot"><p class="card__price">${soon(p) ? 'Pre-order now' : price(p)}</p><span class="sws" aria-label="${p.colours.length} colours: ${esc(p.colours.map((c) => c.name).join(', '))}">${p.colours.map((c) => swatch(c.name)).join('')}</span></div>
  </div>
</article>`;

const catTile = (r, c, i) => {
  const p = C.products.find((x) => x.category === c.id);
  const cols = catColours(c.id);
  return `<a class="cat" href="${r}shop/#${c.id}" data-reveal style="--d:${i * 0.07}s">
  <div class="cat__img">${pimg(r, p, 0, { sizes: '(min-width: 1000px) 25vw, 50vw' })}</div>
  <div class="cat__body"><p class="cat__g">${gName(c.gender)}</p><h3>${c.name}</h3><p>${c.blurb}</p>
  <p class="cat__cols"><span class="sws">${cols.map((n) => swatch(n)).join('')}</span><span>${cols.length} colours</span></p></div>
</a>`;
};

function home(r) {
  const H = C.home;
  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div class="hero__text">
      <p class="kicker" data-reveal>Premium activewear · Coming soon</p>
      <h1 data-reveal style="--d:.08s">${H.heroTitle}</h1>
      <p class="lead" data-reveal style="--d:.16s">${H.heroText}</p>
      <ul class="hero__pills" data-reveal style="--d:.2s"><li>${icon('wind')}Breathable</li><li>${icon('swap')}Four-way stretch</li><li>${icon('heart')}Fit for lifestyle</li></ul>
      <div class="row" data-reveal style="--d:.24s"><a class="btn btn--gold" href="${r}shop/"><span>Pre-order the collection</span>${icon('arrow')}</a><a class="btn btn--ghost" href="#join"><span>Get early access</span></a></div>
    </div>
    <div class="hero__media" data-reveal style="--d:.1s">
      <div class="hero__frame">${img(r, 'hero-tree-pose.webp', 'Letchance Ngassa in tree pose wearing the Be Fit & Flex zip jacket and biker shorts', { eager: true, sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
      <div class="hero__seal">${img(r, 'ff-logo.webp', 'Be Fit & Flex FF monogram', { sizes: '120px' })}</div>
    </div>
  </div>
</section>
<div class="ticker" aria-hidden="true"><div class="ticker__track">${Array(2).fill(['Premium activewear', 'Breathable', 'Four-way stretch', 'Fit for lifestyle', 'Squat-proof', 'Coming soon']).flat().map((w) => `<span>${w}</span>`).join('')}</div></div>
<section class="section">
  <div class="wrap">
    <div class="head" data-reveal><div><p class="kicker">Shop by category</p><h2>Six collections. Every colour you love.</h2></div><a class="link" href="${r}shop/">View all ${icon('arrow')}</a></div>
    ${C.genders.map((g) => `<div class="gsec"><div class="gsec__head" data-reveal><h3>${g.name}</h3><a class="link" href="${r}shop/#${g.id}">Shop ${g.name.toLowerCase()} ${icon('arrow')}</a></div>
    <div class="cats">${C.categories.filter((c) => c.gender === g.id).map((c, i) => catTile(r, c, i)).join('')}</div></div>`).join('')}
  </div>
</section>
<section class="section section--ink">
  <div class="wrap">
    <div class="premium__head" data-reveal><p class="kicker">Why Be Fit & Flex</p><h2>${H.premiumTitle}</h2><p class="lead">${H.premiumText}</p></div>
    <div class="values">${H.values.map((v, i) => `<div class="value" data-reveal style="--d:${i * 0.08}s">${icon(['wind', 'swap', 'heart'][i])}<h3>${v.title}</h3><p>${v.text}</p></div>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="head" data-reveal><div><p class="kicker">The collection</p><h2>Coming soon — pre-order now</h2></div><a class="link" href="${r}shop/">Shop all ${icon('arrow')}</a></div>
    <div class="grid">${C.products.slice(0, 8).map((p, i) => card(r, p, i)).join('')}</div>
  </div>
</section>
<section class="section section--gold" id="join">
  <div class="wrap join" data-reveal>
    <div><p class="kicker kicker--ink">Early access</p><h2>Be the first to wear it.</h2><p>${H.comingSoon}</p></div>
    <div>${newsForm('news-home', false)}<p class="small small--ink">No spam — just launch news, restocks and members-only offers. Unsubscribe any time.</p></div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div class="split__img" data-reveal>${img(r, 'hero-tree-pose.webp', 'Letchance Ngassa, founder of Be Fit & Flex', { sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
    <div data-reveal style="--d:.1s"><p class="kicker">Our story</p><h2>Born on the mat.</h2>${H.story.map((p) => `<p>${p}</p>`).join('')}<a class="btn btn--ghost-dark" href="${r}about/"><span>Read more</span>${icon('arrow')}</a></div>
  </div>
</section>`;
}

function shop(r) {
  const block = (c) => {
    const ps = C.products.filter((p) => p.category === c.id);
    if (!ps.length) return '';
    const cols = catColours(c.id);
    return `<div class="block" data-cat="${c.id}" data-gender="${c.gender}" id="${c.id}">
      <div class="block__head"><div><h3 class="block__title">${c.name}</h3><p>${c.blurb}</p></div>
      <div class="block__cols"><span class="block__label">Available in</span><ul>${cols.map((n) => `<li>${swatch(n)}${n}</li>`).join('')}</ul></div></div>
      <div class="grid">${ps.map((p, i) => card(r, p, i)).join('')}</div></div>`;
  };
  return `
<section class="page-head"><div class="wrap"><p class="kicker">Coming soon · Pre-order now</p><h1>Shop the collection</h1><p class="lead">Premium activewear that is breathable, stretchable and made for your lifestyle. Reserve your size today.</p></div></section>
<section class="section section--tight">
  <div class="wrap" data-grid>
    <div class="filters" role="group" aria-label="Filter">
      <button class="chip is-on" data-filter="all">All</button>${C.genders.map((g) => `<button class="chip chip--g" data-filter="${g.id}">${g.name}</button>`).join('')}<span class="filters__sep" aria-hidden="true"></span>${C.categories.map((c) => `<button class="chip" data-filter="${c.id}">${gName(c.gender)} · ${c.name}</button>`).join('')}
    </div>
    ${C.genders.map((g) => `<div class="gblock" data-gender="${g.id}" id="${g.id}"><h2 class="gblock__title">${g.name}</h2>${C.categories.filter((c) => c.gender === g.id).map(block).join('')}</div>`).join('')}
  </div>
</section>`;
}

function product(r, p) {
  const url = buyUrl(p);
  const related = C.products.filter((x) => x !== p && x.category === p.category).concat(C.products.filter((x) => x.category !== p.category)).slice(0, 4);
  const thumbs = (c) => c.images.map((im, i) => `<button class="thumb${i === 0 ? ' is-on' : ''}" data-src="${r}assets/img/products/${im}" aria-label="Show photo ${i + 1}">${img(r, 'products/' + im, '', { sizes: '90px' })}</button>`).join('');
  return `
<section class="section section--tight">
  <div class="wrap pdp" data-product='${esc(JSON.stringify({ slug: p.slug, name: p.name, price: p.price, colours: p.colours.map((c) => ({ name: c.name, img: `${r}assets/img/products/${c.images[0]}` })) }))}'>
    <div class="gallery" data-gallery>
      <div class="gallery__main">${pimg(r, p, 0, { eager: true, sizes: '(min-width: 900px) 50vw, 100vw' })}${soon(p) ? '<span class="badge">Coming soon</span>' : ''}</div>
      <div class="gallery__thumbs" data-thumbs>${p.images.length > 1 ? thumbs(p.colours[0]) : ''}</div>
      ${p.colours.map((c) => `<template data-colour-thumbs="${esc(c.name)}">${c.images.length > 1 ? thumbs(c) : ''}</template>`).join('')}
    </div>
    <div class="pdp__info">
      <nav class="crumbs"><a href="${r}shop/">Shop</a> / <a href="${r}shop/#${p.category}">${catName(p.category)}</a></nav>
      <h1>${p.name}</h1>
      <p class="pdp__price">${price(p)}${soon(p) ? ' <span class="tag">Pre-order</span>' : ''}${p.unisex ? ' <span class="tag tag--line">Unisex</span>' : ''}</p>
      <p>${p.description}</p>
      <div class="opt"><p class="opt__label"><span>Colour: <b data-colour>${p.colours[0].label || p.colours[0].name}</b></span><span>${p.colours.length} ${p.colours.length === 1 ? 'colour' : 'colours'}</span></p><div class="opt__row">${p.colours.map((c, i) => `<button class="colour${i === 0 ? ' is-on' : ''}" data-colour-pick="${esc(c.name)}" data-label="${esc(c.label || c.name)}" data-images='${esc(JSON.stringify(c.images.map((im) => `${r}assets/img/products/${im}`)))}' aria-label="${esc(c.label || c.name)}">${swatch(c.name, 'sw sw--lg')}</button>`).join('')}</div></div>
      <div class="opt"><p class="opt__label"><span>Size</span><a href="${r}size-guide/">Size guide</a></p><div class="opt__row">${p.sizes.map((s) => `<button class="chip chip--size" data-size-pick="${s}">${s}</button>`).join('')}</div></div>
      <div class="opt"><p class="opt__label"><span>Quantity</span></p><div class="qty" data-qty><button type="button" data-step="-1" aria-label="Less">${icon('minus')}</button><input type="number" value="1" min="1" max="20" aria-label="Quantity"><button type="button" data-step="1" aria-label="More">${icon('plus')}</button></div></div>
      <div class="pdp__buy">
        <button class="btn btn--gold btn--wide" data-add>${icon('bag')}<span>${soon(p) ? 'Pre-order — add to basket' : 'Add to basket'}</span></button>
        ${url ? `<a class="btn btn--ghost-dark btn--wide" href="${url}" target="_blank" rel="noopener"><span>Buy now on Shopify</span>${icon('arrow')}</a>` : `<a class="btn btn--ghost-dark btn--wide" data-wa-order data-product="${esc(p.name)}" href="${wa(`Hi! I'd like to pre-order the ${p.name}.`)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Pre-order on WhatsApp</span></a>`}
      </div>
      ${soon(p) ? `<p class="note">${icon('clock')} Coming soon. Pre-order now to reserve your size — we will confirm your order and payment before it ships.</p>` : ''}
      <div class="secure"><p class="small">${icon('card')} Secure payment options</p>${payPills()}</div>
      <ul class="perks"><li>${icon('wind')} Breathable, moisture-wicking fabric</li><li>${icon('swap')} Four-way stretch that keeps its shape</li><li>${icon('truck')} Delivery across the UAE</li></ul>
      <details open><summary>Details</summary><ul>${p.details.map((d) => `<li>${d}</li>`).join('')}</ul></details>
      <details><summary>Care</summary><p>Wash cold, inside out, with similar colours. Do not tumble dry or iron the logo or embroidery. Air dry flat to keep the shape and stretch.</p></details>
    </div>
  </div>
</section>
${related.length ? `<section class="section"><div class="wrap"><div class="head"><h2>Complete the look</h2></div><div class="grid">${related.map((x, i) => card(r, x, i)).join('')}</div></div></section>` : ''}`;
}

function drawer(r) {
  return `<div class="scrim" data-basket-close hidden></div>
<aside class="drawer" aria-label="Basket" aria-hidden="true" data-drawer>
  <div class="drawer__head"><h2>Your basket</h2><button class="drawer__x" data-basket-close aria-label="Close basket">${icon('close')}</button></div>
  <div class="drawer__body">
    <div data-basket-empty><p>Your basket is empty.</p><a class="btn btn--gold" href="${r}shop/"><span>Shop the collection</span></a></div>
    <ul class="lines" data-basket-lines></ul>
    <form class="checkout" data-checkout hidden>
      <div class="sum"><span>Subtotal</span><b data-basket-total></b></div>
      <p class="small">All pieces are pre-order. We will confirm availability, delivery and the total before you pay.</p>
      <h3>Your details</h3>
      <label>Full name<input name="name" required autocomplete="name"></label>
      <label>Email<input name="email" type="email" required autocomplete="email"></label>
      <label>Phone / WhatsApp<input name="phone" type="tel" required autocomplete="tel"></label>
      <label>City / Emirate<input name="city" autocomplete="address-level2"></label>
      <fieldset><legend>Preferred payment</legend>${site.payments.map((m, i) => `<label class="radio"><input type="radio" name="payment" value="${esc(m)}"${i === 0 ? ' checked' : ''}><span>${m}</span></label>`).join('')}</fieldset>
      <label>Notes<textarea name="notes" rows="2" placeholder="Anything we should know?"></textarea></label>
      <label class="check"><input type="checkbox" name="subscribe" checked><span>Email me about the launch and new drops</span></label>
      <button class="btn btn--gold btn--wide" type="submit">${icon('bag')}<span>Place pre-order</span></button>
      <p class="small">Your pre-order is sent to us on WhatsApp${site.formEndpoint ? '' : ' (or email)'} — no payment is taken yet.</p>
    </form>
  </div>
</aside>`;
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
