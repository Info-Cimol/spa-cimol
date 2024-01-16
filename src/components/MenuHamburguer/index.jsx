import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Container} from "./styled.jsx";
import { useNavigate } from "react-router-dom";
import StyledTextButton from "./styled";

const MenuHamburguer = ({ userType, setMostrarBotao, setSecaoAlunos }) => {
    const navigate = useNavigate();

  /*const userName = localStorage.getItem('userName') ;
  const userEmail = localStorage.getItem('userEmail') ;*/


    const handleBottonSair = () => {
        localStorage.removeItem('userData');
        navigate('/');
    }

    const handleBottonProjeto = () => {
        if (userType === "aluno") {
            navigate('/Aluno/Projeto');
        } else if (userType === "professor"){
            navigate('/Professor/Projeto');
        }
    }

    const handleBottonCardapio = () => {
        if (userType === "aluno") {
            setMostrarBotao(false);
        } else {
            setMostrarBotao(false);
            setSecaoAlunos(false);
        }
    }

    const handleBottonAlunos = () => {
        setSecaoAlunos(true);
    }

    const handleBottonProjetos = () => {
        if (userType === "aluno") {
            navigate('/Aluno/Projeto');
        } else if (userType === "professor") {
            navigate('/Professor/Projeto');
        }
    }

    const handleBottonMeusProjetos = () => {
        if (userType === "aluno") {
            navigate('/Visualiza/Projeto/Aluno');
        } else if (userType === "professor") {
            navigate('/Visualiza/Projeto/Professor');
        }
    }

    return (
        <Container>
            <Menu right width={100}>
              
                {userType === "secretaria" && (
                    <>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton onClick={handleBottonAlunos}>Alunos</StyledTextButton>
                        <StyledTextButton className="menu-item" onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
                
                {userType === "aluno" && (
                    <>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardapio</StyledTextButton>
                        <StyledTextButton onClick={handleBottonProjeto}>Projetos</StyledTextButton>
                        <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
                        <StyledTextButton className="menu-item" onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}

                {userType === "professor" && (
                    <>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton onClick={handleBottonProjetos}>Projetos</StyledTextButton>
                        <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
                        <StyledTextButton /*</>onClick={}*/>Provas</StyledTextButton>
                        <StyledTextButton className="menu-item" onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
                
                {userType === "funcionario" && (
                    <>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton className="menu-item" onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
            </Menu>
        </Container>
    );
};

export default MenuHamburguer;