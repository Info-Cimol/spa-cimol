import styled from "styled-components";

export const Container = styled.div`

    .bm-menu {
        background-color: #275faf; 
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
        top: 36px;
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
            top: 38px;
        }
    }
`

const StyledTextButton = styled.button`
    border: none;
    padding: 0;
    margin: 0;
    background-color: transparent;
    cursor: pointer;
    font-size: 1.0rem;
    color: #fff; 
    text-decoration: none;
    margin-bottom: 10%;
    &:hover {
        background-color:#FFBD59 ;
    }
`;

export default StyledTextButton;