import React, { useEffect, useState} from "react";
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
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
//import Aluno from '../Aluno';
import { deepOrange } from '@mui/material/colors';
import VpnKey from '@mui/icons-material/VpnKey';

const MenuHamburguer = ({ userType, setMostrarBotao, setSecaoAlunos }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userNameIni] = localStorage.getItem('userName'); // Puxa a inicial da pessoa pelo nome no localstorage
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
 
  const handleBottonSair = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

 /* const handleBottonUpdatePassword = () => {
   
    navigate('/Reset-Password');
  };*/

  const handleBottonHome = () => {
    navigate('/Home', { replace: true, forceRefresh: true });
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
  
        {userType === "secretaria" && (
          <>
          <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
          <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
          </>
        )}
  
        {userType === "aluno" && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={handleBottonCardapio}>Cardapio</StyledTextButton>
            <StyledTextButton onClick={handleBottonProjeto}>Projetos</StyledTextButton>
            <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
          </>
        )}
  
        {userType === "professor" && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
            <StyledTextButton onClick={handleBottonProjeto}>Projetos</StyledTextButton>
            <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
            <StyledTextButton /*</>onClick={}*/>Provas</StyledTextButton>
          </>
        )}
  
        {userType === "merendeira" && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
          </>
        )}
  
        {userType === "admin" && (
          <>
           <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={handleBottonCardapio}>Cardápio</StyledTextButton>
            <StyledTextButton onClick={handleBottonProjeto}>Projetos</StyledTextButton>
            <StyledTextButton onClick={handleBottonMeusProjetos}>Meus Projetos</StyledTextButton>
            <StyledTextButton /*</>onClick={}*/>Provas</StyledTextButton>
          </>
        )}
      </Menu>
    </Container>
  );  
};

export default MenuHamburguer;