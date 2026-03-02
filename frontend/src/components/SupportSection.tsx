import { useState } from 'react';
import { Send, Loader2, CheckCircle, Mail, User, MessageSquare } from 'lucide-react';
import client from '@/lib/api';
import { toast } from 'sonner';

export default function SupportSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vennligst fyll ut alle felt');
      return;
    }
    setSending(true);
    try {
      await client.entities.support_messages.create({
        data: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      });
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Melding sendt!');
    } catch (err) {
      console.error(err);
      toast.error('Kunne ikke sende melding. Prøv igjen.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="support" className="py-20 sm:py-28 bg-[#0C1B2A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A96E]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full px-5 py-2 mb-6">
            <MessageSquare className="w-4 h-4 text-[#C9A96E]" />
            <span className="text-[#C9A96E] text-sm font-medium">Kundeservice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trenger du <span className="text-[#C9A96E]">hjelp</span>?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Vi er her for deg. Send oss en melding, så svarer vi så raskt vi kan.
          </p>
        </div>

        {sent ? (
          <div className="bg-white/5 border border-[#C9A96E]/20 rounded-2xl p-10 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-[#C9A96E] mx-auto" />
            <h3 className="text-2xl font-bold text-white">Takk for din melding!</h3>
            <p className="text-gray-400">Vi har mottatt henvendelsen din og vil svare deg så snart som mulig.</p>
            <button
              onClick={() => setSent(false)}
              className="text-[#C9A96E] hover:text-[#B8944D] font-medium text-sm transition-colors"
            >
              Send en ny melding
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <User className="w-4 h-4" /> Navn
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                  placeholder="Ditt navn"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Mail className="w-4 h-4" /> E-post
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                  placeholder="din@epost.no"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <MessageSquare className="w-4 h-4" /> Melding
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                placeholder="Skriv din melding her..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#B8944D] disabled:opacity-50 text-[#0C1B2A] font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#C9A96E]/20 flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {sending ? 'Sender...' : 'Send melding'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}