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
  { id: 'sets', name: 'Sets', blurb: 'Matching pieces, styled for you.' },
  { id: 'jackets', name: 'Jackets & Tops', blurb: 'Fitted layers with thumbholes and zip pockets.' },
  { id: 'bottoms', name: 'Leggings & Shorts', blurb: 'High-rise, squat-proof and sculpting.' },
  { id: 'bras', name: 'Sports Bras', blurb: 'Supportive, soft and made to move.' },
];

// Colour name → swatch colour. Add any new colour used by a product here.
export const colourHex = {
  Black: '#111111',
  Sand: '#d8c7ae',
  'Sand / Black': 'linear-gradient(135deg, #d8c7ae 50%, #111111 50%)',
  White: '#f6f4ef',
  Olive: '#5b6347',
  Navy: '#1e2a44',
  Mocha: '#7a5c48',
  Grey: '#8d8d8d',
  Pink: '#e3b2b8',
};

// One entry per product. `images` are file names in src/assets/img/products/.
// `price` in AED (leave null to show "Price coming soon"). `shopify` = the product's Shopify link.
// `sample: true` marks placeholder items to be replaced by the real catalogue.
export const products = [
  {
    slug: 'flex-zip-jacket-sand',
    name: 'Flex Zip Jacket — Sand',
    category: 'jackets',
    price: null,
    colours: ['Sand'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['sample-zip-jacket.webp', 'sample-set.webp'],
    description:
      'A fitted, second-skin zip jacket with thumbholes and a high collar. Soft, breathable and stretchy — made for the studio, the walk there and everything after.',
    details: ['Four-way stretch fabric', 'Thumbhole cuffs', 'Zip pockets', 'Be Fit & Flex embroidered logo'],
    shopify: '',
    status: 'coming-soon',
    sample: true,
  },
  {
    slug: 'ff-biker-shorts-black',
    name: 'FF Biker Shorts — Black',
    category: 'bottoms',
    price: null,
    colours: ['Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['sample-biker-shorts.webp', 'sample-set.webp'],
    description:
      'High-waisted, squat-proof biker shorts with the gold FF monogram. Sculpting fit that stays put through every pose.',
    details: ['High-rise waistband', 'Squat-proof, opaque fabric', 'Gold FF monogram', 'Mid-thigh length'],
    shopify: '',
    status: 'coming-soon',
    sample: true,
  },
  {
    slug: 'signature-flex-set',
    name: 'Signature Flex Set',
    category: 'sets',
    price: null,
    colours: ['Sand / Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['sample-set.webp', 'sample-zip-jacket.webp', 'sample-biker-shorts.webp'],
    description:
      'The full look: Flex Zip Jacket in Sand with FF Biker Shorts in Black. Our signature set, worn by Letchance in class and on the go.',
    details: ['Flex Zip Jacket — Sand', 'FF Biker Shorts — Black', 'Save when you buy the set'],
    shopify: '',
    status: 'coming-soon',
    sample: true,
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
