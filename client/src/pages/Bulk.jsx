import React from 'react';
import { useState } from 'react';
import { request } from '../api/client.js';
import { ErrorMessage } from '../components/State.jsx';

export function Bulk() {
  const [file,setFile]=useState(); const [result,setResult]=useState(); const [error,setError]=useState();
  const submit=async(e)=>{e.preventDefault();setError();const body=new FormData();body.append('file',file);try{setResult(await request('/bulk/assets',{method:'POST',body}));}catch(err){setError(err);}};
  return <section><h2>Bulk Operations</h2><p>Upload a sanitized asset spreadsheet with headers: assetId, assetModel, datePurchased, serialNumber, area, hardwareType.</p><form onSubmit={submit}><input type="file" accept=".xlsx,.xls" onChange={e=>setFile(e.target.files[0])}/><button disabled={!file}>Import assets</button></form><ErrorMessage error={error}/>{result&&<p className="success">Created {result.created} assets.</p>}</section>;
}
