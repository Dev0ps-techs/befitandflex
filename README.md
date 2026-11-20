# Be Fit & Flex — befitandflex.com

Activewear website for women 30+, by Letchance Ngassa. Static site (no dependencies), hosted on GitHub Pages, checkout through Shopify.

## Edit the site
- **Products, prices, text:** `src/site.mjs`
- **Product photos:** put them in `src/assets/img/products/` (or upload to `photos/` and ask Claude to process them)
- **Shopify:** set `shopifyStore` in `src/site.mjs`, and each product's `shopify` link. Until then, the buy button opens a WhatsApp order.

## Build
```
npm run build          # writes /docs
CNAME=befitandflex.com npm run build   # with custom domain
```

## Go live
1. GitHub → Settings → Pages → Branch `main`, folder `/docs`.
2. Domain DNS: A records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` → `dev0ps-techs.github.io`.
