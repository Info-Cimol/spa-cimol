import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './routes/Login';
import AlunoLogado from './routes/AlunoLogado';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Secretaria from './routes/Secretaria';
import Funcionario from './routes/Funcionario';
import ErrorPage from './routes/ErrorPage';
import { Private, UsuarioLogado } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <UsuarioLogado><Login/></UsuarioLogado>
      },
      {
        path: "/AlunoLogado",
        element: <Private allowedRoles={["aluno"]}><AlunoLogado/></Private>
      },
      {
        path: "/Secretaria",  
        element: <Private allowedRoles={["professor"]}><Secretaria/></Private>
      },
      {
        path: "/Funcionario",
        element:<Private allowedRoles={["funcionario"]}><Funcionario/></Private> 
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer autoClose={3000}/>
    <RouterProvider router={router}/>
  </React.StrictMode>
);


