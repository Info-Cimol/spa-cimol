import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './components/Header/index';
import Footer from './components/Footer/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import './index.css';
import Login from './routes/Login';
import Aluno from './routes/Aluno';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import Secretaria from './routes/Secretaria';
import Funcionario from './routes/Funcionario';
import Professor from './routes/Professor';
import { Private, UsuarioLogado } from './auth/checkAuthentication';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsuarioLogadoComHeader = () => {
  const location = useLocation();

  const shouldRenderHeaderAndFooter = () => {
    // Especifique as rotas em que o Header e o Footer devem ser renderizados
    const allowedRoutes = ['/Professor'];
    return allowedRoutes.includes(location.pathname);
  };

  return (
    <UsuarioLogado>
      <div>
        {shouldRenderHeaderAndFooter() && <Header />}
        <App />
        {shouldRenderHeaderAndFooter() && <Footer />}
      </div>
    </UsuarioLogado>
  );
};

const router = createBrowserRouter([
  {
    element: <UsuarioLogadoComHeader />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/Aluno',
        element: <Private allowedRoles={['aluno']}><Aluno /></Private>,
      },
      {
        path: '/Secretaria',
        element: <Private allowedRoles={['professor']}><Secretaria /></Private>,
      },
      {
        path: '/Funcionario',
        element: <Private allowedRoles={['funcionario']}><Funcionario /></Private>,
      },
      {
        path: '/Professor',
        element: <Private allowedRoles={['professor']}><Professor /></Private>,
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