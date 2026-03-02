import { useEffect, useState } from 'react';
import { Droplets, Shield, Wind, Link2, Sparkles, Star, ChevronDown, ArrowRight, RefreshCw, Clock, Heart } from 'lucide-react';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import PricingSection from '@/components/PricingSection';
import SupportSection from '@/components/SupportSection';
import client from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: number;
  original_price: number;
  image_url: string;
  image_url_2: string;
  image_url_3: string;
  features: string;
  category: string;
}

const heroImage = '/assets/pureflow8.jpg';
const lifestyleImage = '/assets/pureflow8.jpg';
const waterDropletImage = 'https://mgx-backend-cdn.metadl.com/generate/images/987851/2026-02-26/c4ebbcc8-e8e7-495a-922d-2ec3702dc541.png';
const bathroomImage = 'https://mgx-backend-cdn.metadl.com/generate/images/987851/2026-02-26/fe71b4af-cefb-4dda-a936-ba945e74a513.png';

const features = [
  {
    icon: Shield,
    title: 'Avansert filtrering',
    desc: 'Flere filtreringstrinn som effektivt reduserer klor, bakterier og kalkavleiringer fra vannet ditt.',
  },
  {
    icon: Sparkles,
    title: 'Naturlig duft',
    desc: 'VC Plant Fragrance Filter Cartridge frigjør en mild, oppfriskende duft som forvandler dusjen din.',
  },
  {
    icon: Wind,
    title: 'Kraftig vanntrykk',
    desc: 'Spesialdesignede mikrodyser gir en konsentrert og kraftig vannstrøm for en overlegen dusjopplevelse.',
  },
  {
    icon: Link2,
    title: 'Enkel installasjon',
    desc: 'Universaltilkobling som passer alle standard dusjslanger. Monter på under 2 minutter uten verktøy.',
  },
];

const reviews = [
  { name: 'Maria S.', rating: 5, text: 'Helt fantastisk forskjell! Håret mitt føles mykere og huden er ikke lenger tørr etter dusjen. Anbefales på det sterkeste!' },
  { name: 'Thomas K.', rating: 5, text: 'Installerte Pure Flow på 1 minutt. Vanntrykket er utrolig bra, og duften gjør dusjopplevelsen til noe helt spesielt.' },
  { name: 'Lise H.', rating: 5, text: 'Kjøpte 3 stk – ett til hvert bad. Hele familien merker forskjellen. Verdt hver krone!' },
];

export default function IndexPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await client.entities.products.query({ limit: 1 });
        if (response.data?.items?.length > 0) {
          setProduct(response.data.items[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, []);

  const productImages = product
    ? [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean)
    : ['/assets/pureflow1.png', '/assets/pureflow2.png', '/assets/pureflow3.png'];

  const galleryImages = [
    '/assets/pureflow1.png',
    '/assets/pureflow2.png',
    '/assets/pureflow3.png',
    '/assets/pureflow4.jpg',
    '/assets/pureflow5.jpg',
    '/assets/pureflow6.jpg',
    '/assets/pureflow7.jpg',
  ];

  const productFeatures: string[] = product?.features ? JSON.parse(product.features) : [];

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1B2A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Droplets className="w-12 h-12 text-[#C9A96E] animate-pulse" />
          <p className="text-gray-400">Laster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Spa bakgrunn" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1B2A]/95 via-[#0C1B2A]/80 to-[#0C1B2A]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#C9A96E]/20 border border-[#C9A96E]/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-[#C9A96E] text-sm font-medium">Ny innovasjon innen dusjteknologi</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Opplev <span className="text-[#C9A96E]">renere</span> vann.{' '}
                <span className="text-[#C9A96E]">Hver</span> dag.
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
                Pure Flow er dusjhodet som filtrerer bort bakterier, kalk og urenheter – og gir deg en spa-opplevelse rett i ditt eget baderom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToPricing}
                  className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/30 hover:shadow-xl hover:shadow-[#C9A96E]/40 flex items-center justify-center gap-2"
                >
                  Bestill nå <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-white/30 hover:border-[#C9A96E] text-white hover:text-[#C9A96E] font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300"
                >
                  Les mer
                </button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#E8D5B0] border-2 border-[#0C1B2A] flex items-center justify-center text-xs font-bold text-[#0C1B2A]">
                      {['MS', 'TK', 'LH', 'AJ'][i - 1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">500+ fornøyde kunder</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-[#C9A96E]/10 rounded-full blur-3xl" />
                <img
                  src={productImages[0]}
                  alt="Pure Flow dusjhode"
                  className="relative w-80 h-80 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#C9A96E]/60" />
        </div>
      </section>

      {/* Showcase Banner – pureflow4 */}
      <section className="relative bg-[#0C1B2A] py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1B2A] via-[#0C1B2A]/95 to-[#0C1B2A]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-[#C9A96E]/10 rounded-3xl blur-2xl" />
                <img
                  src="/assets/pureflow8b.jpg"
                  alt="Pure Flow dusjhode – nærbilde"
                  className="relative w-full max-w-md rounded-2xl shadow-2xl shadow-[#C9A96E]/10 object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left space-y-5">
              <span className="inline-block text-[#C9A96E] text-sm font-semibold uppercase tracking-widest">Nærbilde</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Kvalitet du kan <span className="text-[#C9A96E]">se og føle</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Hvert eneste detalj i Pure Flow er designet med presisjon – fra de avanserte mikrodysene til det elegante kromfinishet. Se selv.
              </p>
              <button
                onClick={scrollToPricing}
                className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-3 px-8 rounded-xl text-base transition-all duration-300 shadow-lg shadow-[#C9A96E]/20 inline-flex items-center gap-2"
              >
                Bestill nå <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Hvorfor velge <span className="text-[#C9A96E]">Pure Flow</span>?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Avansert teknologi møter elegant design for å gi deg den reneste og mest behagelige dusjopplevelsen.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-[#F8F6F2] hover:bg-[#0C1B2A] transition-all duration-500 hover:shadow-xl hover:shadow-[#0C1B2A]/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-[#C9A96E]/10 group-hover:bg-[#C9A96E]/20 flex items-center justify-center mb-5 transition-colors">
                  <f.icon className="w-7 h-7 text-[#C9A96E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-white mb-2 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA after features */}
          <div className="text-center mt-14">
            <button
              onClick={scrollToPricing}
              className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/20 inline-flex items-center gap-2"
            >
              Se priser og bestill <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section id="gallery" className="py-20 sm:py-28 bg-[#F8F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Se <span className="text-[#C9A96E]">Pure Flow</span> fra alle vinkler
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Elegant design som passer perfekt i ethvert baderom – opplev kvaliteten i hvert eneste detalj.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 ${
                  i === 0 ? 'md:row-span-2 md:col-span-1' : ''
                }`}
              >
                <div className={`w-full ${i === 0 ? 'h-64 md:h-full' : 'h-64'} p-4 flex items-center justify-center`}>
                  <img
                    src={img}
                    alt={`Pure Flow bilde ${i + 1}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B2A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Section */}
      <section id="product" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <img
                  src={productImages[selectedImage]}
                  alt="Pure Flow"
                  className="w-full max-w-md mx-auto h-80 object-contain"
                />
              </div>
              <div className="flex gap-3">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#C9A96E] shadow-md' : 'border-gray-200 hover:border-[#C9A96E]/50'
                    }`}
                  >
                    <img src={img} alt={`Bilde ${i + 1}`} className="w-full h-full object-contain bg-white p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-[#C9A96E] font-medium text-sm uppercase tracking-wider mb-2">Premium dusjhode</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
                  {product?.name || 'Pure Flow'}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product?.short_description || 'Luksuriøs filtrering og duft i ett – din daglige spa-opplevelse'}
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#1A1A1A]">
                  {product ? new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 0 }).format(product.price) : '1 177'} kr
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {product ? new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 0 }).format(product.original_price) : '1 766'} kr
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2.5 py-1 rounded-lg">
                  -33%
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product?.description || 'Forvandle din daglige dusj til et øyeblikk av ren luksus.'}
              </p>

              <div className="space-y-3">
                {(productFeatures.length > 0 ? productFeatures : features.map(f => f.title)).map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A96E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Droplets className="w-3.5 h-3.5 text-[#C9A96E]" />
                    </div>
                    <span className="text-gray-700">{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToPricing}
                className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/30 flex items-center justify-center gap-2"
              >
                Velg pakke og bestill <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Information Section */}
      <section id="filter-info" className="py-20 sm:py-28 bg-[#0C1B2A] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#C9A96E]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full px-5 py-2 mb-6">
              <RefreshCw className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-[#C9A96E] text-sm font-medium">Utbyttbart filtersystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Alt du trenger å vite om <span className="text-[#C9A96E]">filteret</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Pure Flow bruker et avansert flertrinnsfiltreringssystem som enkelt kan byttes ut – slik at du alltid får det reneste vannet.
            </p>
          </div>

          {/* Three Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* How the filter works */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#C9A96E]/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A96E]/20 transition-colors">
                <Shield className="w-8 h-8 text-[#C9A96E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Hvordan filteret fungerer</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#C9A96E] text-xs font-bold">1</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-white font-medium">Aktivt kull-filtrering</span> – Absorberer klor, organiske forbindelser og dårlig lukt fra vannet.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#C9A96E] text-xs font-bold">2</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-white font-medium">Mikrofiltrering</span> – Fjerner sedimenter, rust og partikler ned til mikronivå for krystallklart vann.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#C9A96E] text-xs font-bold">3</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-white font-medium">Mineralstein-lag</span> – Tilfører nyttige mineraler og balanserer vannets pH-verdi naturlig.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#C9A96E] text-xs font-bold">4</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-white font-medium">VC Plant Fragrance</span> – Frigjør en mild, naturlig duft som gir en spa-lignende opplevelse.
                  </p>
                </div>
              </div>
            </div>

            {/* How often to replace */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#C9A96E]/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A96E]/20 transition-colors">
                <Clock className="w-8 h-8 text-[#C9A96E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Når bør du bytte filter?</h3>
              <div className="space-y-5">
                <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-xl p-4">
                  <p className="text-[#C9A96E] font-semibold text-sm mb-1">Anbefalt bytteintervall</p>
                  <p className="text-white text-2xl font-bold">Hver 2–3 måned</p>
                  <p className="text-gray-400 text-xs mt-1">Avhengig av vannkvalitet og bruksfrekvens</p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm font-medium">Tegn på at filteret bør byttes:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                    <p className="text-gray-400 text-sm">Redusert vanntrykk gjennom dusjhodet</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                    <p className="text-gray-400 text-sm">Duften fra filteret avtar merkbart</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                    <p className="text-gray-400 text-sm">Vannet føles mindre mykt på huden</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                    <p className="text-gray-400 text-sm">Synlig misfarging på filterpatronen</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs italic">
                  Tips: Sett en påminnelse i kalenderen for jevnlig filterbytte!
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#C9A96E]/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A96E]/20 transition-colors">
                <Heart className="w-8 h-8 text-[#C9A96E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Fordeler med filteret</h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Mykere hud og hår',
                    desc: 'Fjerner klor og mineraler som tørker ut huden og gjør håret matt og livløst.',
                  },
                  {
                    title: 'Renere, sunnere vann',
                    desc: 'Reduserer bakterier, tungmetaller og skadelige stoffer for tryggere dusj.',
                  },
                  {
                    title: 'Redusert kalkavleiring',
                    desc: 'Mindre kalk betyr enklere rengjøring og lengre levetid for dusjarmatur.',
                  },
                  {
                    title: 'Spa-opplevelse hjemme',
                    desc: 'Den naturlige duften fra VC Plant Fragrance gir en avslappende aromaterapi.',
                  },
                  {
                    title: 'Bedre for sensitiv hud',
                    desc: 'Ideell for de med eksem, psoriasis eller andre hudsensitiviteter.',
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Droplets className="w-3 h-3 text-[#C9A96E]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{benefit.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <button
              onClick={scrollToPricing}
              className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/30 inline-flex items-center gap-2"
            >
              Bestill Pure Flow med filter <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Lifestyle Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bathroomImage} alt="Luksus bad" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0C1B2A]/80" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Mer enn et dusjhode – en <span className="text-[#C9A96E]">spa-opplevelse</span> hjemme
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Opplev hvordan riktig filtrering og en subtil naturlig duft kan forvandle din daglige rutine til et øyeblikk av ekte velvære.
          </p>
          <button
            onClick={scrollToPricing}
            className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/30 inline-flex items-center gap-2"
          >
            Bestill din Pure Flow nå <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        productId={product?.id || 1}
        productName={product?.name || 'Pure Flow'}
        imageUrl={productImages[0]}
      />

      {/* Reviews Section */}
      <section id="reviews" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Hva kundene <span className="text-[#C9A96E]">sier</span>
            </h2>
            <p className="text-gray-500 text-lg">Ekte tilbakemeldinger fra fornøyde Pure Flow-brukere</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="bg-[#F8F6F2] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-[#C9A96E] fill-[#C9A96E]" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
                    <span className="text-[#C9A96E] font-bold text-sm">{review.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A] text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">Verifisert kjøper</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after reviews */}
          <div className="text-center mt-14">
            <button
              onClick={scrollToPricing}
              className="bg-[#0C1B2A] hover:bg-[#1A3A5C] text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg inline-flex items-center gap-2"
            >
              Bli en av våre fornøyde kunder <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={waterDropletImage} alt="Rent vann" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1B2A]/90 to-[#0C1B2A]/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Klar for <span className="text-[#C9A96E]">renere</span> vann?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Bestill Pure Flow i dag og opplev forskjellen allerede fra første dusj. Gratis frakt på alle bestillinger.
          </p>
          <button
            onClick={scrollToPricing}
            className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/30 inline-flex items-center gap-2"
          >
            Bestill nå – fra 1 077 kr <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Support / Contact Section */}
      <SupportSection />

      {/* Footer */}
      <footer className="bg-[#0C1B2A] py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Droplets className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-lg font-bold text-white">
                Pure<span className="text-[#C9A96E]">Flow</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#C9A96E] transition-colors">Personvern</a>
              <a href="#" className="hover:text-[#C9A96E] transition-colors">Vilkår</a>
              <a href="#" className="hover:text-[#C9A96E] transition-colors">Kontakt</a>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Pure Flow. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}