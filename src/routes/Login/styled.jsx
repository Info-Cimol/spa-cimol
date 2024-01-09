import styled from "styled-components";

export const Container = styled.div`
  .topo {
    background-color: #275faf;
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

      label {
        font-size: 1.2rem;
        margin-bottom: 0.5%;
      }

      input {
        padding: 1.5%;
        border-radius: 10px;
        margin-bottom: 4%;
        border: 1px solid;
        font-size: 1rem;
      }

      button {
        width: 50%;
        background-color: #d8a43d;
        border-radius: 10px;
        border: 1px solid;
        padding: 1.5%;
        font-size: 1.2rem;
        font-weight: bold;
        align-self: center;
        margin-bottom: 5%;
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
