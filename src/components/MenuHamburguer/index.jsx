import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Container} from "./styled.jsx";
import { useNavigate } from "react-router-dom";
import StyledTextButton from "./styled";

const MenuHamburguer = ({ userType, setMostrarBotao, setSecaoAlunos }) => {
    const navigate = useNavigate();

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

    const handleBottonHome = () => {
        if (userType === "aluno") {
            navigate('/Aluno/');
        } else if (userType === "professor"){
            navigate('/Professor/');
        }
        else if (userType === "secretaria"){
            navigate('/Secretaria');
        }
        else if (userType === "admin"){
            navigate('/Coodernador/Admin');
        }
        else if (userType === "merendeira"){
            navigate('/Merendeira');
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
            <Menu right width={150}>
              
                {userType === "secretaria" && (
                    <>
                        <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton onClick={handleBottonAlunos}>Alunos</StyledTextButton>
                        <StyledTextButton onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
                
                {userType === "aluno" && (
                    <>
                    <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>

                        <StyledTextButton onClick={handleBottonCardapio}>Cardapio</StyledTextButton>
                       
                        <StyledTextButton onClick={handleBottonProjeto}>Projetos</StyledTextButton>
                       
                        <StyledTextButton onClick={handleBottonMeusProjetos}>
                            Meus Projetos
                        </StyledTextButton>
                      
                        <StyledTextButton className="menu-item" onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}

                {userType === "professor" && (
                    <>
                       <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>

                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                       
                        <StyledTextButton onClick={handleBottonProjetos}>Projetos</StyledTextButton>
                       
                        <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
                       
                        <StyledTextButton /*</>onClick={}*/>Provas</StyledTextButton>
                        
                        <StyledTextButton  onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
                
                {userType === "merendeira" && (
                    <>
                        <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton  onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
                 {userType === "admin" && (
                    <>
                        <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton onClick={handleBottonProjetos}>Projetos</StyledTextButton>
                        <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
                        <StyledTextButton /*</>onClick={}*/>Provas</StyledTextButton>
                        <StyledTextButton onClick={handleBottonSair}>
                            Sair
                        </StyledTextButton>
                    </>
                )}
            </Menu>
        </Container>
    );
};

export default MenuHamburguer;