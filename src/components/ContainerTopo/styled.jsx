import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  .topo {
    position: fixed;
    height: 85px;
    width: 100%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  #cici {
    width: 50px;
    margin-left: 8%;
    margin-top: 0.8%;
  }

  .containerTopo {
    background-color: #1b2f4a;
    height: 95%;
    animation: ${fadeIn} 1.8s ease; 

    img {
      width: 40px;
      margin-left: 8%;
      margin-top: 5%;
    }
  }

  .linhaAmarela {
    background-color: #ffbd59;
    height: 6px;
  }

  @media screen and (min-width: 570px) {
    .containerTopo {
      img {
        margin-top: 3%;
      }
    }
  }

  @media screen and (min-width: 570px) {
    .containerTopo {
      img {
        margin-top: 2%;
      }
    }
  }
`;