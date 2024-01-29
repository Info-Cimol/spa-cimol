import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ScrollToTopButton from './components/ScrollTop'
import Home from './routes/Home';
import Login from './routes/Login';
import ProjetoHomePessa from './routes/CatalogoProjetos/homeProjeto';
import ProjetoHomeDetalhes from './routes/CatalogoProjetos/homeDetalhesProjeto';
import AreaPessoaProjeto from './routes/CatalogoProjetos/areaPessoaProjeto';
import VisualizaProjetoPessoa from './routes/CatalogoProjetos/visualizaProjeto';
import AdicionaProjeto from './routes/CatalogoProjetos/adicionaProjeto';
import EditaProjeto from './routes/CatalogoProjetos/editaProjeto';
import Teste from './components/FileUploader/pdfUploader';
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
        path: '/Home',
        element: <Private allowedRoles={['aluno', 'professor', 'admin', 'merendeira', 'secretaria']}><Home /></Private>,
      },

      //Rota para testar a inserção dos dados por meio do anexo do pdf
      {
        path: '/Teste',
        element: <Teste />,
      },

      //-------------Ferramenta de catálogo de projeto------------------------
     
      //Rota da home dos projetos, responsável por listar os projetos públicos e ainda possibilita a pesquisa dos mesmos, por título e ano
      {
        path: '/Projeto',
        element: <Private allowedRoles={['aluno', 'professor', 'admin']}><ProjetoHomePessa /></Private>,
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