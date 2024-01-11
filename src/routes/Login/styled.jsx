import styled from "styled-components";

export const Container = styled.div`
  .topo {
    background-color: #1B2F4A;
    height: 124px;
    display: flex;
    align-items: flex-end;
  }

  .bi.bi-person{
font-size:40px
margin-bottom: 100px;
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

    img {
      width: 90px;
    }
  }

  .areaLogin {
    display: flex;
    flex-direction: column;
    padding-top: 18%;
    align-items: center;

    h1 {
      margin-bottom: 2%;
      font-weight: bold;
      font-size: 2rem;
    }

    h2 {
      top: 2%;
      position: absolute;
    }

    p {
      font-size: 1rem;
      font-weight: 500;

      a {
        text-decoration: underline;
        color: black;
        cursor: pointer;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      width: 80%;

      input {
        font-size: 16px;
        padding: 10px;
        margin: 5px 5px 15px 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: all 0.3s ease-out;
      }
      
      button {
        width: 50%;
        background-color: #d8a43d;
        border: none;
        border-radius: 10px;
        padding: 10px; 
        font-size: 1.2rem;
        align-self: center;
        margin-bottom: 5%;
        cursor: pointer;
        color: #fff; 
        transition: background-color 0.3s ease-in-out; 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      button:hover {
        background-color: #c19235; 
        cursor: pointer;
      }
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

  @media screen and (min-width: 750px) {
    .areaLogin {
      padding-top: 7%;

      h1 {
        margin-bottom: 2%;
        font-size: 2.5rem;
      }

      form {
        width: 30%;
      }
    }
  }
`;
