import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Truck, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

type Path = 'quote' | 'survey' | null;

interface FormData {
  path: Path;
  width: string;
  height: string;
  color: string;
  mesh: string;
  city: string;
  delivery: string;
  preferredDate: string;
  message: string;
  name: string;
  phone: string;
  email: string;
  gdpr: boolean;
}

const initialForm: FormData = {
  path: null,
  width: '',
  height: '',
  color: 'Fehér (alap)',
  mesh: 'Standard',
  city: '',
  delivery: 'nem',
  preferredDate: '',
  message: '',
  name: '',
  phone: '',
  email: '',
  gdpr: false,
};

export default function QuoteRequest() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setForm(f => ({ ...f, message: `Kalkulátorból: ${detail}` }));
      }
    };
    window.addEventListener('prefill-quote', handler);
    return () => window.removeEventListener('prefill-quote', handler);
  }, []);

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const selectPath = (path: Path) => {
    setForm(prev => ({ ...prev, path }));
    goNext();
  };

  const goNext = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, 3));
  };
  const goBack = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const canAdvanceStep2 = form.city.trim().length > 0;
  const canAdvanceStep3 = form.name.trim().length > 0 && form.phone.trim().length > 0 && form.email.trim().length > 0 && form.gdpr;

  // TODO: connect EmailJS / Formspree / own endpoint
  const handleSubmit = async () => {
    console.log('Quote form submitted:', form);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setSubmitted(true);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  if (submitted) {
    return (
      <section id="ajanlatkeres" className="section-padding bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h3 className="font-display font-bold text-2xl text-ink mb-3">
              Köszönjük!
            </h3>
            <p className="text-muted text-lg">
              Hamarosan felvesszük Önnel a kapcsolatot.
            </p>
            <p className="text-muted mt-4">
              Inkább telefonálna? <a href="tel:+36704224909" className="text-orange font-semibold hover:underline">06 70 422 4909</a>
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="ajanlatkeres" className="section-padding bg-warm-gradient-subtle relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange/[0.03] rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="section-overline">Kapcsolatfelvétel</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink mb-4">
            Kérjen ajánlatot
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= s ? 'bg-orange text-white shadow-glow-sm' : 'bg-line text-muted'
                }`}>
                  {s}
                </div>
                <span className={`hidden sm:inline text-xs font-medium ${step >= s ? 'text-ink' : 'text-muted'}`}>
                  {s === 1 ? 'Hogyan segítsünk?' : s === 2 ? 'Részletek' : 'Kapcsolat'}
                </span>
                {s < 3 && <div className={`w-8 h-0.5 transition-colors duration-300 ${step > s ? 'bg-orange' : 'bg-line'}`} />}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-white border border-line-warm rounded-2xl p-6 md:p-8 min-h-[360px] relative overflow-hidden shadow-card-warm ring-1 ring-orange/5">
            <AnimatePresence custom={direction} mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-center text-muted mb-8">Hogyan segíthetünk?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => selectPath('quote')}
                      className={`border-2 rounded-2xl p-6 text-left transition-all hover:border-orange hover:shadow-card-hover ${
                        form.path === 'quote' ? 'border-orange bg-orange-tint' : 'border-line bg-white'
                      }`}
                    >
                      <Ruler size={28} className="text-orange mb-3" />
                      <h4 className="font-display font-semibold text-lg text-ink mb-1">Árajánlat</h4>
                      <p className="text-sm text-muted">Tudom a méreteket, és árajánlatot szeretnék kérni.</p>
                    </button>
                    <button
                      onClick={() => selectPath('survey')}
                      className={`border-2 rounded-2xl p-6 text-left transition-all hover:border-orange hover:shadow-card-hover ${
                        form.path === 'survey' ? 'border-orange bg-orange-tint' : 'border-line bg-white'
                      }`}
                    >
                      <Truck size={28} className="text-orange mb-3" />
                      <h4 className="font-display font-semibold text-lg text-ink mb-1">Helyszíni felmérés</h4>
                      <p className="text-sm text-muted">Bízza ránk a méretfelvételt — ingyenes helyszíni felméréssel készítünk ajánlatot.</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">
                        Szélesség (cm) {form.path === 'survey' && <span className="text-muted/60">— opcionális</span>}
                      </label>
                      <input
                        type="number"
                        value={form.width}
                        onChange={e => update('width', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                        placeholder="pl. 120"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">
                        Magasság (cm) {form.path === 'survey' && <span className="text-muted/60">— opcionális</span>}
                      </label>
                      <input
                        type="number"
                        value={form.height}
                        onChange={e => update('height', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                        placeholder="pl. 220"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">Szín</label>
                      <select
                        value={form.color}
                        onChange={e => update('color', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors bg-white"
                      >
                        <option>Fehér (alap)</option>
                        <option>Egyedi RAL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">Háló típus</label>
                      <select
                        value={form.mesh}
                        onChange={e => update('mesh', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors bg-white"
                      >
                        <option>Standard</option>
                        <option>Macskabiztos PET</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">Település *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => update('city', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                        placeholder="pl. Szombathely"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">Kiszállítást kér?</label>
                      <select
                        value={form.delivery}
                        onChange={e => update('delivery', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors bg-white"
                      >
                        <option value="igen">Igen</option>
                        <option value="nem">Nem</option>
                      </select>
                    </div>
                  </div>
                  {form.path === 'survey' && (
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">Kívánt időpont</label>
                      <input
                        type="text"
                        value={form.preferredDate}
                        onChange={e => update('preferredDate', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                        placeholder="pl. jövő hétfő délelőtt"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted mb-1 block">Üzenet (opcionális)</label>
                    <textarea
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      rows={3}
                      className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors resize-none"
                      placeholder="Egyéb megjegyzés..."
                    />
                  </div>
                  <div className="flex justify-between pt-2">
                    <button onClick={goBack} className="btn-secondary text-sm px-5 py-2.5">
                      <ArrowLeft size={16} /> Vissza
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!canAdvanceStep2}
                      className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tovább <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-medium text-muted mb-1 block">Név *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                      placeholder="Teljes név"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">Telefon *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                        placeholder="+36 70 123 4567"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1 block">E-mail *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange transition-colors"
                        placeholder="nev@email.hu"
                        required
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={form.gdpr}
                      onChange={e => update('gdpr', e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-line text-orange focus:ring-orange"
                    />
                    <span className="text-sm text-muted">
                      Hozzájárulok az adataim kezeléséhez.
                    </span>
                  </label>
                  <div className="flex justify-between pt-4">
                    <button onClick={goBack} className="btn-secondary text-sm px-5 py-2.5">
                      <ArrowLeft size={16} /> Vissza
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canAdvanceStep3}
                      className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Küldés
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Inkább telefonálna? <a href="tel:+36704224909" className="text-orange font-semibold hover:underline">06 70 422 4909</a>
          </p>
        </div>
      </div>
    </section>
  );
}
