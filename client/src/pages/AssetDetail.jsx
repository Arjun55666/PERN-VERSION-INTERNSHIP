import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../api/client.js';
import { ErrorMessage, Loading } from '../components/State.jsx';

export function AssetDetail() {
  const { assetId } = useParams(); const [asset, setAsset] = useState(); const [error, setError] = useState();
  const load = () => request(`/assets/${encodeURIComponent(assetId)}`).then(setAsset).catch(setError);
  useEffect(() => { load(); }, [assetId]);
  const action = async (path, body) => { try { await request(path, { method: 'POST', ...(body && { body: JSON.stringify(body) }) }); load(); } catch (err) { setError(err); } };
  if (!asset && !error) return <Loading />;
  return <section><h2>{asset?.asset_id}</h2><ErrorMessage error={error} />{asset && <><p><strong>Model:</strong> {asset.asset_model} &nbsp; <strong>Serial:</strong> {asset.serial_number}</p><p><strong>Area:</strong> {asset.area} &nbsp; <strong>Type:</strong> {asset.hardware_type}</p><div className="filters"><a className="button" href={`http://localhost:5050/api/assets/${encodeURIComponent(asset.asset_id)}/qr`}>Download QR</a><button onClick={() => action(`/assignments/${asset.assignments.find((x) => x.is_active)?.id}/unassign`)} disabled={!asset.assignments.some((x) => x.is_active)}>Return to Store</button><button onClick={() => action(`/assets/${encodeURIComponent(asset.asset_id)}/status`, { isWorking: !asset.is_working })}>{asset.is_working ? 'Mark Not Working' : 'Mark Working'}</button><button onClick={() => action(`/assets/${encodeURIComponent(asset.asset_id)}/status`, { isSold: true })} disabled={asset.is_sold}>Mark Sold</button></div><h3>Assignment History</h3><table><thead><tr><th>Employee</th><th>Department</th><th>Date</th><th>Status</th><th>Verification</th></tr></thead><tbody>{asset.assignments.map((x) => <tr key={x.id}><td>{x.employee_name}</td><td>{x.department}</td><td>{x.assigned_date}</td><td>{x.is_active ? 'Active' : 'Inactive'}</td><td>{x.qr_verified ? 'Verified' : 'Not verified'}</td></tr>)}</tbody></table></>}</section>;
}
