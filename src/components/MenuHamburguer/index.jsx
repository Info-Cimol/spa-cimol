import React from "react";
import { slide as  Menu } from "react-burger-menu";
import { Container } from "./styled";
import StyledTextButton from "./styled";
import { useNavigate } from "react-router-dom";

const MenuHamburguer = ({userType, setMostrarBotao, setSecaoAlunos}) => {
    const navigate = useNavigate();

    const handleBottonSair =() =>{
        localStorage.removeItem('userData');  
        navigate('/')
    }

    const handleBottonCardapio = () =>{
        if(userType=== "aluno"){
            setMostrarBotao(false);
        }else{
            setMostrarBotao(false);
            setSecaoAlunos(false);
        }
    }

    const handleBottonAlunos = () =>{
        setSecaoAlunos(true);
    }

    return(
        <Container>
            <Menu right width={100}>
                {userType === "aluno" &&(
                    <>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardapio</StyledTextButton>
                        <StyledTextButton className="menu-item" onClick={handleBottonSair} href="/" >
                        Sair
                        </StyledTextButton>
                    </>
                )}
                {userType === "secretaria" &&(
                    <>
                        <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
                        <StyledTextButton onClick={handleBottonAlunos}>Alunos</StyledTextButton>
                        <StyledTextButton className="menu-item" onClick={handleBottonSair} >
                            Sair
                        </StyledTextButton>
                    </>
                )}     
            </Menu>
        </Container>
    );
};

export default MenuHamburguer;