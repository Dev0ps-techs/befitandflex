/* Be Fit & Flex — interactions (no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toastEl = $('.toast');
  let tt;
  const toast = (m) => { if (!toastEl) return; toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('is-on'), 3000); };

  $$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

  // mobile menu
  const burger = $('.burger'), nav = $('#nav');
  const setNav = (o) => { burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); nav.classList.toggle('is-open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger?.addEventListener('click', () => setNav(burger.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.classList.contains('is-open')) setNav(false); });

  // reveal on scroll
  const els = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
  } else els.forEach((e) => e.classList.add('in'));

  // shop filters (also reacts to #category links)
  const grid = $('[data-grid]');
  if (grid) {
    const chips = $$('[data-filter]');
    const apply = (cat) => {
      chips.forEach((c) => c.classList.toggle('is-on', c.dataset.filter === cat));
      $$('.card', grid).forEach((c) => { c.hidden = cat !== 'all' && c.dataset.cat !== cat; if (!c.hidden) c.classList.add('in'); });
    };
    chips.forEach((c) => c.addEventListener('click', () => { apply(c.dataset.filter); history.replaceState(null, '', c.dataset.filter === 'all' ? location.pathname : '#' + c.dataset.filter); }));
    const fromHash = () => { const h = location.hash.slice(1); apply(chips.some((c) => c.dataset.filter === h) ? h : 'all'); };
    addEventListener('hashchange', fromHash); fromHash();
  }

  // product gallery
  const gal = $('[data-gallery]');
  if (gal) {
    const main = $('.gallery__main img', gal);
    $$('.thumb', gal).forEach((t) => t.addEventListener('click', () => {
      main.removeAttribute('srcset'); main.src = t.dataset.src;
      $$('.thumb', gal).forEach((x) => x.classList.toggle('is-on', x === t));
    }));
  }

  // colour / size pickers feed the WhatsApp order message
  let colour = $('[data-colour]')?.textContent || '', size = '';
  $$('[data-colour-pick]').forEach((b) => b.addEventListener('click', () => {
    colour = b.dataset.colourPick; $('[data-colour]').textContent = colour;
    $$('[data-colour-pick]').forEach((x) => x.classList.toggle('is-on', x === b));
  }));
  $$('[data-size-pick]').forEach((b) => b.addEventListener('click', () => {
    size = b.dataset.sizePick; $$('[data-size-pick]').forEach((x) => x.classList.toggle('is-on', x === b));
  }));
  $$('[data-wa-order]').forEach((a) => a.addEventListener('click', (e) => {
    if (!size && $('[data-size-pick]')) { e.preventDefault(); toast('Please choose your size first'); return; }
    const msg = `Hi! I'd like to order the ${a.dataset.product}${colour ? ` in ${colour}` : ''}${size ? `, size ${size}` : ''}.`;
    a.href = `https://wa.me/971552807783?text=${encodeURIComponent(msg)}`;
  }));

  // newsletter
  $$('[data-news]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const em = $('input', f).value;
    location.href = `mailto:letchancengassa@gmail.com?subject=${encodeURIComponent('Be Fit & Flex newsletter')}&body=${encodeURIComponent('Please add me: ' + em)}`;
    toast('Almost done — just press send in your email app.');
  }));
})();
