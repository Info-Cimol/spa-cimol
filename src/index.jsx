import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ScrollToTopButton from './components/ScrollTop'
import Login from './routes/Login/index';
import ProjetoHomeDetalhes from './routes/CatalogoProjetos/homeDetalhesProjeto';
import AreaPessoaProjeto from './routes/CatalogoProjetos/areaPessoaProjeto';
import VisualizaProjetoPessoa from './routes/CatalogoProjetos/visualizaProjeto';
import AdicionaProjeto from './routes/CatalogoProjetos/adicionaProjeto';
import EditaProjeto from './routes/CatalogoProjetos/editaProjeto';
import Teste from './components/FileUploader/pdfUploaderProfessor';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [

      {
        path: '/',
        element: <Private allowedRoles={['aluno', 'professor', 'admin', 'merendeira', 'secretaria']}><Login /></Private>,
      },

      {
        path: '/Teste',
        element: <Private allowedRoles={['aluno', 'admin', 'secretaria']}><Teste/></Private> ,
      },

      //Rota apartir da home, que possibilita ver os projetos das pessoas pelo id do projetos
      {
        path: '/Projeto/:id',
        element: <Private allowedRoles={['aluno', 'professor', 'admin']}><ProjetoHomeDetalhes/></Private>,
      },

       //Rota responsável pela área de administração dos projeos por parte de cada perfil de usuário
       {
        path: '/Area/Projeto',
        element: <Private allowedRoles={['aluno', 'professor', 'admin']}><AreaPessoaProjeto/></Private>
      },

        //Rota responsável pela listagem dos projetos de cada indivíduo, que esteja relacionado ao projeto
        {
          path: '/Visualiza/Projeto/:id',
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