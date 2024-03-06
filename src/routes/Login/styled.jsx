import styled from "styled-components";

export const Container = styled.div`

.topo {
  background-color: #1b2f4a;
  height: 124px;
  display: flex;
  align-items: flex-end;
}

.topo2 {
  background-color: #ffbd59;
  width: 100%;
  height: 6%;
}

.imgCentral {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
}

.areaLogin {
  display: flex;
  flex-direction: column;
  padding-top: 8%;
  align-items: center;
  animation: fadeIn 1.5s ease; 
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.formulario-login {
  width: 80%; 
  max-width: 650px; 
  padding: 30px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.formulario-login .password-input i {
  cursor: pointer;
}

/* Adicionando estilos para o seletor de perfil */
.profile-selector-container {
  margin-top: 20px;
}

.profile-selector-container .profile-label {
  margin-bottom: 10px;
  font-weight: bold;
}

.profile-selector-container .MuiFormControlLabel-root {
  margin-bottom: 10px;
}

/* Estilos para o link "Esqueceu a senha?" */
.forgot_password {
  margin-top: 10px;
  color: #1b2f4a;
  cursor: pointer;
}

/* Estilos para o botão de login */
.btn-primary {
  width: 100%;
  max-width: 300px; /* Limitando a largura máxima do botão */
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 15px; /* Aumentando o preenchimento do botão */
  margin-top: 20px; /* Ajustando o espaçamento superior */
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Adicionando media queries para ajustar estilos em diferentes tamanhos de tela */
@media screen and (max-width: 768px) {
  .formulario-login {
    width: 90%; 
    margin-top: 100px;
  }

  .btn-primary {
    max-width: 250px; /* Reduzindo a largura máxima do botão para telas menores */
  }
}

`;