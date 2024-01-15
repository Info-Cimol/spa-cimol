import styled from "styled-components";

export const Container = styled.div`

    .topo{
        height: 100px;
        width: 100%;
        position: fixed;
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .container1{
        background-color: #1B2F4A;
        height: 95%;

        img{
            width: 40px;
            margin-left: 8%;
            margin-top: 5%;
        }
    }

    .container2{
        background-color: #FFBD59;
        height: 6px;
    }

    @media screen and (min-width: 570px) {
        .container1{
            img{
                margin-top: 3%;
            }
        }
    }

    @media screen and (min-width: 570px) {
        .container1{
            img{
                margin-top: 2%;
            }
        }
    }
    
`;