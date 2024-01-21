import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import axiosFecht from '../../axios/config';
import './css/visualiza.css';

const HomeProjeto = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loadingDelecao, setLoadingDelecao] = useState(false);
  const [projetoDeletado, setProjetoDeletado] = useState(false);
  const userRole = localStorage.getItem('userRole');
  const { id } = useParams();
  const [projeto, setProjeto] = useState(null);
  const token = localStorage.getItem('token');
  const fetchProjeto = async (projetoId) => {
    try {
      const headers = {
        'x-access-token': token,
    };
      const response = await axiosFecht.get('/projeto/listar/' + projetoId, { headers } );
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na solicitação:', error);
      return null;
    }
  };

  const handleResponse = (response) => {
    console.log('Response da API:', response);
    if (response.status === 200) {
      setProjeto(response.data); 
      return response.data;
    } else {
      console.error('Status de resposta inesperado:', response.status);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProjeto(id);
        console.log('Response do fetchProjeto:', response);
        // Restante do código...
      } catch (error) {
        console.error('Erro no fetchProjeto:', error);
      }
    };

    fetchData();
  }, );

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
      if (!id) {
        return;
      }

      const headers = {
        'x-access-token': `${token}`
      };

      setLoadingDelecao(true);

      const response = await axiosFecht.delete(`/projeto/delete/${id}`,headers, { 
      });

      console.log(response);

      // Desativar o estado de carregamento após um curto atraso
      setTimeout(() => {
        setLoadingDelecao(false);
        if (response.status === 200) {
          setProjetoDeletado(true);
          setTimeout(() => {
            setProjetoDeletado(false);
            navigate("/Area/Pessoa-Projeto");
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
    navigate(`/Edita/Projeto/${projetoId}`);
  };

  return (
    <div>
       <ContainerTopo  userType={userRole}/>
      <MenuHamburguer userType={userRole}/>
      {projeto ? (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <h1 className="titulo text-center">
                {projeto.titulo || ''}
              </h1>
            </div>
          </div>
          <div className="row">
          <div className="col-12 col-sm-4 col-xs-12">
              <p className="estiloEscrita">
                {getAutoresNome(projeto) || ''}
              </p>
            </div>
            <div className="col-12 col-sm-4 col-xs-12">
              <p className="estiloEscrita">
                Orientador: {getOrientadorNome(projeto) || ''}
              </p>
            </div>
            <div className="col-12 col-sm-4 col-xs-12">
              <p className="estiloEscrita"> Publicado em {projeto.ano_publicacao || ''}</p>
            </div>
          </div>
        
        <div className='container-fluid'>
          <div className="expansion align-items-center justify-content-center mx-auto" col="12">

      {/*Tema do projeto*/}
      <Accordion className="acordian-information">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Tema do Projeto
        </AccordionSummary>
        <AccordionDetails className="acordian-information-details">
        {projeto.tema || ''}
        </AccordionDetails>
      </Accordion>

        {/*Problema do projeto*/}
        <Accordion className="acordian-information">
        <AccordionSummary
                 expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Problema do Projeto
        </AccordionSummary>
        <AccordionDetails>
        {projeto.problema || ''}
        </AccordionDetails>
      </Accordion>

      {/*Resumo do projeto*/}
      <Accordion className="acordian-information">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Resumo do Projeto
        </AccordionSummary>
        <AccordionDetails className="acordian-information-detailes">
        {projeto.resumo || ''}
        </AccordionDetails>
      </Accordion>

         {/*Abstract do projeto*/}
         <Accordion className="acordian-information">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Abstract do Projeto
        </AccordionSummary>
        <AccordionDetails>
        {projeto.abstract || ''}
        </AccordionDetails>
      </Accordion>

           {/*Objetivo Geral do projeto*/}
           <Accordion className="acordian-information">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Objetivo Geral do Projeto
        </AccordionSummary>
        <AccordionDetails>
        {projeto.objetivo_geral || ''}
        </AccordionDetails>
      </Accordion>

        {/*Objetivos Específicos do projeto*/}
        <Accordion className="acordian-information">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Objetivos Específicos do Projeto
        </AccordionSummary>
        <AccordionDetails>
        {projeto.objetivo_especifico || ''}
        </AccordionDetails>
      </Accordion>
    </div>
          </div>
        </div>
        <div>
  {projeto.url_projeto && (
    <a
      href={projeto.url_projeto}
      style={{ color: '#1B2F4A', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
      >
        <path
          d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM111 257.1l26.8 89.2 31.6-90.3c3.4-9.6 12.5-16.1 22.7-16.1s19.3 6.4 22.7 16.1l31.6 90.3L273 257.1c3.8-12.7 17.2-19.9 29.9-16.1s19.9 17.2 16.1 29.9l-48 160c-3 10-12 16.9-22.4 17.1s-19.8-6.2-23.2-16.1L192 336.6l-33.3 95.3c-3.4 9.8-12.8 16.3-23.2 16.1s-19.5-7.1-22.4-17.1l-48-160c-3.8-12.7 3.4-26.1 16.1-29.9s26.1 3.4 29.9 16.1z"
          fill="#4285F4"
        />
      </svg>
      Visite o Projeto
    </a>
  )}

  {projeto.arquivo && (
    <a
      href={projeto.arquivo}
      style={{ color: '#1B2F4A', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
      >
        <path
          d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"
          fill="#FF0000"
        />
      </svg>
      Projeto finalizado
    </a>
  )}
</div>
<div className='container-fluid'>
  <div className="row">
    <div className="col-lg-12 col-xs-12 d-flex justify-end">
      {/* Botão Editar */}
      {userRole === "admin" && (
        <button className="btn btn-primary botao-editar" onClick={editarProjeto}>
          Editar
        </button>
      )}

      {/* Botão Deletar Projeto */}
      {userRole === "admin" && (
        <button  className="btn btn-danger ml-2" onClick={deletarProjeto}>
          Deletar Projeto
        </button>
      )}
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

export default HomeProjeto;