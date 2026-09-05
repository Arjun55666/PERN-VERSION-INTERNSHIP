import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Assets } from './pages/Assets.jsx';
import { Assignments } from './pages/Assignments.jsx';
import { Bulk } from './pages/Bulk.jsx';
import { GenerateQR } from './pages/GenerateQR.jsx';
import { AssignAsset } from './pages/AssignAsset.jsx';
import { AssetDetail } from './pages/AssetDetail.jsx';
import { VerifyAssignment } from './pages/VerifyAssignment.jsx';

const router=createBrowserRouter([{element:<Layout/>,children:[{path:'/',element:<Dashboard/>},{path:'/generate',element:<GenerateQR/>},{path:'/assign',element:<AssignAsset/>},{path:'/asset-history',element:<Assets/>},{path:'/assets',element:<Assets/>},{path:'/assets/:assetId',element:<AssetDetail/>},{path:'/assignment-history',element:<Assignments/>},{path:'/assignments',element:<Assignments/>},{path:'/verify',element:<VerifyAssignment/>},{path:'/bulk',element:<Bulk/>}]}]);
export default function App(){return <RouterProvider router={router}/>;}
