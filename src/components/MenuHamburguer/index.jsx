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

const MenuHamburguer = ({ userType }) => {
  const navigate = useNavigate();
  const [userNameIni] = localStorage.getItem('userName');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleBottonSair = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const abrirCardapio = () => {
    setSelectedComponent(<Cardapio />);
    setIsMenuOpen(false);
  };

  const abrirAluno = () => {
    setSelectedComponent(<Aluno />);
    setIsMenuOpen(false);
  };

  const abrirCardapioMerenda = () => {
    setSelectedComponent(<ReservaSemana />);
    setIsMenuOpen(false);
  };

  const handleBottonHome = () => {
    window.location.reload();
    navigate('/');
  };
  
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
          
        {(userType === "merendeira") && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
          </>
        )}

        {(userType === "admin" || userType === "secretaria") && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={abrirCardapioMerenda}>Merenda</StyledTextButton>
            {userType === "admin" && <StyledTextButton onClick={abrirAluno}>Aluno</StyledTextButton>}
            <StyledTextButton>Professor</StyledTextButton>
            {userType === "admin" && <StyledTextButton>Provas</StyledTextButton>}
          </>
        )}

        {(userType === "aluno" || userType === "professor") && (
          <>
            <StyledTextButton onClick={handleBottonHome}>Home</StyledTextButton>
            <StyledTextButton onClick={abrirCardapio}>Cardapio</StyledTextButton>
            {userType === "professor" && <StyledTextButton>Provas</StyledTextButton>}
          </>
        )}
      </Menu>

      {selectedComponent && (
        <>{selectedComponent}</>
      )}
     
    </Container>
  );
};

export default MenuHamburguer;