import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/visualiza.css'
const ProjetoDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [projeto, setProjeto] = useState(null);
  const [projetoDeletado, setProjetoDeletado] = useState(false);
  const [loadingDelecao, setLoadingDelecao] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchProjeto = async () => {
      const userId =  localStorage.getItem('id');
      try {
        const response = await axios.get(`https://api-thesis-track.vercel.app/projeto/listar/${params.id}/pessoa/${userId}`);
        
        if (response.status === 200) {
          setProjeto(response.data);
          setCurrentUserId( localStorage.getItem('id'));
        } else {
          console.error('Status de resposta inesperado:', response.status);
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    fetchProjeto();
  }, [params.id]);

  const getAutoresNome = (projeto) => {
    try {
      const autores = JSON.parse(projeto.autores);

      if (autores && Array.isArray(autores) && autores.length > 0) {
        const numeroDeAutores = autores.length;

        if (numeroDeAutores === 1) {
          return `Autor: ${autores[0].nome}`;
        } else if (numeroDeAutores === 2) {
          return `Autores: ${autores[0].nome} e ${autores[1].nome}`;
        } else if (numeroDeAutores > 2) {
          const nomes = autores.map((autor) => autor.nome);
          const autoresString = nomes.slice(0, -1).join(', ') + ` e ${nomes.slice(-1)}`;
          return `Autores: ${autoresString}`;
        }
      }
    } catch (error) {
      console.error('Error parsing autores:', error);
    }

    return '';
  };

  const getOrientadorNome = (projeto) => {
    try {
      const orientadores = JSON.parse(projeto.orientadores);
      if (orientadores && Array.isArray(orientadores) && orientadores.length > 0) {
        return orientadores.map((orientador) => orientador.nome).join(', ');
      }
    } catch (error) {
      console.error('Error parsing orientadores:', error);
      return '';
    }
  };

  const deletarProjeto = async () => {
    const token = localStorage.getItem('token');
    try {
      if (!projeto) {
        return;
      }

      const headers = {
        'x-access-token': token,
      };

      setLoadingDelecao(true);

      const projetoId = params.id;
      const response = await axios.delete('https://api-thesis-track.vercel.app/projeto/delete/' + projetoId, { headers });

      setTimeout(() => {
        setLoadingDelecao(false);
        if (response.status === 200) {
          setProjetoDeletado(true);
          setTimeout(() => {
            setProjetoDeletado(false);
            navigate("/projetos");
          }, 3000);
        }
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setLoadingDelecao(false);
    }
  };

  const editarProjeto = () => {
    const projetoId = params.id;
    navigate(`/Editar/${projetoId}`);
  };

  return (
    <div>
      {projeto ? (
        <div>
          <div className="v-container">
            <div className="v-row">
              <div className="v-col" cols="12">
                <h1 className="titulo text-center">
                  {projeto.titulo || ''}
                </h1>
              </div>
            </div>
            <div className="v-row">
              <div className="v-col" cols="12">
                <div className="loading-spinner" style={{ display: loadingDelecao ? 'block' : 'none' }}>
                  <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>
                </div>
              </div>
              <v-alert v-if={projetoDeletado} color="red" shaped type="info" class="mensagem-container float-end">
                Projeto deletado
              </v-alert>
            </div>
            <div className="v-row">
              <div className="v-col" cols="12" sm="4">
                <p className="estiloEscrita">
                  {getAutoresNome(projeto) || ''}
                </p>
              </div>
              <div className="v-col" cols="12" sm="4">
                <p className="estiloEscrita">
                  Orientador: {getOrientadorNome(projeto) || ''}
                </p>
              </div>
              <div className="v-col" cols='12' sm="4">
                <p className="estiloEscrita"> Publicado em {projeto.ano_publicacao || ''}</p>
              </div>
            </div>
            
            <div className="expansion align-items-center justify-content-center mx-auto" col="12">
              <v-expansion-panels inset class="my-3 expansion">
                <v-expansion-panel>
                  <v-expansion-panel-header class="expansion-header fadeIn">
                    <div class="title">O tema do projeto</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <p>
                        {projeto.tema || ''}
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels inset class="my-3 ">
                <v-expansion-panel>
                  <v-expansion-panel-header class="expansion-header fadeIn">
                    <div class="title">Problema</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <p>
                        {projeto.problema || ''}
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels inset class="my-3 ">
                <v-expansion-panel>
                  <v-expansion-panel-header class="expansion-header">
                    <div class="title">Objetivo geral</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <p>
                        {projeto.objetivo_geral || ''}
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels inset class="my-3">
                <v-expansion-panel>
                  <v-expansion-panel-header class="expansion-header">
                    <div class="title">Objetivos específicos</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <p>
                        {projeto.objetivo_especifico || ''}
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels inset class="my-3">
                <v-expansion-panel>
                  <v-expansion-panel-header class="expansion-header">
                    <div class="title">Resumo</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <p>
                        {projeto.resumo || ''}
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels inset class="my-3">
                <v-expansion-panel>
                  <v-expansion-panel-header class="expansion-header">
                    <div class="title">Abstract</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>
                      <p>
                        {projeto.abstract || ''}
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div>
              <a
                href={projeto.url_projeto && projeto.url_projeto !== '' ? projeto.url_projeto : undefined}
                target="_blank"
                className="estiloEscritaGrande mt-5 mb-5"
                style={{ color: '#1B2F4A', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}>
                  {/* ... SVG path ... */}
                </svg>
                Visite o Projeto
              </a>
              <a
                href={projeto.arquivo && projeto.arquivo !== '' ? projeto.arquivo : undefined}
                target="_blank"
                className="estiloEscritaGrande mt-5 mb-5"
                style={{ color: '#1B2F4A', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}>
                  {/* ... SVG path ... */}
                </svg>
                Projeto finalizado
              </a>
            </div>
            <div className="v-col" cols="12" sm="4">
              <div className="botoes-container d-flex justify-end">
                <button className="botao-editar" onClick={editarProjeto} /*disabled={!canEditOrDelete}*/>
                  Editar
                </button>
                <button onClick={deletarProjeto} className="ml-2" /*disabled={!canEditOrDelete}*/>
                  Deletar Projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          Projeto não encontrado.
        </div>
      )}
    </div>
  );  
};

export default ProjetoDetails;