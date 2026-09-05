import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { queryString, reportUrl, request } from '../api/client.js';
import { Empty, ErrorMessage, Loading } from '../components/State.jsx';

export function Assets({ title = 'Asset History' }) {
  const [filters,setFilters]=useState({q:'',area:'',type:''}); const [data,setData]=useState(); const [error,setError]=useState();
  const load=()=>request(`/assets?${queryString(filters)}`).then(setData).catch(setError);
  useEffect(() => { load(); }, []);
  return <section><div className="title-row"><h2>{title}</h2><a className="button" href={reportUrl('/reports/assets.csv',filters)}>CSV</a></div>
    <form className="filters" onSubmit={e=>{e.preventDefault();load();}}>
      <input placeholder="Search asset, serial, model" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/>
      <input placeholder="Location" value={filters.area} onChange={e=>setFilters({...filters,area:e.target.value})}/>
      <input placeholder="Hardware type" value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value})}/><button>Search</button>
    </form><ErrorMessage error={error}/>{!data&&!error?<Loading/>:data?.items.length===0?<Empty/>:<table><thead><tr><th>Asset ID</th><th>Model</th><th>Serial</th><th>Location</th><th>Type</th><th>Status</th></tr></thead><tbody>{data?.items.map(a=><tr key={a.id}><td>{a.asset_id}</td><td>{a.asset_model}</td><td>{a.serial_number}</td><td>{a.area}</td><td>{a.hardware_type}</td><td>{a.is_sold?'Sold':a.assignments.length?'Assigned':'Available'}</td></tr>)}</tbody></table>}</section>;
}
