import React from 'react';
import { useEffect, useState } from 'react';
import { request } from '../api/client.js';
import { ErrorMessage, Loading } from '../components/State.jsx';                                       

export function Dashboard() {
  const [data, setData] = useState(); const [error, setError] = useState();
  useEffect(() => { request('/dashboard/summary').then(setData).catch(setError); }, []);
  if (!data && !error) return <Loading />;
  return <section><h2>Dashboard</h2><ErrorMessage error={error}/>{data && <>
    <div className="cards">{[['Assets',data.assets],['Assigned',data.active_assignments],['Unassigned',data.unassigned],['Sold',data.sold],['Not working',data.not_working]].map(([k,v])=><article className="card" key={k}><strong>{v}</strong><span>{k}</span></article>)}</div>
    <div className="grid"><article><h3>Assets by location</h3>{data.by_area.map(x=><p key={x.area}>{x.area}: {x._count._all}</p>)}</article><article><h3>Assets by type</h3>{data.by_type.map(x=><p key={x.hardware_type}>{x.hardware_type}: {x._count._all}</p>)}</article></div>
  </>}</section>;
}
