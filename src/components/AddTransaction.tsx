import React, { useState } from 'react';
import { BirdTransaction, FeedTransaction } from '../types';

interface AddTransactionProps {
  onAddBird: (t: BirdTransaction) => void;
  onAddFeed: (t: FeedTransaction) => void;
}

const BIRD_TYPES = [
  'Helicopter Budgies','Normal Budgies','Lutino Cocktail','Whiteface cocktail',
  'African Birds','Jumbo Finches','Black wing','Show Budgies','Rainbow Budgies',
  'Suppliments','Cockatiel','Lutino Budgies',
];
const FEED_ITEMS = [
  'Helicopter budgies','Normal budgies','Seeds','Mix seeds','Sun Flower seeds',
  'Vimrol','Steel Mess','Auto Feeder','Wood and suppliments','Breeding Box',
  'Finches','Black Wings','Tray sheet','Calcium blocks','Lutino Budgies','Cockatiel',
];
const LOCATIONS = ['Mysore','Bangalore','Chennai','Mandya','Kerala','Nagara','KGF','Pune','TS','Hassan','KR pete'];

const inputCls = "glass-input w-full rounded-xl px-4 py-3 text-sm transition-all";
const labelCls = "text-white/50 text-xs font-medium block mb-1.5";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const AddTransaction: React.FC<AddTransactionProps> = ({ onAddBird, onAddFeed }) => {
  const [type, setType] = useState<'sell' | 'buy'>('sell');
  const today = new Date().toISOString().split('T')[0];

  const [birdForm, setBirdForm] = useState({
    date: today, birds: '', customerName: '', location: '', status: 'Paid',
    paymentMethod: 'On Credit', quantity: '', unitPrice: '', remarks: '',
  });
  const [feedForm, setFeedForm] = useState({
    date: today, item: '', supplierName: '', location: '', status: 'Paid',
    paymentMethod: 'On Credit', quantity: '', uom: 'Nos', unitPrice: '', remarks: '',
  });

  const birdTotal = (parseFloat(birdForm.quantity) || 0) * (parseFloat(birdForm.unitPrice) || 0);
  const feedTotal = (parseFloat(feedForm.quantity) || 0) * (parseFloat(feedForm.unitPrice) || 0);

  const handleBirdSubmit = () => {
    if (!birdForm.birds || !birdForm.customerName || !birdForm.quantity || !birdForm.unitPrice) {
      alert('Please fill all required fields');
      return;
    }
    onAddBird({
      slNo: 0, date: birdForm.date, birds: birdForm.birds,
      customerName: birdForm.customerName, location: birdForm.location,
      status: birdForm.status, paymentMethod: birdForm.paymentMethod,
      quantity: parseFloat(birdForm.quantity), unitPrice: parseFloat(birdForm.unitPrice),
      amount: birdTotal, remarks: birdForm.remarks,
    });
    setBirdForm({ date: today, birds: '', customerName: '', location: '', status: 'Paid', paymentMethod: 'On Credit', quantity: '', unitPrice: '', remarks: '' });
  };

  const handleFeedSubmit = () => {
    if (!feedForm.item || !feedForm.supplierName || !feedForm.quantity || !feedForm.unitPrice) {
      alert('Please fill all required fields');
      return;
    }
    onAddFeed({
      slNo: 0, date: feedForm.date, item: feedForm.item,
      supplierName: feedForm.supplierName, location: feedForm.location,
      status: feedForm.status, paymentMethod: feedForm.paymentMethod,
      quantity: parseFloat(feedForm.quantity), uom: feedForm.uom,
      unitPrice: parseFloat(feedForm.unitPrice), amount: feedTotal, remarks: feedForm.remarks,
    });
    setFeedForm({ date: today, item: '', supplierName: '', location: '', status: 'Paid', paymentMethod: 'On Credit', quantity: '', uom: 'Nos', unitPrice: '', remarks: '' });
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="glass-card rounded-2xl p-1.5 flex gap-1">
        <button
          onClick={() => setType('sell')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'sell' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'text-white/40'}`}
        >
          🐦 Bird Sale
        </button>
        <button
          onClick={() => setType('buy')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'buy' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'text-white/40'}`}
        >
          🛒 Purchase
        </button>
      </div>

      {type === 'sell' ? (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <Field label="Date">
            <input type="date" className={inputCls} value={birdForm.date}
              onChange={e => setBirdForm(p => ({ ...p, date: e.target.value }))} />
          </Field>
          <Field label="Bird Type *">
            <input list="bird-types" className={inputCls} placeholder="e.g. Helicopter Budgies" value={birdForm.birds}
              onChange={e => setBirdForm(p => ({ ...p, birds: e.target.value }))} />
            <datalist id="bird-types">{BIRD_TYPES.map(b => <option key={b} value={b} />)}</datalist>
          </Field>
          <Field label="Customer Name *">
            <input type="text" className={inputCls} placeholder="Customer name" value={birdForm.customerName}
              onChange={e => setBirdForm(p => ({ ...p, customerName: e.target.value }))} />
          </Field>
          <Field label="Location">
            <input list="locations-s" className={inputCls} placeholder="City" value={birdForm.location}
              onChange={e => setBirdForm(p => ({ ...p, location: e.target.value }))} />
            <datalist id="locations-s">{LOCATIONS.map(l => <option key={l} value={l} />)}</datalist>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity *">
              <input type="number" inputMode="numeric" className={inputCls} placeholder="0" value={birdForm.quantity}
                onChange={e => setBirdForm(p => ({ ...p, quantity: e.target.value }))} />
            </Field>
            <Field label="Unit Price (₹) *">
              <input type="number" inputMode="decimal" className={inputCls} placeholder="0" value={birdForm.unitPrice}
                onChange={e => setBirdForm(p => ({ ...p, unitPrice: e.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inputCls} value={birdForm.status}
                onChange={e => setBirdForm(p => ({ ...p, status: e.target.value }))}>
                <option>Paid</option>
                <option>Not Paid</option>
              </select>
            </Field>
            <Field label="Payment">
              <select className={inputCls} value={birdForm.paymentMethod}
                onChange={e => setBirdForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                <option>On Credit</option>
                <option>On Cash</option>
                <option>UPI</option>
              </select>
            </Field>
          </div>
          <Field label="Remarks">
            <input type="text" className={inputCls} placeholder="Optional notes" value={birdForm.remarks}
              onChange={e => setBirdForm(p => ({ ...p, remarks: e.target.value }))} />
          </Field>

          {birdTotal > 0 && (
            <div className="glass rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-white/50 text-sm">Total Amount</span>
              <span className="text-emerald-400 text-xl font-bold">₹{birdTotal.toLocaleString('en-IN')}</span>
            </div>
          )}

          <button onClick={handleBirdSubmit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm active:scale-95 transition-all shadow-lg shadow-emerald-900/30 mt-1">
            ✅ Add Sale Entry
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <Field label="Date">
            <input type="date" className={inputCls} value={feedForm.date}
              onChange={e => setFeedForm(p => ({ ...p, date: e.target.value }))} />
          </Field>
          <Field label="Item *">
            <input list="feed-items" className={inputCls} placeholder="e.g. Helicopter budgies" value={feedForm.item}
              onChange={e => setFeedForm(p => ({ ...p, item: e.target.value }))} />
            <datalist id="feed-items">{FEED_ITEMS.map(f => <option key={f} value={f} />)}</datalist>
          </Field>
          <Field label="Supplier Name *">
            <input type="text" className={inputCls} placeholder="Supplier name" value={feedForm.supplierName}
              onChange={e => setFeedForm(p => ({ ...p, supplierName: e.target.value }))} />
          </Field>
          <Field label="Location">
            <input list="locations-b" className={inputCls} placeholder="City" value={feedForm.location}
              onChange={e => setFeedForm(p => ({ ...p, location: e.target.value }))} />
            <datalist id="locations-b">{LOCATIONS.map(l => <option key={l} value={l} />)}</datalist>
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Field label="Quantity *">
                <input type="number" inputMode="numeric" className={inputCls} placeholder="0" value={feedForm.quantity}
                  onChange={e => setFeedForm(p => ({ ...p, quantity: e.target.value }))} />
              </Field>
            </div>
            <Field label="UOM">
              <select className={inputCls} value={feedForm.uom}
                onChange={e => setFeedForm(p => ({ ...p, uom: e.target.value }))}>
                <option>Nos</option>
                <option>Kg</option>
                <option>ml</option>
                <option>L</option>
              </select>
            </Field>
          </div>
          <Field label="Unit Price (₹) *">
            <input type="number" inputMode="decimal" className={inputCls} placeholder="0" value={feedForm.unitPrice}
              onChange={e => setFeedForm(p => ({ ...p, unitPrice: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inputCls} value={feedForm.status}
                onChange={e => setFeedForm(p => ({ ...p, status: e.target.value }))}>
                <option>Paid</option>
                <option>Not Paid</option>
              </select>
            </Field>
            <Field label="Payment">
              <select className={inputCls} value={feedForm.paymentMethod}
                onChange={e => setFeedForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                <option>On Credit</option>
                <option>On Cash</option>
                <option>UPI</option>
              </select>
            </Field>
          </div>
          <Field label="Remarks">
            <input type="text" className={inputCls} placeholder="Optional notes" value={feedForm.remarks}
              onChange={e => setFeedForm(p => ({ ...p, remarks: e.target.value }))} />
          </Field>

          {feedTotal > 0 && (
            <div className="glass rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-white/50 text-sm">Total Amount</span>
              <span className="text-rose-400 text-xl font-bold">₹{feedTotal.toLocaleString('en-IN')}</span>
            </div>
          )}

          <button onClick={handleFeedSubmit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-sm active:scale-95 transition-all shadow-lg shadow-rose-900/30 mt-1">
            ✅ Add Purchase Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTransaction;
