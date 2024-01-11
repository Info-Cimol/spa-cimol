import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectComponent = () => {
  const [projetosDoUsuario, setProjetosDoUsuario] = useState([]);
  const [semProjeto, setSemProjeto] = useState(false);
  const [pageTitle, setPageTitle] = useState('Meus Projetos');

  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const isPublic = (projeto) => (projeto.publico === 1 ? 'Projeto Público' : 'Projeto Privado');

  const editarProjeto = (projetoId) => {
    console.log('Projeto ID:', projetoId);
    // Navigate to the edit page using React Router (replace with your routing logic)
    // Example: history.push(/Editar/${projetoId});
  };

  const loadProjects = async () => {
    try {
     
      const headers = {
        'x-access-token': token
      };
  
      let response;
  
      if (userType === 'professor') {
        response = await axios.get('https://api-thesis-track.vercel.app/projeto/orientador/${userId}', { headers });
        console.log(response);
      } else if (userType === 'aluno') {
        response = await axios.get('https://api-thesis-track.vercel.app/aluno/projetos/${userId}', { headers });
        console.log(response);
      }
  
      setProjetosDoUsuario(response.data);
      checkIfEmptyProjects();
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally{

    }
  };

  const updatePageTitle = () => {
    if (window.innerWidth <= 484) {
      setPageTitle('Projetos');
    } else {
      setPageTitle('Meus Projetos');
    }
  };

  const checkIfEmptyProjects = () => {
    if (projetosDoUsuario.length === 0) {
      setSemProjeto(true);
      console.log('Você não possui nenhum trabalho aqui.');
    }
  };

  const adicionar = () => {
    // Navigate to the add page using React Router (replace with your routing logic)
    // Example: history.push('/Adicionar');
  };

  const getAutoresNome = (response) => {
    try {
      const autores = JSON.parse(response.alunos);
      console.log(autores);
      if (autores && autores.length > 0) {
        return autores.map((autor) => autor.nome).join(', ');
      }
    } catch (error) {
      console.error('Error parsing autores:', error);
      return '';
    }
  };

  const visualizar = (projetoId) => {
    // Redirect to the project view page with the project ID
    // Example: history.push(/Visualizar/${projetoId});
  };

  useEffect(() => {
    loadProjects();

    window.addEventListener('resize', updatePageTitle);

    return () => {
      window.removeEventListener('resize', updatePageTitle);
    };
  }, []); 

  return (
    <div>
      {semProjeto && (
        <div className="col-12 text-center mt-5 textAlter">
          <img src="Images/sem projeto.png" className="imagemilustrada" alt="imagem ilustrativa" />
          <p className="textAlter mb-5">Putz... Você não tem nenhum projeto cadastrado.</p>
        </div>
      )}
      <div className="cards row mt-5 mb-5">
        {projetosDoUsuario.map((projeto) => (
          <div key={projeto.id_projeto} className="card col-sm-6 col-md-4 col-lg-3">
            <div className="card__img">
              {projeto.logo_projeto ? (
                <img
                  src={projeto.logo_projeto}
                  style={{ height: '150px', objectFit: 'cover', borderRadius: '12px' }}
                  alt="Projeto Logo"
                />
              ) : (
                <img
                  src="Images/Logo.png"
                  style={{ height: '140px', objectFit: 'cover', borderRadius: '12px' }}
                  alt="Default Logo"
                />
              )}
            </div>
            <div className="card__body">
              <h2 className="card__head">{projeto.tema}</h2>
              <p className="card__desc">{projeto.titulo}</p>
              <h2 className="card__desc">{isPublic(projeto)}</h2>
            </div>
            <button className="card__btn" onClick={() => visualizar(projeto.id_projeto)}>
              Visualizar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectComponent;