import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ScrollToTopButton from './components/ScrollTop'
import Login from './routes/Login';
import Aluno from './routes/Aluno';
import Secretaria from './routes/Secretaria';
import Merendeira from './routes/Merendeira';
import Professor from './routes/Professor';
import Admin from './routes/Admin';

import ProjetoHomePessa from './routes/CatalogoProjetos/homeProjeto';
import ProjetoHomeDetalhes from './routes/CatalogoProjetos/homeDetalhesProjeto';
import AreaPessoaProjeto from './routes/CatalogoProjetos/areaPessoaProjeto';
import VisualizaProjetoPessoa from './routes/CatalogoProjetos/visualizaProjeto';
import AdicionaProjeto from './routes/CatalogoProjetos/adicionaProjeto';
import EditaProjeto from './routes/CatalogoProjetos/editaProjeto';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Login />,
      },
   
      {
        path: '/Coodernador/Admin',
        element: <Private allowedRoles={['admin']}><Admin /></Private>,
      },
      
      {
        path: '/Aluno',
        element: <Private allowedRoles={['aluno', 'admin']}><Aluno /></Private>,
      },
     
      {
        path: '/Professor',
        element: <Private allowedRoles={['professor', 'admin']}><Professor /></Private>,
      },
    
      {
        path: '/Secretaria',
        element: <Private allowedRoles={['secretaria', 'admin']}><Secretaria /></Private>,
      },
     
      {
        path: '/Merendeira',
        element: <Private allowedRoles={['merendeira', 'admin']}><Merendeira /></Private>,
      },

      //-------------Ferramenta de catálogo de projeto------------------------
     
      //Rota da home dos projetos, responsável por listar os projetos públicos e ainda possibilita a pesquisa dos mesmos, por título e ano
      {
        path: '/Home/Pessoa-Projeto',
        element: <Private allowedRoles={['aluno', 'professor', 'admin']}><ProjetoHomePessa /></Private>,
      },

      //Rota apartir da home, que possibilita ver os projetos das pessoas pelo id do projetos
      {
        path: '/Home/Pessoa-Projeto/Detalhes/:id',
        element: <Private allowedRoles={['aluno', 'professor', 'admin']}><ProjetoHomeDetalhes/></Private>,
      },

       //Rota responsável pela área de administração dos projeos por parte de cada perfil de usuário
       {
        path: '/Area/Pessoa-Projeto',
        element: <Private allowedRoles={['aluno', 'professor', 'admin']}><AreaPessoaProjeto/></Private>
      },

        //Rota responsável pela listagem dos projetos de cada indivíduo, que esteja relacionado ao projeto
        {
          path: '/Visualiza/Projeto-Pessoa/:id',
          element: <Private allowedRoles={['aluno', 'professor', 'admin']}><VisualizaProjetoPessoa/></Private>
        },

        //Rota responsável pela criação de projeto 
        {
          path: '/Adiciona/Projeto',
          element: <Private allowedRoles={['aluno', 'professor', 'admin']}><AdicionaProjeto/></Private>
        },

         //Rota responsável pela edição de projetos pelo id 
         {
          path: '/Edita/Projeto/:id',
          element: <Private allowedRoles={['aluno', 'professor', 'admin']}><EditaProjeto/></Private>
        },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer autoClose={3000} />
    <RouterProvider router={router} />
    <ScrollToTopButton />
  </React.StrictMode>
);