import { Check, Star, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface PricingSectionProps {
  productId: number;
  productName: string;
  imageUrl: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

export default function PricingSection({ productId, productName, imageUrl }: PricingSectionProps) {
  const { addItem } = useCart();

  const handleAddSingle = () => {
    addItem({
      productId,
      productName,
      packageType: 'single',
      packageLabel: 'Kjøp 1 (1 stk)',
      unitPrice: 1077,
      originalPrice: 1077,
      imageUrl,
    });
  };

  const handleAddDouble = () => {
    addItem({
      productId,
      productName,
      packageType: 'double',
      packageLabel: 'Kjøp 2 (2 stk)',
      unitPrice: 1900,
      originalPrice: 2154,
      imageUrl,
    });
  };

  const handleAddSubscription = () => {
    addItem({
      productId,
      productName,
      packageType: 'subscription',
      packageLabel: 'Filterabonnement (4 filtre/mnd)',
      unitPrice: 225,
      originalPrice: 225,
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
            Velg mellom enkeltdusjhode, 2-pakke eller et praktisk filterabonnement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Single */}
          <div className="relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] bg-[#1A3A5C]/40 border border-gray-700/50 hover:border-[#C9A96E]/40">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Kjøp 1</h3>
              <p className="text-sm text-[#C9A96E] font-medium mb-6">Standardpris</p>

              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{formatPrice(1077)}</span>
                <span className="text-gray-400 text-sm ml-1">kr</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">&nbsp;</p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  'Flertrinnsfiltreringsteknologi',
                  'VC Plant Fragrance Cartridge',
                  'Høytrykks vannstrøm',
                  'Universaltilkobling',
                  'Gratis frakt',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddSingle}
                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 bg-white/10 hover:bg-[#C9A96E] text-white hover:text-[#0C1B2A] border border-gray-600 hover:border-[#C9A96E]"
              >
                Legg i handlekurv
              </button>
            </div>
          </div>

          {/* Double – Most Popular */}
          <div className="relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-[#C9A96E]/20 to-[#C9A96E]/5 border-2 border-[#C9A96E] shadow-lg shadow-[#C9A96E]/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A96E] text-[#0C1B2A] text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> MEST POPULÆRE
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Kjøp 2</h3>
              <p className="text-sm text-[#C9A96E] font-medium mb-6">Spar 254 kr</p>

              <div className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                Du sparer 12%
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{formatPrice(950)}</span>
                <span className="text-gray-400 text-sm ml-1">kr/stk</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Totalt {formatPrice(1900)} kr</p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  'Flertrinnsfiltreringsteknologi',
                  'VC Plant Fragrance Cartridge',
                  'Høytrykks vannstrøm',
                  'Universaltilkobling',
                  '2 dusjhoder inkludert',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddDouble}
                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] shadow-lg shadow-[#C9A96E]/30"
              >
                Legg i handlekurv
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div className="relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] bg-[#1A3A5C]/40 border border-gray-700/50 hover:border-[#C9A96E]/40">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> ABONNEMENT
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Filterabonnement</h3>
              <p className="text-sm text-[#C9A96E] font-medium mb-6">Alltid rene filtre</p>

              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{formatPrice(225)}</span>
                <span className="text-gray-400 text-sm ml-1">kr/mnd</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">4 filtre levert hver måned</p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  '4 filtre per måned (1 per uke)',
                  'Automatisk levering til døren',
                  'Alltid friskt, rent vann',
                  'Avbestill når som helst',
                  'Gratis frakt på alle leveranser',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddSubscription}
                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 hover:border-emerald-500"
              >
                Start abonnement
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}