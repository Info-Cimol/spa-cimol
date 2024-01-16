import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerTopo from "../../../components/ContainerTopo";
import MenuHamburguer from "../../../components/MenuHamburguer";
import './professor.css'

const HomePrincipal = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const userType = "professor";
  const userName = localStorage.getItem('userName');
 
  const searchProjects = async () => {
    try {
      if (searchQuery && /^\d{4}$/.test(searchQuery)) {
        // Se a pesquisa contém um ano válido (4 dígitos numéricos), pesquise por ano
        const response = await axios.get('https://api-thesis-track.vercel.app/buscar-projetos/ano/', {
          params: { ano: searchQuery },
        });
        setProjects(response.data.data);
      } else {
        // Caso contrário, pesquise por título
        const response = await axios.get('https://api-thesis-track.vercel.app/buscar-projetos/', {
          params: { titulo: searchQuery },
        });
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      // Adicione uma mensagem de erro para o usuário
      alert('Erro ao buscar projetos. Tente novamente.');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get('https://api-thesis-track.vercel.app/projeto/listar');
      setProjects(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const visualizar = (projectId) => {
    // Redirecionar para a página de visualização do projeto com o ID do projeto
    // Certifique-se de que você tenha configurado as rotas corretamente no seu aplicativo React Router
    // Exemplo: this.props.history.push(`/Visualizar/Projeto/${projectId}`);
  };

  useEffect(() => {
    loadProjects(); // Carregar os projetos ao entrar na página
  }, []);

  return (
    <div>
          <ContainerTopo />
          <MenuHamburguer userType={userType}/>
          
      <div className="imagemFundo col-sm-12">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h1 className="escreva fade-up">Olá {userName}, Orientar seus alunos ficou mais fácil</h1>
            </div>
            <div className="col-sm-6">
              <img src="/Images/imagem7.png" className="imagem-fluid" alt="Imagem do orientador" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa com Dropdown */}
      <div className="search-box mt-5">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Procurar título ou ano do projeto"
        />
        <button onClick={searchProjects}>Pesquisar</button>
      </div>

      <div className="cards row mt-5 mb-5">
        {projects.map((project, index) => (
          <div key={project.id_projeto} className="card col-sm-6 col-md-4 col-lg-4">
            <div className="card__img">
              <img
                src={project.logo_projeto || "/Images/Logo.png"}
                style={{ 'height': '150px', 'object-fit': 'cover', 'border-radius': '12px' }}
                alt="Logo do Projeto"
              />
            </div>
            <div className="card__body">
              <h2 className="card__head">{project.tema}</h2>
              <p className="card__desc">{project.titulo}</p>
            </div>
            <button className="card__btn" onClick={() => visualizar(project.id_projeto)}>
              Visualizar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePrincipal;