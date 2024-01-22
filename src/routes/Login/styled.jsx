import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Container = styled.div`
  .topo {
    background-color: #1b2f4a;
    height: 124px;
    display: flex;
    align-items: flex-end;
    animation: ${fadeIn} 5s ease;
  }

  Input {
    border: none;
  }

  .bi.bi-person {
    font-size: 40px;
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
    animation: ${fadeIn} 1.8s ease;

    img {
      width: 90px;
    }
  }

  .areaLogin {
    display: flex;
    flex-direction: column;
    padding-top: 8%;
    align-items: center;
  }
    

    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      max-width:50%;

      .profile-selector-container {
        width: 100%;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        transition: all 1s ease;
      }

      .profile-options {
        margin-top: 15px;
      }
      .valor-label {
        display: flex;
        align-items: center;
        margin: 5px 0;
      }

      .checkbox-input {
        margin-right: 10px;
        font-size: 1rem;
      }

      .select-button {
        width: 100%;
        margin-top: 15px;
        padding: 10px 15px;
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .select-button:hover {
        background-color: #0056b3;
      }

      input {
        background-color: #fff;
        font-size: 16px;
        height: 2.8rem;
        margin: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: all 0.3s ease-out;
      }

      .input-group-text {
        height: 2.8rem;
        display: flex;
        align-items: center;
        margin: 10px;
        margin-right: 0.1px;
      }

      span {
        border: none;
        background: #1b2f4a;
        color: #fff;
      }

      button {
        max-width:30%;
        width: 50%;
        background-color: #d8a43d;
        border: 0;
        border-radius: 10px;
        padding: 10px;
        font-size: 1.2rem;
        align-self: center;
        margin-top: 20px;
        cursor: pointer;
        color: #fff;
        transition: background-color 0.3s ease-in-out;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      button:hover {
        background-color: #c19235;
      }
    }
  

  .containerAlterarSenha {
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 1000;
    position: absolute;
    top: 25%;
  }

  @media screen and (min-width: 465px) {
    .areaLogin {
      padding-top: 1rem;    
  }

  .form {
    width: 80%;
    max-width:80%;
  }
  .bi.bi-person{
        margin-top: 6rem
      }
`;