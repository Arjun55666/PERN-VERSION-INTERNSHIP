import React, { useState } from 'react';
import { request } from '../api/client.js';
import { ErrorMessage } from '../components/State.jsx';

export function VerifyAssignment() {
  const [form, setForm] = useState({ assignmentId: '', assetId: '', serialNumber: '' }); const [result, setResult] = useState(); const [error, setError] = useState();
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setError(); setResult(); try { setResult(await request(`/verifications/${form.assignmentId}/check`, { method: 'POST', body: JSON.stringify({ assetId: form.assetId, serialNumber: form.serialNumber }) })); } catch (err) { setError(err); } };
  return <section><h2>Physical Verification</h2><p>Compare the scanned asset ID and serial number with the assigned database record.</p><form className="form-grid" onSubmit={submit}><input required placeholder="Assignment ID" value={form.assignmentId} onChange={update('assignmentId')} /><input required placeholder="Scanned Asset ID" value={form.assetId} onChange={update('assetId')} /><input required placeholder="Scanned Serial Number" value={form.serialNumber} onChange={update('serialNumber')} /><button>Verify Asset</button></form><ErrorMessage error={error} />{result && <div className={result.verified ? 'success' : 'error-box'}><strong>{result.verified ? 'Verified' : 'Verification failed'}</strong><p>Asset ID: {result.asset_match ? 'matched' : 'mismatched'} · Serial: {result.serial_match ? 'matched' : 'mismatched'}</p></div>}</section>;
}
