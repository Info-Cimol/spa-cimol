import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import Login from './routes/Login';
import Aluno from './routes/Aluno';
import Secretaria from './routes/Secretaria';
import Funcionario from './routes/Funcionario';
import Professor from './routes/Professor'

import ProfessorProjeto from './routes/Professor/catalogoProjeto/projeto';
import AlunoProjeto from './routes/Aluno/catalogoProjeto/projeto';

import VisualizaProjetoProfessor from './routes/Professor/catalogoProjeto/projetoVisualiza';
import VisualizaProjetoAluno from './routes/Aluno/catalogoProjeto/projetoVisualiza';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.css';

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/Aluno',
        element: <Private allowedRoles={['aluno']}><Aluno /></Private>,
      },
      {
        path: '/Professor',
        element: <Private allowedRoles={['professor']}><Professor /></Private>,
      },
      {
        path: '/Secretaria',
        element: <Private allowedRoles={['professor']}><Secretaria /></Private>,
      },
      {
        path: '/Funcionario',
        element: /*<Private allowedRoles={['funcionario']}>*/<Funcionario />/*</Private>*/,
      },
      {
        path: '/Professor/Projeto',
        element: <Private allowedRoles={['professor']}><ProfessorProjeto/></Private>,
      },
      {
        path: '/Aluno/Projeto',
        element: <Private allowedRoles={['aluno']}><AlunoProjeto /></Private>,
      },
      {
        path: '/Visualiza/Projeto/Aluno',
        element: <Private allowedRoles={['aluno']}><VisualizaProjetoAluno /></Private>,
      },
      {
        path: '/Visualiza/Projeto/Professor',
        element: <Private allowedRoles={['professor']}><VisualizaProjetoProfessor /></Private>,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer autoClose={3000} />
    <RouterProvider router={router} />
  </React.StrictMode>
);