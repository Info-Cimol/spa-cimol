import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './routes/Login';
import AlunoLogado from './routes/AlunoLogado';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Secretaria from './routes/Secretaria';
import Funcionario from './routes/Funcionario';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login/>
      },
      {
        path: "/AlunoLogado",
        element: <AlunoLogado/>
      },
      {
        path: "/Secretaria",
        element: <Secretaria/>
      },
      {
        path: "/Funcionario",
        element: <Funcionario/>
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);


