# Pure Flow Nettbutikk - Utviklingsplan

## Design Guidelines

### Design References
- **Aesop.com**: Minimalistisk, premium, spa-inspirert
- **Dyson.com**: Produktfokusert, clean, moderne
- **Style**: Luxury Spa + Modern Minimalism + Clean E-commerce

### Color Palette
- Primary: #0C1B2A (Deep Navy - bakgrunn/header)
- Secondary: #1A3A5C (Dark Blue - seksjoner)
- Accent: #C9A96E (Gull/Messing - CTA, highlights, premium feel)
- Accent Light: #E8D5B0 (Lys gull - hover, borders)
- Background: #F8F6F2 (Varm hvit - hovedbakgrunn)
- Surface: #FFFFFF (Hvit - kort)
- Text Primary: #1A1A1A (Mørk tekst)
- Text Secondary: #6B7280 (Grå tekst)
- Success: #10B981 (Grønn - spar-badges)

### Typography
- Font: Inter (clean, moderne)
- H1: 56px bold
- H2: 36px semibold
- H3: 24px semibold
- Body: 16px regular
- Small: 14px regular

### Key Component Styles
- Buttons: Gull bakgrunn (#C9A96E), mørk tekst, 8px rounded, hover: darken
- Cards: Hvit bakgrunn, subtle shadow, 12px rounded
- Badges: Grønn for "SPAR", gull for "MEST POPULÆRE"
- Pricing: Gjennomstreket originalpris, stor ny pris

### Images
- Brukerens egne bilder: pureflow1.png, pureflow2.png, pureflow3.png
- Generere: hero-background (spa/vann-tema), lifestyle-image (dusjscene)

---

## Filer å opprette

1. **todo.md** - Denne filen
2. **src/pages/Index.tsx** - Landingsside med hero, features, priser, CTA-er
3. **src/components/Header.tsx** - Navigasjon med logo og handlekurv-ikon
4. **src/components/HeroSection.tsx** - Hero med bakgrunnsbilde og CTA
5. **src/components/PricingSection.tsx** - Prispakker (Kjøp 1/2/3)
6. **src/components/CartDrawer.tsx** - Handlekurv som slide-over drawer
7. **src/pages/Checkout.tsx** - Checkout-side med Stripe
8. **src/pages/PaymentSuccess.tsx** - Betalingsbekreftelse
9. **src/lib/api.ts** - API-klient med web-sdk
10. **src/context/CartContext.tsx** - Handlekurv state management
11. **index.html** - Oppdatert med Google Ads tracking
12. **backend/routers/payments.py** - Stripe betalingsruter
13. **src/pages/AiWriter.tsx** - AI-tekstgenerator side

## Database Tables
- products: id, name, description, short_description, price, original_price, image_urls, features, category (create_only=false, public data)
- orders: id, user_id, items, total_amount, status, stripe_session_id, created_at (create_only=true)
- cart_items: id, user_id, product_id, quantity, package_type, created_at (create_only=true)