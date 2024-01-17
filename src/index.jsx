import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';

import App from './App';
import Login from './routes/Login';
import Aluno from './routes/Aluno';
import Secretaria from './routes/Secretaria';
import Funcionario from './routes/Funcionario';
import Professor from './routes/Professor'
import Admin from './routes/Admin'
import ProfessorProjeto from './routes/Professor/catalogoProjeto/projeto';
import VisualizaProjetoAluno from './routes/Aluno/catalogoProjeto/areaAluno';

import AlunoProjeto from './routes/Aluno/catalogoProjeto/projeto';
import VisualizaProjetoProfessor from './routes/Professor/catalogoProjeto/areaProfessor';
import AdicionaProjeto from './routes/Aluno/catalogoProjeto/adicionaProjeto';
import DetalhesProjeto from './routes/Aluno/catalogoProjeto/visualizaProjeto'
import 'react-toastify/dist/ReactToastify.css';
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
        path: '/Coodernador/Admin',
        element: <Private allowedRoles={['admin']}><Admin /></Private>,
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
        element: <Private allowedRoles={['secretaria']}><Secretaria /></Private>,
      },
     
      {
        path: '/Merendeira',
        element: <Private allowedRoles={['merendeira']}><Funcionario /></Private>,
      },

      //-------------Ferramenta de catálogo de projeto------------------------

      {
        path: '/Professor/Projeto',
        element: <Private allowedRoles={['professor','admin']}><ProfessorProjeto/></Private>,
      },
     
      {
        path: '/Visualiza/Projeto/Professor',
        element: <Private allowedRoles={['professor', 'admin']}><VisualizaProjetoProfessor /></Private>,
      },
      
      {
        path: '/Aluno/Projeto',
        element: <Private allowedRoles={['aluno','admin']}><AlunoProjeto /></Private>,
      },

      {
        path: '/Visualiza/Projeto/Aluno',
        element: <Private allowedRoles={['aluno','admin']}><VisualizaProjetoAluno /></Private>,
      },

      {
        path: '/Adiciona/Projeto',
        element: <Private allowedRoles={['aluno', 'professor','admin']}><AdicionaProjeto/></Private>,
      },

      {
        path: '/Projeto/Detalhes/:id',
        element: <Private allowedRoles={['aluno', 'professor','admin']}><DetalhesProjeto/></Private>,
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