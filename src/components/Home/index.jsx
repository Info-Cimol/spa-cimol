import React, { useState } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import Aluno from '../Aluno';
import Cardapio from '../Cardapio/index';
import ProjetoHomePessa from '../../routes/CatalogoProjetos/homeProjeto';
import ReservaSemana from '../Cardapio/reservaSemana';
import { Container } from './styled';

function Home() {
  const [exibirHome, setExibirHome] = useState(true);
  const [exibirAluno, setExibirAluno] = useState(false);
  const [exibirCardapio, setExibirCardapio] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [exibirCardapioMerenda, setExibirCardapioMerenda] = useState(false); 
  const [exibirHomeProjeto, setExibirHomeProjeto] = useState(false); 
  
  const abrirCardapio = () => {
    setExibirCardapio(true);
    setExibirAluno(false); 
    setExibirHomeProjeto(false);
    setExibirHome(false);
  };

  const abrirAluno = () => {
     setExibirAluno(true); 
     setExibirCardapio(false);
     setExibirHomeProjeto(false);
     setExibirHome(false);
  };

  const abrirCardapioMerenda = () => {
    setExibirCardapioMerenda(true);
    setExibirCardapio(false); 
    setExibirAluno(false); 
    setExibirHomeProjeto(false);
    setExibirHome(false);
  };

  /*const abrirComponenteProjeto = () => {
    setExibirHomeProjeto(true);
  };*/

  return (
    <Container>
      <ContainerTopo userType={userRole} />
      <MenuHamburguer userType={userRole} exibirHome={exibirHome} />
      {exibirAluno && (
        <Aluno />
      )}

      {exibirCardapio && (
        <Cardapio />
      )}

    {exibirHomeProjeto && (
        <ProjetoHomePessa />
      )}

      {exibirCardapioMerenda && ( 
        <ReservaSemana />
      )}
      
      {!exibirAluno && !exibirCardapio && !exibirCardapioMerenda &&  !exibirHomeProjeto && exibirHome && (
        <div className='container-fluid'>
          <div className='row'>
            <div className='buttons'>
              
              {userRole === 'aluno' && (
                <div className="col-sm-12">
                  <h1 className="titulo-home fade-up">
                    Olá estudante, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
                  </h1>
                  <div className="col-sm-12 d-flex flex-wrap justify-content-around">
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Merenda</h5>
                        <p className="card__desc">Clique para ver o cardápio de merenda.</p>
                        <button className="card__btn" onClick={abrirCardapio}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Catálogo de Projetos</h5>
                        <p className="card__desc">Explore o catálogo de projetos disponíveis.</p>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userRole === 'professor' && (
                <div className="col-sm-12">
                  <h1 className="titulo-home fade-up">
                    Olá professor, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
                  </h1>
                  <div className="col-sm-12 d-flex flex-wrap justify-content-around">
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Catálogo de Projetos</h5>
                        <p className="card__desc">Explore o catálogo de projetos disponíveis.</p>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Provas</h5>
                        <p className="card__desc">Explore o sistema de provas quando assim estiver disponíveis.</p>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userRole === 'admin' && (
                <div className="row">
                  <div className="col-sm-12">
                    <h1 className="titulo-home fade-up">
                      Olá Administrador, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
                    </h1>
                  </div>
                  <div className="col-sm-12 d-flex flex-wrap justify-content-around">
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Merenda</h5>
                        <p className="card__desc">Clique para ver a quantidade de reservas.</p>
                        <button className='card__btn' onClick={abrirCardapioMerenda}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Alunos</h5>
                        <p className="card__desc">Clique para ver os alunos cadastrados.</p>
                        <button className='card__btn' onClick={abrirAluno}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Professor</h5>
                        <p className="card__desc">Clique para ver os professores cadastrados.</p>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Catálogo de Projetos</h5>
                        <p className="card__desc">Explore o catálogo de projetos disponíveis.</p>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Provas</h5>
                        <p className="card__desc">Explore o sistema de provas quando assim estiver disponíveis.</p>
                        <p className="card__desc">Indisponível</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Ármários</h5>
                        <p className="card__desc">Explore o sistema de armários quando assim estiver disponíveis.</p>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                {userRole === 'merendeira' && (
                <div className="col-sm-12">
                  <h1 className="titulo-home fade-up">
                    Olá merendeira, seja muito bem-vindo. Aqui você tem acesso aos cardápios semanais.
                  </h1>
                  <div className="card">
                    <div className="card__body">
                      <h5 className="card__head">Merenda</h5>
                      <p className="card__desc">Clique para ver o cardápio.</p>
                      <button className="card__btn" onClick={abrirCardapioMerenda}>Abrir</button>
                    </div>
                  </div>
                </div>
              )} 

              {userRole === 'secretaria' && (
                <div className="col-sm-12">
                  <h1 className="titulo-home fade-up">
                    Olá supervisor, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
                  </h1>
                  <div className="col-sm-12 d-flex flex-wrap justify-content-around">
                  <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Merenda</h5>
                        <p className="card__desc">Clique para ver a quantidade de reservas.</p>
                        <button className='card__btn' onClick={abrirCardapioMerenda}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Alunos</h5>
                        <p className="card__desc">Clique para ver os alunos cadastrados.</p>
                        <button className='card__btn' onClick={abrirAluno}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Professor</h5>
                        <p className="card__desc">Clique para ver os professores.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Home;