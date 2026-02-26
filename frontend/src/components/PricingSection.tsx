import { Check, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface PricingSectionProps {
  productId: number;
  productName: string;
  imageUrl: string;
}

const packages = [
  {
    type: 'single' as const,
    label: 'Kjøp 1',
    subtitle: 'Standardpris',
    price: 1177,
    originalPrice: 1766,
    perUnit: 1177,
    savings: null,
    savingsPercent: null,
    popular: false,
    qty: 1,
  },
  {
    type: 'double' as const,
    label: 'Kjøp 2',
    subtitle: 'SPAR 117,70 kr',
    price: 2236.30,
    originalPrice: 2354,
    perUnit: 1118.15,
    savings: 117.70,
    savingsPercent: 5,
    popular: true,
    qty: 2,
  },
  {
    type: 'triple' as const,
    label: 'Kjøp 3',
    subtitle: 'SPAR 353,10 kr',
    price: 3177.90,
    originalPrice: 3531,
    perUnit: 1059.30,
    savings: 353.10,
    savingsPercent: 10,
    popular: false,
    qty: 3,
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

export default function PricingSection({ productId, productName, imageUrl }: PricingSectionProps) {
  const { addItem } = useCart();

  const handleAddToCart = (pkg: typeof packages[0]) => {
    addItem({
      productId,
      productName,
      packageType: pkg.type,
      packageLabel: `${pkg.label} (${pkg.qty} stk)`,
      unitPrice: pkg.price,
      originalPrice: pkg.originalPrice,
      imageUrl,
    });
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#0C1B2A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Velg din <span className="text-[#C9A96E]">pakke</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Jo flere du kjøper, jo mer sparer du. Perfekt som gave eller for å ha ekstra filter tilgjengelig.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.type}
              className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#C9A96E]/20 to-[#C9A96E]/5 border-2 border-[#C9A96E] shadow-lg shadow-[#C9A96E]/20'
                  : 'bg-[#1A3A5C]/40 border border-gray-700/50 hover:border-[#C9A96E]/40'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A96E] text-[#0C1B2A] text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> MEST POPULÆRE
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">{pkg.label}</h3>
                <p className="text-sm text-[#C9A96E] font-medium mb-6">{pkg.subtitle}</p>

                {pkg.savingsPercent && (
                  <div className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Du sparer {pkg.savingsPercent}%
                  </div>
                )}

                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{formatPrice(pkg.perUnit)}</span>
                  <span className="text-gray-400 text-sm ml-1">kr/stk</span>
                </div>

                {pkg.type !== 'single' && (
                  <p className="text-gray-500 text-sm line-through mb-6">{formatPrice(pkg.originalPrice / pkg.qty)} kr/stk</p>
                )}
                {pkg.type === 'single' && (
                  <p className="text-gray-500 text-sm line-through mb-6">{formatPrice(pkg.originalPrice)} kr</p>
                )}

                <div className="space-y-3 mb-8 text-left">
                  {[
                    'Flertrinnsfiltreringsteknologi',
                    'VC Plant Fragrance Cartridge',
                    'Høytrykks vannstrøm',
                    'Universaltilkobling',
                    pkg.qty > 1 ? `${pkg.qty} dusjhoder inkludert` : 'Gratis frakt',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAddToCart(pkg)}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] shadow-lg shadow-[#C9A96E]/30'
                      : 'bg-white/10 hover:bg-[#C9A96E] text-white hover:text-[#0C1B2A] border border-gray-600 hover:border-[#C9A96E]'
                  }`}
                >
                  Legg i handlekurv
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}