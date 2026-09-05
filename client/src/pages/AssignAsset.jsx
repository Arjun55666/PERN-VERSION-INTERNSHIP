import React from 'react';
import { useState } from 'react';
import { request } from '../api/client.js';
import { ErrorMessage } from '../components/State.jsx';

export function AssignAsset() {
  const [form,setForm]=useState({asset_id:'',asset_model:'',department:'',employee_name:'',employee_code:'',assigned_date:''}); const [result,setResult]=useState(); const [error,setError]=useState();
  const update=(key)=>(e)=>setForm({...form,[key]:e.target.value});
  const submit=async(e)=>{e.preventDefault();setError();setResult();try{setResult(await request('/assignments',{method:'POST',body:JSON.stringify({assetId:form.asset_id,assetModel:form.asset_model,department:form.department,employeeName:form.employee_name,employeeCode:form.employee_code,assignedDate:form.assigned_date})}));}catch(err){setError(err);}};
  return <section><h2>Assign Asset</h2><p>Assign a hardware asset to an employee or department.</p><form className="form-grid" onSubmit={submit}>{[['asset_id','Asset ID'],['asset_model','Asset Model'],['department','Department'],['employee_name','Employee Name'],['employee_code','Employee Code'],['assigned_date','Assigned Date (DD-MM-YYYY)']].map(([key,label])=><input key={key} required placeholder={label} value={form[key]} onChange={update(key)}/>)}<button>Assign Asset</button></form><ErrorMessage error={error}/>{result&&<p className="success">Assignment created successfully.</p>}</section>;
}
