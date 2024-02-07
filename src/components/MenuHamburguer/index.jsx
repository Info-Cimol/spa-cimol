import React, { useState, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import { Container } from "./styled.jsx";
import { useNavigate } from "react-router-dom";
import StyledTextButton from "./styled";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { deepOrange } from '@mui/material/colors';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Aluno from '../Aluno/index.jsx';
import VpnKey from '@mui/icons-material/VpnKey';

const MenuHamburguer = ({ userType, setMostrarBotao, setSecaoAlunos }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userNameIni] = localStorage.getItem('userName');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const [exibirAluno, setExibirAluno] = useState(false);

  const handleBottonSair = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  const handleBottonAluno = () => {
    if ((userRole === "admin" || userRole === "secretaria") && !exibirAluno) {
      setExibirAluno(true);
    }
    setIsMenuOpen(true);
  };  
  
  const handleBottonHome = () => {
    navigate('/Home')
    window.location.reload();
  };
  
  const handleBottonProjeto = () => {
    if (userType === "aluno" || userType === "admin") {
      navigate('/Projeto');
    } else if (userType === "professor" || userType === "admin") {
      navigate('/Projeto');
    }
  };
  
  const handleBottonCardapio = () => {
    if (userType === "aluno") {
      setMostrarBotao(false);
    } else {
      setMostrarBotao(false);
      setSecaoAlunos(false);
    }
  };

  const handleBottonMeusProjetos = () => {
    if (userType === "aluno" || userType === "admin") {
      navigate('/Area/Projeto');
    } else if (userType === "professor" || userType === "admin") {
      navigate('/Area/Projeto');
    }
  };

  const handleCloseProfile = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', handleCloseProfile);

    return () => {
      document.body.removeEventListener('click', handleCloseProfile);
    };
  }, []);

  return (
    <Container>
    {exibirAluno && (userRole === 'admin' || userRole === 'secretaria') ? (
      <Aluno />
    ) : (
      <Menu right width={isSmallScreen ? "50%" : 150} isOpen={isMenuOpen}>
        <React.Fragment>
          <Tooltip title="Sua conta">
            <IconButton onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} size="small">
              <Avatar sx={{ bgcolor: deepOrange[500], width: 50, height: 50, marginBottom: '10px' }}>{userNameIni}</Avatar>
            </IconButton>
          </Tooltip>
  
          {isMenuOpen && (
            <Box
              onClick={(e) => e.stopPropagation()} 
              sx={{
                position: 'absolute',
                top: '60px',
                right: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.32)',
                backgroundColor: '#fff',
                zIndex: 1000,
                minWidth: '200px',
                padding: '10px',
              }}
            >
  
              <MenuItem>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: deepOrange[500], width: 50, height: 50, marginBottom: '10px', md: 6 }}>{userNameIni}</Avatar>
                  <div>
                    <h3>{userName}</h3>
                  </div>
                  <div>
                    <p>{userEmail}</p>
                  </div>
                  <div style={{ marginTop: '10px', textAlign: 'center', color: '#333' }}>
                    <p style={{ marginBottom: '5px', fontSize: '1.2rem' }}>Função: {userRole}</p>
                  </div>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Adicionar outra conta
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Configurações
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <VpnKey fontSize="small" />
                </ListItemIcon>
                Trocar de Senha
              </MenuItem>
              <MenuItem onClick={handleBottonSair}>
                <ListItemIcon>
                  <Logout onClick={handleBottonSair} fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Box>
          )}
        </React.Fragment>
  
        {(userType === "aluno" || userType === "professor" || userType === "merendeira" || userType === "admin") && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={handleBottonCardapio}>Cardapio</StyledTextButton>
          </>
        )}
  
        {(userType === "professor" || userType === "admin") && (
          <StyledTextButton onClick={handleBottonProjeto}>Projetos</StyledTextButton>
        )}
  
        {(userType === "aluno" || userType === "admin" || userType === "professor") &&  (
          <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
        )}
  
        {(userType === "professor" || userType === "admin") && (
          <StyledTextButton /*</>onClick={}*/>Provas</StyledTextButton>
        )}
        
        {(userType === "admin" || userType === "secretaria") && (
          <StyledTextButton onClick={handleBottonAluno}>Alunos</StyledTextButton>
        )}
      </Menu>
    )}
  </Container>
  );  
};

export default MenuHamburguer;