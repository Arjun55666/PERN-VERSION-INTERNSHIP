import React, { useEffect, useState } from 'react';
import { request } from '../api/client.js';
import { ErrorMessage } from '../components/State.jsx';

export function GenerateQR() {
  const [form, setForm] = useState({ assetModel: '', datePurchased: '', serialNumber: '', area: '', hardwareType: '' });
  const [options, setOptions] = useState({ areas: [], types: [] });
  const [result, setResult] = useState(); const [error, setError] = useState();
  useEffect(() => { Promise.all([request('/locations'), request('/assets?pageSize=100')]).then(([locations, assets]) => setOptions({ areas: locations.areas || [], types: [...new Set(assets.items.map((a) => a.hardware_type))].sort() })).catch(setError); }, []);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setError(); setResult(); try { setResult(await request('/assets/generate', { method: 'POST', body: JSON.stringify(form) })); } catch (err) { setError(err); } };
  return <section><h2>Generate QR</h2><p>Create a hardware asset using the IOCL area/type naming rules and generate its QR code.</p><form className="form-grid" onSubmit={submit}><input required placeholder="Model Name" value={form.assetModel} onChange={update('assetModel')} /><input required type="date" value={form.datePurchased} onChange={update('datePurchased')} /><input required placeholder="Serial Number" value={form.serialNumber} onChange={update('serialNumber')} /><select required value={form.area} onChange={update('area')}><option value="">Select Area</option>{options.areas.map((x) => <option key={x}>{x}</option>)}</select><select required value={form.hardwareType} onChange={update('hardwareType')}><option value="">Select Hardware Type</option>{options.types.map((x) => <option key={x}>{x}</option>)}</select><button>Create Asset &amp; Generate QR</button></form><ErrorMessage error={error} />{result && <div className="success"><p>{result.message}: <strong>{result.asset.asset_id}</strong></p><a className="button" href={`http://localhost:5050/api/assets/${encodeURIComponent(result.asset.asset_id)}/qr`}>Download QR</a></div>}</section>;
}
