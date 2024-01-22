import styled from "styled-components";

export const Container = styled.div`

    .bm-menu {
        background-color: #1B2F4A; 
        padding: 1.5rem;
    }

    .bm-burger-bars {
        background: #FFBD59;
    }

    .bm-burger-button {
        position: fixed;
        width: 36px;
        height: 30px;
        left: 85%;
        top: 25px;
    }

    @media screen and (min-width: 450px){
        .bm-burger-button {
            left: 90%;
        }
    }

    @media screen and (min-width: 600px){
        .bm-burger-button {
            left: 92%;
        }
    }

    @media screen and (min-width: 800px){
        .bm-burger-button {
            left: 93%;
            top: 30px;
        }
    }
`

const StyledTextButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: none;
    padding: 0;
    margin: 0;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    font-size: 1rem;
    color: #fff; 
    text-decoration: none;
    margin-bottom: 10%;
    transition: background-color 0.5s ease; 

    &:hover {
        background-color: #FFBD59;
    }
`;

export default StyledTextButton;