import { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '@/lib/api';
import { toast } from 'sonner';

const tones = [
  { value: 'professional', label: 'Profesjonell', emoji: '💼' },
  { value: 'casual', label: 'Uformell', emoji: '😊' },
  { value: 'humorous', label: 'Humoristisk', emoji: '😄' },
];

const platforms = [
  { value: 'facebook', label: 'Facebook', emoji: '📘' },
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
  { value: 'google-ads', label: 'Google Ads', emoji: '🔍' },
];

const toneDescriptions: Record<string, string> = {
  professional: 'en profesjonell, tillitvekkende og autoritativ',
  casual: 'en uformell, vennlig og personlig',
  humorous: 'en humoristisk, morsom og engasjerende',
};

const platformInstructions: Record<string, string> = {
  facebook: 'Skriv en Facebook-annonse med en sterk overskrift, engasjerende brødtekst (maks 125 tegn for primærtekst), og en tydelig call-to-action. Bruk emoji der det passer. Inkluder forslag til overskrift og beskrivelse.',
  instagram: 'Skriv en Instagram-annonse/caption med visuelt språk, relevante hashtags (5-10 stk), emoji, og en engasjerende hook i første setning. Maks 2200 tegn.',
  'google-ads': 'Skriv Google Ads-tekst med: 3 overskrifter (maks 30 tegn hver), 2 beskrivelser (maks 90 tegn hver), og relevante søkeord. Formater tydelig med labels.',
};

export default function AiWriter() {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    const toneDesc = toneDescriptions[selectedTone];
    const platformInstr = platformInstructions[selectedPlatform];
    const platformLabel = platforms.find(p => p.value === selectedPlatform)?.label || selectedPlatform;

    const systemPrompt = `Du er en ekspert-copywriter som spesialiserer seg på digital markedsføring og luksusprodukter. Du skriver alltid på norsk.

Produktet er Pure Flow – et premium dusjhode med avansert flertrinnsfiltreringsteknologi og VC Plant Fragrance Filter Cartridge som filtrerer bort bakterier, kalk og urenheter, og gir en spa-opplevelse hjemme.

Nøkkelfordeler:
- Avansert filtrering som reduserer klor, bakterier og kalkavleiringer
- VC Plant Fragrance Filter Cartridge med mild, naturlig duft
- Kraftig vanntrykk med spesialdesignede mikrodyser
- Enkel installasjon på under 2 minutter uten verktøy
- Pris fra 1 059 kr (33% rabatt)

Bruk ${toneDesc} tone i all tekst.`;

    const userPrompt = `${platformInstr}

${customPrompt ? `Tilleggsinstruksjoner: ${customPrompt}` : `Lag en overbevisende ${platformLabel}-annonse for Pure Flow dusjhode.`}`;

    try {
      await client.ai.gentxt({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        model: 'gpt-5-chat',
        stream: true,
        onChunk: (chunk) => {
          if (chunk.content) {
            setResult((prev) => prev + chunk.content);
          }
        },
        onComplete: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Noe gikk galt under generering');
          setLoading(false);
        },
        timeout: 60000,
      });
    } catch (err: any) {
      toast.error(err?.data?.detail || err?.message || 'Kunne ikke generere tekst');
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Kopiert til utklippstavlen!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#C9A96E] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Tilbake til butikken
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#C9A96E]/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#C9A96E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">AI Annonsegenerator</h1>
            <p className="text-gray-500 text-sm">Generer skreddersydde annonser for Facebook, Instagram og Google Ads</p>
          </div>
        </div>

        {/* Tone Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">Velg tone</label>
          <div className="grid grid-cols-3 gap-3">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => setSelectedTone(tone.value)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedTone === tone.value
                    ? 'border-[#C9A96E] bg-[#C9A96E]/10 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-[#C9A96E]/40'
                }`}
              >
                <span className="text-2xl block mb-1">{tone.emoji}</span>
                <span className={`text-sm font-medium ${selectedTone === tone.value ? 'text-[#C9A96E]' : 'text-gray-700'}`}>
                  {tone.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">Velg plattform</label>
          <div className="grid grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.value}
                onClick={() => setSelectedPlatform(platform.value)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedPlatform === platform.value
                    ? 'border-[#C9A96E] bg-[#C9A96E]/10 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-[#C9A96E]/40'
                }`}
              >
                <span className="text-2xl block mb-1">{platform.emoji}</span>
                <span className={`text-sm font-medium ${selectedPlatform === platform.value ? 'text-[#C9A96E]' : 'text-gray-700'}`}>
                  {platform.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Tilleggsinstruksjoner <span className="text-gray-400 font-normal">(valgfritt)</span>
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="F.eks. 'Fokuser på vannbesparelse' eller 'Målgruppe: unge voksne 25-35 år'..."
            className="w-full h-24 resize-none border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/30 transition-all text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 bg-[#C9A96E] hover:bg-[#B8944D] disabled:opacity-50 disabled:cursor-not-allowed text-[#0C1B2A] font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {loading ? 'Genererer annonse...' : 'Generer annonse'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1A1A1A]">Generert annonse</h3>
                <span className="text-xs bg-[#C9A96E]/10 text-[#C9A96E] font-medium px-2 py-0.5 rounded-full">
                  {platforms.find(p => p.value === selectedPlatform)?.label}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                  {tones.find(t => t.value === selectedTone)?.label}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#C9A96E] transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopiert!' : 'Kopier'}
              </button>
            </div>
            <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}