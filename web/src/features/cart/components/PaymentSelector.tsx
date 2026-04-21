import { Banknote, CreditCard } from 'lucide-react';

interface PaymentSelectorProps {
  paymentMethod: 'Efectivo' | 'Transferencia';
  onChange: (method: 'Efectivo' | 'Transferencia') => void;
}

export function PaymentSelector({ paymentMethod, onChange }: PaymentSelectorProps) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-sm mb-6">
      <h2 className="text-sm font-black text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Banknote className="w-4 h-4 text-primary" />
        ¿Cómo vas a pagar?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange('Efectivo')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
            paymentMethod === 'Efectivo'
              ? 'border-primary bg-primary/10 text-primary scale-[1.02]'
              : 'border-border bg-background text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Banknote className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold">Efectivo</span>
        </button>
        <button
          onClick={() => onChange('Transferencia')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
            paymentMethod === 'Transferencia'
              ? 'border-primary bg-primary/10 text-primary scale-[1.02]'
              : 'border-border bg-background text-muted-foreground hover:bg-secondary'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold">Transferencia</span>
        </button>
      </div>
    </div>
  );
}
