import React, { useState, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import { Container } from "./styled.jsx";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Tooltip, IconButton, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { PersonAdd, Settings, Logout, VpnKey } from '@mui/icons-material';
import Aluno from '../Aluno/index.jsx';
import Cardapio from '../Cardapio/index.jsx';
import ReservaSemana from '../Cardapio/reservaSemana.jsx';
import StyledTextButton from "./styled";

const MenuHamburguer = ({ userType}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userNameIni] = localStorage.getItem('userName');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const [exibirAluno, setExibirAluno] = useState(false);
  const [exibirCardapio, setExibirCardapio] = useState(false);
  const [exibirCardapioMerenda, setExibirCardapioMerenda] = useState(false); 

  const handleBottonSair = () => {
    localStorage.removeItem('userData');
    window.location.reload();
  };

  const abrirCardapio = () => {
    setExibirCardapio(true);
    setExibirAluno(false); 
    setExibirCardapioMerenda(false);
    setIsMenuOpen(false);
  };

  const abrirAluno = () => {
    setExibirAluno(true); 
    setExibirCardapio(false);
    setExibirCardapioMerenda(false);
    setIsMenuOpen(false); 
  };

  const abrirCardapioMerenda = () => {
    setExibirCardapioMerenda(true);
    setExibirCardapio(false); 
    setExibirAluno(false);
    setIsMenuOpen(false); 
  };
  
  const handleBottonHome = () => {
      window.location.reload();
    
      navigate('/');
  };

 /* const handleBottonProjeto = () => {
    if (userType === "aluno" || userType === "admin") {
      navigate('/Projeto');
    } else if (userType === "professor" || userType === "admin") {
      navigate('/Projeto');
    }
  };*/

  /*const handleBottonMeusProjetos = () => {
    if (userType === "aluno" || userType === "admin") {
      navigate('/Area/Projeto');
    } else if (userType === "professor" || userType === "admin") {
      navigate('/Area/Projeto');
    }
  };*/

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
    
          {(userType === "merendeira") && (
            <>
              <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
              <StyledTextButton onClick={abrirCardapioMerenda}>Reserva</StyledTextButton>
            </>
          )}

          {(userType === "admin") && (
            <>
              <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
              <StyledTextButton onClick={abrirCardapioMerenda}>Merenda</StyledTextButton>
              <StyledTextButton onClick={abrirAluno}>Aluno</StyledTextButton>
              <StyledTextButton>Professor</StyledTextButton>
                {/*<StyledTextButton onClick={handleBottonProjeto}>Projeto</StyledTextButton>*/} 
             {/*<StyledTextButton onClick={handleBottonMeusProjetos}>Meus projetos</StyledTextButton> */} 
              <StyledTextButton>Provas</StyledTextButton>
            </>
          )}

          {(userType === "secretaria") && (
            <>
              <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
              <StyledTextButton onClick={abrirCardapioMerenda}>Merenda</StyledTextButton>
              <StyledTextButton onClick={abrirAluno}>Aluno</StyledTextButton>
              <StyledTextButton>Professor</StyledTextButton>
            </>
          )}

          {(userType === "aluno") && (
            <>
              <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
              <StyledTextButton onClick={abrirCardapio}>Cardapio</StyledTextButton>
             {/*<StyledTextButton onClick={handleBottonProjeto}>Projeto</StyledTextButton>*/} 
             {/*<StyledTextButton onClick={handleBottonMeusProjetos}>Meus projetos</StyledTextButton> */} 
            </>
          )}

          {(userType === "professor") && (
            <>
              <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
              <StyledTextButton onClick={abrirCardapio}>Cardapio</StyledTextButton>
             {/*<StyledTextButton onClick={handleBottonProjeto}>Projeto</StyledTextButton>*/} 
             {/*<StyledTextButton onClick={handleBottonMeusProjetos}>Meus projetos</StyledTextButton> */} 
              <StyledTextButton>Provas</StyledTextButton>
            </>
          )}
        </Menu>
      )}
    </Container>
  );  
};

export default MenuHamburguer;