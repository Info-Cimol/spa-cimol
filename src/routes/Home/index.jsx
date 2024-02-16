import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import Aluno from '../../components/Aluno/';
import Cardapio from '../../components/Cardapio/index';
import ReservaSemana from '../../components/Cardapio/reservaSemana';
import { Container } from './styled';

function Home() {
  const navigate = useNavigate();
  const [exibirAluno, setExibirAluno] = useState(false);
  const [exibirCardapio, setExibirCardapio] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [exibirCardapioMerenda, setExibirCardapioMerenda] = useState(false); 

  const abrirCardapio = () => {
    setExibirCardapio(true);
    setExibirAluno(false); 
  };

  const abrirAluno = () => {
    setExibirCardapio(false);
    setExibirAluno(true); 
  };

  const abrirCardapioMerenda = () => {
    setExibirCardapioMerenda(true);
    setExibirCardapio(false); 
    setExibirAluno(false); 
  };

  const redirecionarParaProjeto = () => {
    navigate('/Projeto');
  };

  return (
    <Container>
      <ContainerTopo userType={userRole} />
      <MenuHamburguer userType={userRole} />
      {exibirAluno && (
        <Aluno />
      )}

      {exibirCardapio && (
        <Cardapio />
      )}

{exibirCardapioMerenda && ( 
        <ReservaSemana />
      )}
      
      {!exibirAluno && !exibirCardapio && !exibirCardapioMerenda && (
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
                        <button className="card__btn" onClick={redirecionarParaProjeto}>Abrir</button>
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
                        <button className="card__btn" onClick={redirecionarParaProjeto}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Provas</h5>
                        <p className="card__desc">Indisponível.</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Ármários</h5>
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
                        <p className="card__desc">Clique para ver os professores.</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Catálogo de Projetos</h5>
                        <p className="card__desc">Explore o catálogo de projetos disponíveis.</p>
                        <button className="card__btn" onClick={redirecionarParaProjeto}>Abrir</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Provas</h5>
                        <p className="card__desc">Indisponível</p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card__body">
                        <h5 className="card__head">Armários</h5>
                        <p className="card__desc">Indisponível</p>
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
                      <h5 className="card__head">Reservas</h5>
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