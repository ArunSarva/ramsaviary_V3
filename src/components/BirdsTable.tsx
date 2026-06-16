import React, { useState } from 'react';
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { BirdTransaction } from '../types';
import ConfirmModal from './ConfirmModal';

interface BirdsTableProps {
  birds: BirdTransaction[];
  onDelete: (index: number) => void;
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const BirdCard: React.FC<{ b: BirdTransaction; origIndex: number; onDeleteRequest: (i: number, label: string) => void }> = ({ b, origIndex, onDeleteRequest }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between p-4 gap-3" onClick={() => setExpanded(e => !e)}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${b.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {b.status}
            </span>
            <span className="text-white/40 text-[10px]">{b.date}</span>
          </div>
          <p className="text-white font-semibold truncate">{b.birds}</p>
          <p className="text-white/50 text-sm truncate">{b.customerName} · {b.location}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-emerald-400 font-bold text-lg">{fmt(b.amount)}</p>
          <p className="text-white/40 text-xs">×{b.quantity} @ {fmt(b.unitPrice)}</p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-2 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="glass rounded-xl p-2.5">
              <p className="text-white/40 text-[10px] mb-0.5">Payment</p>
              <p className="text-white text-xs font-medium">{b.paymentMethod}</p>
            </div>
            <div className="glass rounded-xl p-2.5">
              <p className="text-white/40 text-[10px] mb-0.5">Unit Price</p>
              <p className="text-white text-xs font-medium">{fmt(b.unitPrice)}</p>
            </div>
          </div>
          {b.remarks && (
            <div className="glass rounded-xl p-2.5">
              <p className="text-white/40 text-[10px] mb-0.5">Remarks</p>
              <p className="text-white/70 text-xs">{b.remarks}</p>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteRequest(origIndex, `${b.birds} — ${b.customerName}`); }}
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

const BirdsTable: React.FC<BirdsTableProps> = ({ birds, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modal, setModal] = useState<{ index: number; label: string } | null>(null);

  const filtered = birds.filter(b => {
    const matchSearch =
      b.birds.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total = filtered.reduce((s, b) => s + b.amount, 0);

  const handleDeleteRequest = (index: number, label: string) => {
    setModal({ index, label });
  };

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
          <span className="text-emerald-400 font-bold">{'₹' + total.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass-input w-full rounded-xl pl-8 pr-3 py-2.5 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="glass-input rounded-xl px-3 py-2.5 text-sm text-white w-28"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Not Paid">Unpaid</option>
          </select>
        </div>

        {filtered.length === 0
          ? <div className="text-center py-12 text-white/40 text-sm">No records found</div>
          : filtered.map((b, i) => (
            <BirdCard key={i} b={b} origIndex={birds.indexOf(b)} onDeleteRequest={handleDeleteRequest} />
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

export default BirdsTable;
