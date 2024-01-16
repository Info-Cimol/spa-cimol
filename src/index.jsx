import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';

import App from './App';
import Login from './routes/Login';
import Aluno from './routes/Aluno';
import Secretaria from './routes/Secretaria';
import Funcionario from './routes/Funcionario';
import Professor from './routes/Professor'

import ProfessorProjeto from './routes/Professor/catalogoProjeto/projeto';
import VisualizaProjetoAluno from './routes/Aluno/catalogoProjeto/projetoVisualiza';

import AlunoProjeto from './routes/Aluno/catalogoProjeto/projeto';
import VisualizaProjetoProfessor from './routes/Professor/catalogoProjeto/projetoVisualiza';
//import AdicionaProjeto from './routes/Aluno/catalogoProjeto/adicionaProjeto';
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
        element: <Private allowedRoles={['professor']}><ProfessorProjeto/></Private>,
      },
     
      {
        path: '/Visualiza/Projeto/Professor',
        element: <Private allowedRoles={['professor']}><VisualizaProjetoProfessor /></Private>,
      },
      
      {
        path: '/Aluno/Projeto',
        element: <Private allowedRoles={['aluno']}><AlunoProjeto /></Private>,
      },

      {
        path: '/Visualiza/Projeto/Aluno',
        element: <Private allowedRoles={['aluno']}><VisualizaProjetoAluno /></Private>,
      },

     /* {
        path: '/Adiciona/Projeto/Aluno',
        element: <Private allowedRoles={['aluno']}><AdicionaProjeto/></Private>,
      },*/
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