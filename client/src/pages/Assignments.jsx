import React from 'react';
import { useEffect, useState } from 'react';
import { queryString, reportUrl, request } from '../api/client.js';
import { Empty, ErrorMessage, Loading } from '../components/State.jsx';

export function Assignments() {
  const [filters,setFilters]=useState({q:'',area:'',department:'',type:'',status:''}); const [items,setItems]=useState(); const [error,setError]=useState();
  const [options,setOptions]=useState({areas:[],departments:[],types:[]});
  const load=()=>request(`/department-assets?${queryString(filters)}`).then(setItems).catch(setError);
  useEffect(()=>{
    Promise.all([request('/department-assets'), request('/locations')]).then(([all, locationData])=>setOptions({
      areas:(locationData.areas || [...new Set(all.map((item)=>item.asset.area))]).sort(),
      departments:[...new Set(all.map((item)=>item.department))].sort(),
      types:[...new Set(all.map((item)=>item.asset.hardware_type))].sort()
    })).catch(setError);
    load();
  },[]);
  const update=(key)=>(event)=>setFilters({...filters,[key]:event.target.value});
  const active=items?.filter((item)=>item.is_active).length ?? 0;
  const inactive=items?.filter((item)=>!item.is_active).length ?? 0;
  return <section><div className="title-row"><div><h2>Assignment <span className="accent">History</span></h2><p>View and search historical hardware assignments.</p></div><div><a className="button" href={reportUrl('/reports/download-history',filters)}>Download CSV</a> <a className="button danger" href={reportUrl('/reports/download-history-pdf',filters)}>PDF Report</a></div></div>
    <form className="filters" onSubmit={e=>{e.preventDefault();load();}}>
      <input placeholder="Search employee, department, asset ID..." value={filters.q} onChange={update('q')}/><select value={filters.area} onChange={update('area')}><option value="">All Locations</option>{options.areas.map((area)=><option key={area}>{area}</option>)}</select><select value={filters.department} onChange={update('department')}><option value="">All Departments</option>{options.departments.map((department)=><option key={department}>{department}</option>)}</select><select value={filters.type} onChange={update('type')}><option value="">All Types</option>{options.types.map((type)=><option key={type}>{type}</option>)}</select>
      <select value={filters.status} onChange={update('status')}><option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select><button>Search</button>
    </form><div className="cards"><div className="card"><span>Total Records</span><strong>{items?.length ?? 0}</strong></div><div className="card"><span>Total Active Assignments</span><strong>{active}</strong></div><div className="card"><span>Total Inactive Assignments</span><strong>{inactive}</strong></div></div><ErrorMessage error={error}/>{!items&&!error?<Loading/>:items?.length===0?<Empty/>:<table><thead><tr><th>Asset ID</th><th>Serial Number</th><th>Employee Info</th><th>Department</th><th>Assigned Date</th><th>Status</th><th>Hardware Details</th></tr></thead><tbody>{items?.map(a=><tr key={a.id}><td>{a.asset.asset_id}</td><td>{a.asset.serial_number}</td><td>{a.employee_name}<br/><small>{a.employee_code}</small></td><td>{a.department}</td><td>{a.assigned_date}</td><td>{a.is_active?'Active':'Inactive'}</td><td>{a.asset.asset_model}<br/><small>{a.asset.area} · {a.asset.hardware_type}</small></td></tr>)}</tbody></table>}</section>;
}
