import React, { useState } from 'react';

const initialForm = {
  productName: '',
  harvestDate: '',
  transportTemperature: '',
  storeTemperature: '',
  storeHumidity: '',
  shelfLife: '',
  salesVelocity: '',
};

export default function FreshnessPredictor() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/predict-freshness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          transportTemperature: Number(form.transportTemperature),
          storeTemperature: Number(form.storeTemperature),
          storeHumidity: Number(form.storeHumidity),
          shelfLife: Number(form.shelfLife),
          salesVelocity: Number(form.salesVelocity),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-black">AI Freshness Predictor</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-green mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-black font-semibold mb-1">Product Name</label>
            <input name="productName" value={form.productName} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Harvest Date</label>
            <input name="harvestDate" type="date" value={form.harvestDate} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Transport Temp (°C)</label>
            <input name="transportTemperature" type="number" value={form.transportTemperature} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Store Temp (°C)</label>
            <input name="storeTemperature" type="number" value={form.storeTemperature} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Store Humidity (%)</label>
            <input name="storeHumidity" type="number" value={form.storeHumidity} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Shelf Life (days)</label>
            <input name="shelfLife" type="number" value={form.shelfLife} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Sales Velocity (units/day)</label>
            <input name="salesVelocity" type="number" value={form.salesVelocity} onChange={handleChange} required className="input-field" />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>{loading ? 'Predicting...' : 'Predict Freshness'}</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      {result && (
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <h2 className="text-xl font-bold mb-2 text-black">Prediction Result</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-black">Freshness Score</span>
              <span className="font-bold text-black">{result.predictedScore}/100</span>
            </div>
            <div className="w-full bg-green-light rounded-full h-4">
              <div className="bg-green h-4 rounded-full" style={{ width: `${result.predictedScore}%` }}></div>
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-black">Estimated Shelf Life Left:</span> <span className="font-bold text-black">{result.predictedShelfLife} days</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-black">Suggested Action:</span> <span className="font-bold text-black">{result.suggestedAction}</span>
          </div>
        </div>
      )}
    </div>
  );
} 