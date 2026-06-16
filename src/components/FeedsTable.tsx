import React, { useState } from 'react';
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { FeedTransaction } from '../types';
import ConfirmModal from './ConfirmModal';

interface FeedsTableProps {
  feeds: FeedTransaction[];
  onDelete: (index: number) => void;
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const FeedCard: React.FC<{ f: FeedTransaction; origIndex: number; onDeleteRequest: (i: number, label: string) => void }> = ({ f, origIndex, onDeleteRequest }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between p-4 gap-3" onClick={() => setExpanded(e => !e)}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${f.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {f.status}
            </span>
            <span className="text-white/40 text-[10px]">{f.date}</span>
          </div>
          <p className="text-white font-semibold truncate">{f.item}</p>
          <p className="text-white/50 text-sm truncate">{f.supplierName} · {f.location}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-rose-400 font-bold text-lg">{fmt(f.amount)}</p>
          <p className="text-white/40 text-xs">{f.quantity} {f.uom} @ {fmt(f.unitPrice)}</p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-2 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="glass rounded-xl p-2.5">
              <p className="text-white/40 text-[10px] mb-0.5">Payment</p>
              <p className="text-white text-xs font-medium">{f.paymentMethod}</p>
            </div>
            <div className="glass rounded-xl p-2.5">
              <p className="text-white/40 text-[10px] mb-0.5">Unit Price</p>
              <p className="text-white text-xs font-medium">{fmt(f.unitPrice)}</p>
            </div>
          </div>
          {f.remarks && (
            <div className="glass rounded-xl p-2.5">
              <p className="text-white/40 text-[10px] mb-0.5">Remarks</p>
              <p className="text-white/70 text-xs">{f.remarks}</p>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteRequest(origIndex, `${f.item} — ${f.supplierName}`); }}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} /> Delete Entry
          </button>
        </div>
      )}

      <div className="flex justify-center pb-1 text-white/20">
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </div>
  );
};

const FeedsTable: React.FC<FeedsTableProps> = ({ feeds, onDelete }) => {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ index: number; label: string } | null>(null);

  const filtered = feeds.filter(f =>
    f.item.toLowerCase().includes(search.toLowerCase()) ||
    f.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    f.location.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((s, f) => s + f.amount, 0);

  const handleConfirm = () => {
    if (modal !== null) {
      onDelete(modal.index);
      setModal(null);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="glass-card rounded-2xl px-4 py-3 flex justify-between items-center">
          <span className="text-white/50 text-sm">{filtered.length} records</span>
          <span className="text-rose-400 font-bold">{'₹' + total.toLocaleString('en-IN')}</span>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search item, supplier, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input w-full rounded-xl pl-8 pr-3 py-2.5 text-sm"
          />
        </div>

        {filtered.length === 0
          ? <div className="text-center py-12 text-white/40 text-sm">No records found</div>
          : filtered.map((f, i) => (
            <FeedCard key={i} f={f} origIndex={feeds.indexOf(f)} onDeleteRequest={(idx, label) => setModal({ index: idx, label })} />
          ))
        }
      </div>

      <ConfirmModal
        isOpen={modal !== null}
        title="Delete Entry?"
        description={`"${modal?.label}" will be permanently removed from your records.`}
        onConfirm={handleConfirm}
        onCancel={() => setModal(null)}
      />
    </>
  );
};

export default FeedsTable;
