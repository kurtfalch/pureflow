import { ArrowLeft, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <Droplets className="w-20 h-20 text-[#C9A96E]/30 mx-auto" />
        <h1 className="text-6xl font-bold text-[#0C1B2A]">404</h1>
        <p className="text-xl text-gray-500">Siden du leter etter finnes ikke</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Tilbake til forsiden
        </button>
      </div>
    </div>
  );
}