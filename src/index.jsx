import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Private } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ScrollToTopButton from './components/ScrollTop'
import Login from './routes/Login/index';
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
        element: <Private allowedRoles={['admin', 'secretaria']}><Teste/></Private> ,
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