// Be Fit & Flex — all site text and the product catalogue.
// Edit here, then run `npm run build`. The site is generated into /docs (served by GitHub Pages).

export const site = {
  name: 'Be Fit & Flex',
  domain: 'befitandflex.com',
  url: 'https://befitandflex.com',
  tagline: 'Activewear for women who move with intention.',
  description:
    'Be Fit & Flex is a premium activewear brand for women 30+, designed by Mindset & Wellness Coach Letchance Ngassa. Sculpting leggings, shorts, jackets and sets made for yoga, training and everyday life.',
  founder: 'Letchance Ngassa',
  currency: 'AED',
  // Shopify: paste your store address here once it is live (e.g. https://befitandflex.myshopify.com).
  // Each product can also have its own `shopify` link to its product page.
  shopifyStore: '',
  // Email sign-ups and pre-orders: paste a form endpoint here (e.g. Formspree, Shopify, Mailchimp) to collect them
  // automatically. Left empty, they open a pre-filled email / WhatsApp message to you instead.
  formEndpoint: '',
  // Shown at checkout. Real card payment happens on Shopify once the store is connected.
  payments: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Shop Pay', 'Cash on delivery (UAE)'],
  email: 'letchancengassa@gmail.com',
  phone: '+971552807783',
  phoneDisplay: '(+971) 55 280 7783',
  whatsapp: '971552807783',
  instagram: 'https://www.instagram.com/leechance_ngassa/',
  sister: { name: 'Wealthy Mind & Body', url: 'https://wealthymindandbody.com' },
};

export const categories = [
  { id: 'sets', name: 'Sculpt Sets', blurb: 'Half-zip sports bra and high-rise leggings, made to match.' },
  { id: 'jackets', name: 'Zip Jackets', blurb: 'Fitted, thumbhole zip jackets paired with biker shorts.' },
  { id: 'tracksuits', name: 'Tracksuits', blurb: 'Embroidered tracksuits for training, travel and everyday style.' },
  { id: 'tees', name: 'Tees & Tanks', blurb: 'Soft, breathable everyday essentials with our signature logo.' },
];

// Colour name → swatch colour. Add any new colour used by a product here.
export const colourHex = {
  Black: '#111111',
  Burgundy: '#7d1a2b',
  Sunset: 'linear-gradient(135deg, #f7d117 50%, #f26a10 50%)',
  Sand: '#d9c9b3',
  Pink: '#e85bb4',
  Teal: '#0e8b8c',
  Red: '#b5121b',
  White: '#f7f6f2',
  'Royal Blue': '#1f3a9e',
};

// One entry per design. Each colour has its own photos (file names in src/assets/img/products/).
// `price` in AED (null shows "Coming soon"). `status: 'coming-soon'` shows the badge and the pre-order button.
// `shopify` = the product's Shopify link once the store is live.
export const products = [
  {
    slug: 'sculpt-set',
    name: 'Sculpt Set',
    category: 'sets',
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: [
      { name: 'Black', images: ['sculpt-black.webp'] },
      { name: 'Burgundy', images: ['sculpt-burgundy.webp'] },
      { name: 'Sunset', label: 'Sunset (yellow & orange)', images: ['sculpt-sunset.webp'] },
    ],
    description:
      'Our signature two-piece. A half-zip racerback sports bra with a gold Be Fit & Flex underband, paired with high-rise 7/8 leggings with contour seams and the embroidered gold FF emblem. Breathable, four-way stretch and squat-proof — it sculpts, supports and moves with you.',
    details: ['Half-zip front for easy on and off', 'Racerback with FF emblem for full freedom of movement', 'High-rise, squat-proof 7/8 leggings with contour seams', 'Breathable, moisture-wicking four-way stretch fabric', 'Gold embroidered FF emblem'],
    shopify: '',
  },
  {
    slug: 'flex-zip-jacket-set',
    name: 'Flex Zip Jacket Set',
    category: 'jackets',
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: [
      { name: 'Sand', images: ['zip-sand-front.webp', 'zip-sand-back.webp'] },
      { name: 'Pink', images: ['zip-pink-front.webp', 'zip-pink-back.webp'] },
      { name: 'Teal', images: ['zip-teal-front.webp', 'zip-teal-back.webp'] },
    ],
    description:
      'A second-skin zip jacket with a high collar, thumbhole cuffs and zip pockets, finished with a gold embroidered FF crest on the chest and Be Fit & Flex across the back. Paired with high-waisted black biker shorts with the gold FF emblem. From the studio to the school run.',
    details: ['Fitted, waist-defining jacket with contour seams', 'Thumbhole cuffs and zip side pockets', 'Gold FF crest on the chest, Be Fit & Flex on the back', 'High-waisted black biker shorts with gold FF emblem', 'Soft, breathable four-way stretch fabric'],
    shopify: '',
  },
  {
    slug: 'varsity-cropped-tracksuit',
    name: 'Varsity Cropped Tracksuit',
    category: 'tracksuits',
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: [
      { name: 'Black', images: ['varsity-black.webp'] },
      { name: 'Red', images: ['varsity-red.webp'] },
      { name: 'White', images: ['varsity-white.webp'] },
    ],
    description:
      'A cropped zip track jacket with contrast piping and a gold embroidered FF crest, matching joggers with side stripes and an elasticated waist, worn with our white Be Fit & Flex bralette with red trim. Sporty, polished and made for life on the move.',
    details: ['Cropped zip jacket with contrast piping', 'Gold embroidered FF crest on jacket and joggers', 'Joggers with side stripes and an elasticated waistband', 'Styled with the Be Fit & Flex bralette (white with red trim)', 'Soft, breathable stretch knit'],
    shopify: '',
  },
  {
    slug: 'classic-hooded-tracksuit',
    name: 'Classic Hooded Tracksuit',
    category: 'tracksuits',
    unisex: true,
    price: null,
    status: 'coming-soon',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Black', images: ['hooded-black-front.webp', 'hooded-black-back.webp'] },
      { name: 'Royal Blue', images: ['hooded-blue-front.webp', 'hooded-blue-back.webp'] },
      { name: 'White', images: ['hooded-white-front.webp', 'hooded-white-back.webp'] },
    ],
    description:
      'A unisex hooded zip tracksuit with contrast piping, a gold embroidered FF crest on the chest and leg, and Be Fit & Flex in script across the back. Relaxed, breathable and made for training days, travel and everything in between.',
    details: ['Hooded zip jacket with contrast piping', 'Be Fit & Flex script across the back', 'Gold embroidered FF crest on chest and joggers', 'Straight-leg joggers with side piping and pockets', 'Unisex fit'],
    shopify: '',
  },
  {
    slug: 'logo-racer-tank',
    name: 'Logo Racer Tank',
    category: 'tees',
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: [
      { name: 'White', images: ['tank-white.webp'] },
      { name: 'Black', images: ['tank-black.webp'] },
    ],
    description:
      'A fitted racerback tank with a scoop neck and the bold Be Fit & Flex logo across the chest. Lightweight and breathable — layer it under a jacket or wear it on its own from workout to weekend.',
    details: ['Fitted racerback silhouette', 'Bold Be Fit & Flex chest print', 'Lightweight, breathable stretch fabric', 'Smooth, flattering fit'],
    shopify: '',
  },
  {
    slug: 'ff-emblem-tee',
    name: 'FF Emblem Tee',
    category: 'tees',
    unisex: true,
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'White', images: ['emblem-tee-white.webp'] },
      { name: 'Black', images: ['emblem-tee-black.webp'] },
    ],
    description:
      'A clean crew-neck tee with our gold embroidered FF emblem on the chest. Soft, breathable and easy to wear — the everyday essential with a touch of luxury.',
    details: ['Gold embroidered FF emblem', 'Classic crew neck, short sleeves', 'Soft, breathable stretch cotton feel', 'Unisex fit'],
    shopify: '',
  },
  {
    slug: 'signature-logo-tee',
    name: 'Signature Logo Tee',
    category: 'tees',
    unisex: true,
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ name: 'White', images: ['signature-tee-white.webp'] }],
    description:
      'A crisp white crew-neck tee with Be Fit & Flex printed boldly across the chest. Wear the movement — at the gym, on the go or at brunch.',
    details: ['Bold centred Be Fit & Flex print', 'Classic crew neck, short sleeves', 'Soft, breathable fabric', 'Unisex fit'],
    shopify: '',
  },
  {
    slug: 'chest-logo-tee',
    name: 'Chest Logo Tee',
    category: 'tees',
    unisex: true,
    price: null,
    status: 'coming-soon',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Black', images: ['chest-tee-black.webp'] },
      { name: 'White', images: ['chest-tee-white.webp'] },
    ],
    description:
      'A fitted crew-neck tee with a subtle Be Fit & Flex logo on the chest. Minimal, breathable and stretchy — the tee you will reach for every day.',
    details: ['Subtle Be Fit & Flex chest logo', 'Fitted crew neck, short sleeves', 'Breathable stretch fabric', 'Unisex fit'],
    shopify: '',
  },
];

export const home = {
  heroTitle: 'Move with intention.',
  heroText:
    'Premium activewear designed for women 30+ who are strong, busy and unapologetically themselves. Made to stretch, sculpt and keep up with your life.',
  premiumTitle: 'Premium activewear, made for life.',
  premiumText: 'Every piece is cut from soft, high-performance fabric that breathes with you, stretches with you and looks just as good at brunch as it does on the mat.',
  values: [
    { title: 'Breathable', text: 'Lightweight, moisture-wicking fabric that keeps you cool and dry, even in the Dubai heat.' },
    { title: 'Four-way stretch', text: 'Moves in every direction with you, from deep yoga stretches to the school run, and holds its shape.' },
    { title: 'Fit for lifestyle', text: 'Sculpting, squat-proof and flattering. Designed to take you from training to everyday life in style.' },
  ],
  comingSoon: 'Our first collection is coming soon. Pre-order now to reserve your size, or join the list to be the first to know when it drops.',
  story: [
    'Be Fit & Flex was born on the mat. As a Mind & Body Movement specialist teaching women 30+ across Dubai, Letchance Ngassa wanted activewear that felt as good as the practice itself — supportive, flattering and made to move.',
    'Every piece is designed to help you feel confident in your body, whether you are flowing through a yoga sequence, training hard or simply living your day.',
  ],
};

// PLACEHOLDER measurements: replace with the real Be Fit & Flex size chart before launch.
export const sizeGuide = {
  note: 'Measurements in centimetres. If you are between sizes, choose the larger size for a relaxed fit or the smaller for more compression.',
  rows: [
    ['XS', '76–80', '60–64', '86–90'],
    ['S', '81–86', '65–70', '91–96'],
    ['M', '87–92', '71–76', '97–102'],
    ['L', '93–99', '77–83', '103–109'],
    ['XL', '100–106', '84–90', '110–116'],
  ],
};

// PLACEHOLDER policies: confirm delivery and returns terms before launch.
export const faq = [
  ['Where do you deliver?', 'We deliver across the UAE, and internationally on request. Delivery options and costs are shown at checkout.'],
  ['How do I choose my size?', 'Use our Size Guide. If you are between sizes, message us on WhatsApp and we will help you choose.'],
  ['Can I return or exchange?', 'Unworn items with tags can be exchanged or returned within 14 days of delivery. See our returns policy at checkout for full details.'],
  ['How do I care for my activewear?', 'Wash cold, inside out, with similar colours. Do not tumble dry or iron the logo. Air dry flat to keep the shape and stretch.'],
];
