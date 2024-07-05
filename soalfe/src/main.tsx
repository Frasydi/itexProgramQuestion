import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './page/index.tsx';

import { ChakraProvider } from '@chakra-ui/react'
import Layout from './page/_layout.tsx';
import Login from './page/login.tsx';
import Admin from './page/admin.tsx';
import AdminUser from './page/admin/user.tsx';
import AdminSoal from './page/admin/soal.tsx';
import CreateSoal from './page/admin/createSoal.tsx';
import EditSoal from './page/admin/editSoal.tsx';
import UserHome from './page/index.tsx';
import User from './page/user.tsx';
import JawabSoal from './page/user/jawab.tsx';
import LihatJawaban from './page/admin/lihatjawaban.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout /> ,
    children : [
      {
        path : "/",
        element : <User />,
        children : [
          {
            element : <UserHome />,
            path :"/"
          },
          {
            element : <JawabSoal />,
            path :"/jawab/:id"
          },
        ]
      },
      {
        path  : "/login",
        element : <Login />
      },
      {
        path : "/admin",
        element : <Admin />,
        children : [
          {
            element : <AdminUser />,
            path :"/admin/user"
          },
          {
            element : <AdminSoal />,
            path :"/admin/soal" 
          },
          {
            element : <CreateSoal />,
            path : "/admin/soal/create"
          },
          {
            element : <EditSoal />,
            path : "/admin/soal/:id"
          },
          {
            element : <LihatJawaban />,
            path : "/admin/jawaban/:id"
          },
        ]
      }
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
)
