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

    .bm-item {
        display: block;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        color: #fff; 
        text-decoration: none;
        transition: color 0.3s;
    }

    .bm-item:hover {
        color: #92867d; 
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