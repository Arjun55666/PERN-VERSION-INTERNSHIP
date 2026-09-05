import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return <>
    <header><h1>Asset Management System</h1><nav>
      <NavLink to="/">Dashboard</NavLink><details className="manage-menu"><summary>⚙ Manage</summary><div className="manage-list"><NavLink to="/generate">Generate QR</NavLink><NavLink to="/assign">Assign Asset</NavLink><NavLink to="/asset-history">Asset History</NavLink><NavLink to="/assignment-history">Assignment History</NavLink><NavLink to="/verify">Physical Verification</NavLink><NavLink to="/bulk">Bulk Operations</NavLink></div></details>
    </nav></header>
    <main><Outlet /></main>
  </>;
}
