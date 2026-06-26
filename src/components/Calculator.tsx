import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator as CalcIcon } from 'lucide-react';

// CONFIG — edit these values easily
const PRICE_PER_M2 = 45000; // [ÁR_PER_M2] alap m²-ár HUF-ban
const COLOR_SURCHARGE = 1.2; // egyedi RAL szorzó
const PET_SURCHARGE = 1.15; // macskabiztos PET szorzó

interface Row {
  width: string;
  height: string;
  qty: string;
  color: 'white' | 'custom';
  mesh: 'standard' | 'pet';
}

function formatHuf(n: number): string {
  return Math.round(n).toLocaleString('hu-HU').replace(/,/g, ' ') + ' Ft';
}

export default function CalculatorSection() {
  const [rows, setRows] = useState<Row[]>([
    { width: '', height: '', qty: '1', color: 'white', mesh: 'standard' },
  ]);
  const [results, setResults] = useState<{ width: number; height: number; qty: number; m2: number; price: number }[] | null>(null);

  const addRow = () => {
    setRows([...rows, { width: '', height: '', qty: '1', color: 'white', mesh: 'standard' }]);
  };

  const removeRow = (i: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, idx) => idx !== i));
  };

  const updateRow = (i: number, field: keyof Row, value: string) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: value };
    setRows(updated);
  };

  const calculate = () => {
    const calculated = rows.map(row => {
      const w = parseFloat(row.width) || 0;
      const h = parseFloat(row.height) || 0;
      const q = parseInt(row.qty) || 1;
      const m2 = (w / 100) * (h / 100) * q;
      let price = m2 * PRICE_PER_M2;
      if (row.color === 'custom') price *= COLOR_SURCHARGE;
      if (row.mesh === 'pet') price *= PET_SURCHARGE;
      return { width: w, height: h, qty: q, m2, price };
    });
    setResults(calculated);
  };

  const isValid = rows.every(r => parseFloat(r.width) > 0 && parseFloat(r.height) > 0);

  const scrollToQuote = () => {
    const dims = rows.map(r => `${r.width}x${r.height} cm, ${r.qty} db`).join('; ');
    const el = document.querySelector('#ajanlatkeres');
    el?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('prefill-quote', { detail: dims }));
  };

  return (
    <section id="kalkulator" className="section-padding bg-warm-gradient relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="section-overline">Tervezés</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink mb-4">
            Szúnyogháló kalkulátor
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-line-warm rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-card-hover ring-1 ring-orange/5"
        >
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
                <div>
                  <label className="text-xs font-medium text-muted mb-1 block">Szélesség (cm)</label>
                  <input
                    type="number"
                    min="1"
                    value={row.width}
                    onChange={e => updateRow(i, 'width', e.target.value)}
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange transition-colors"
                    placeholder="pl. 120"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1 block">Magasság (cm)</label>
                  <input
                    type="number"
                    min="1"
                    value={row.height}
                    onChange={e => updateRow(i, 'height', e.target.value)}
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange transition-colors"
                    placeholder="pl. 220"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1 block">Darabszám</label>
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={e => updateRow(i, 'qty', e.target.value)}
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1 block">Szín</label>
                  <select
                    value={row.color}
                    onChange={e => updateRow(i, 'color', e.target.value)}
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange transition-colors bg-white"
                  >
                    <option value="white">Fehér (alap)</option>
                    <option value="custom">Egyedi RAL (felár)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1 block">Háló</label>
                  <select
                    value={row.mesh}
                    onChange={e => updateRow(i, 'mesh', e.target.value)}
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange transition-colors bg-white"
                  >
                    <option value="standard">Standard üvegszálas</option>
                    <option value="pet" disabled>Macskabiztos PET (hamarosan)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="p-2.5 text-muted hover:text-red-500 transition-colors"
                      aria-label="Sor törlése"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={addRow} className="btn-secondary text-sm px-4 py-2.5">
              <Plus size={16} /> Új méret hozzáadása
            </button>
            <button
              onClick={calculate}
              disabled={!isValid}
              className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <CalcIcon size={16} /> Számítás
            </button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left">
                        <th className="pb-2 font-medium text-muted">SZ (cm)</th>
                        <th className="pb-2 font-medium text-muted">M (cm)</th>
                        <th className="pb-2 font-medium text-muted">Db</th>
                        <th className="pb-2 font-medium text-muted">Nm (m&sup2;)</th>
                        <th className="pb-2 font-medium text-muted text-right">Becsült ár</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={i} className="border-b border-line/50">
                          <td className="py-2">{r.width}</td>
                          <td className="py-2">{r.height}</td>
                          <td className="py-2">{r.qty}</td>
                          <td className="py-2">{r.m2.toFixed(2)}</td>
                          <td className="py-2 text-right font-semibold text-ink">{formatHuf(r.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td colSpan={3} className="pt-3">Összesen</td>
                        <td className="pt-3">{results.reduce((s, r) => s + r.m2, 0).toFixed(2)} m&sup2;</td>
                        <td className="pt-3 text-right text-orange text-lg">
                          {formatHuf(results.reduce((s, r) => s + r.price, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <p className="text-xs text-muted mt-4 italic">
                  Tájékoztató jellegű becsült ár — a pontos árért kérjen egyedi ajánlatot.
                </p>

                <button onClick={scrollToQuote} className="btn-primary mt-4">
                  Pontos árajánlatot kérek
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
