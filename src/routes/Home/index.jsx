import React, { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import Aluno from '../../components/Aluno/'
import {Container} from './styled';

function Home(){
  const navigate = useNavigate();
  const [exibirAluno, setExibirAluno] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));

  const abriComponenteAluno = () => {
    setExibirAluno(true);
  };

  const redirecionarParaProjeto = () => {
    navigate('/Projeto');
};

  return(
     <Container>
    {!exibirAluno && (
      <>
        <ContainerTopo userType={userRole} />
        <MenuHamburguer userType={userRole} />
      </>
    )}
   {exibirAluno && (userRole === 'admin' || userRole === 'secretaria') ? (
      <Aluno />
    ) : (
   <div className='container-fluid'>
   <div className='row'>
     <div className='buttons'>

      {userRole === 'aluno' && (
        <div className="col-sm-12">
          <div className="col-sm-12">
            <h1 className="titulo-home fade-up">
              Olá estudante, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
            </h1>
          </div>

          <div className="col-sm-12 d-flex flex-wrap justify-content-around">
            <div className="card">
              <div className="card__body">
                <h5 className="card__head">Merenda</h5>
                <p className="card__desc">Clique para ver o cardápio de merenda.</p>
                <button className="card__btn">Abrir</button>
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
          <div className="col-sm-12">
          <h1 className="titulo-home fade-up">
              Olá professor, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
            </h1>
          </div>

          <div className="col-sm-12 d-flex flex-wrap justify-content-around">
            <div className="card">
              <div className="card-body">
                <h5 className="card__head">Catálogo de Projetos</h5>
                <p className="card__desc">Explore o catálogo de projetos disponíveis.</p>
                <button className="card__btn" onClick={redirecionarParaProjeto}>Abrir</button>
              </div>
            </div>

            <div className="card">
              <div className="card__body">
                <h5 className="card__head">Provas</h5>
                <p className="card__desc">Acesse a seção de provas disponíveis.</p>
                {/* Adicione a lógica ou remova o botão descomentando a linha abaixo */}
                {/* <button className="btn btn-primary" onClick={redirecionarParaProvas}>Abrir</button> */}
              </div>
            </div>
          </div>
        </div>
      )}
 
       {userRole === 'admin' && (
              <div className="col-sm-12">
              <div className="col-sm-12">
              <h1 className="titulo-home fade-up">
                  Olá Administrador, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
                </h1>
              </div>

              <div className="col-sm-12 d-flex flex-wrap justify-content-around">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card__head">Merenda</h5>
                    <p className="card__desc">Clique para ver o cardápio de merenda.</p>
                    <button className="card__btn" >Abrir</button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h5 className="card__head">Alunos</h5>
                    <p className="card__desc">Clique para ver os alunos cadastrados.</p>
                    <div>
                    <button className='card__btn' onClick={abriComponenteAluno}>Abrir</button>
                    {exibirAluno && <Aluno />}
                  </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h5 className="card__head">Professor</h5>
                    <p className="card__desc">Clique para ver os professores.</p>
                    <button className="card__btn" >Abrir</button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h5 className="card__head">Catálogo de Projetos</h5>
                    <p className="card__desc">Explore o catálogo de projetos disponíveis.</p>
                    <button className="card__btn" onClick={redirecionarParaProjeto}>Abrir</button>
                  </div>
                </div>

                <div className="card">
                  <div className="card__body">
                    <h5 className="card__head">Provas</h5>
                    <p className="card__desc">Acesse a seção de provas disponíveis.</p>
                    {/* Adicione a lógica ou remova o botão descomentando a linha abaixo */}
                    {/* <button className="btn btn-primary" onClick={redirecionarParaProvas}>Abrir</button> */}
                  </div>
                </div>
              </div>
            </div>
       )}
 
       {userRole === 'merendeira' && (
         <div className="col-sm-12">
          <h1 className="titulo-home fade-up">
             Olá merendeira, seja muito bem-vindo. Aqui você tem acesso a todas as ferramentas do Cimol.
           </h1>
           <div className="row">
           <div className="card">
           <div className="card__body">
                 <h5 className="card__head">Cardápio</h5>
                 <p className="card__desc">Clique para ver o cardápio.</p>
                 <button className="card__btn" >Abrir</button>
               </div>
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
                  <div className="card-body">
                    <h5 className="card__head">Merenda</h5>
                    <p className="card__desc">Clique para ver o cardápio de merenda.</p>
                    <button className="card__btn" >Abrir</button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h5 className="card__head">Alunos</h5>
                    <p className="card__desc">Clique para ver os alunos cadastrados.</p>
                     <div>
                    <button className='card__btn' onClick={abriComponenteAluno}>Abrir</button>
                    {exibirAluno && <Aluno />}
                  </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h5 className="card__head">Professor</h5>
                    <p className="card__desc">Clique para ver os professores.</p>
                    <button className="card__btn" >Abrir</button>
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
  )   
}

export default Home;