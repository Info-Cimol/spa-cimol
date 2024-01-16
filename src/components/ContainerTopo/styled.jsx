import styled from "styled-components";

export const Container = styled.div`

.topo{
    position: fixed;
    height: 85px;
    width: 100%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

    #cici{
        width: 50px;
        margin-left: 8%;
        margin-top: 0.8%;
    }

    .containerTopo{
        background-color: #1B2F4A;
        height: 95%;

        img{
            width: 40px;
            margin-left: 8%;
            margin-top: 5%;
        }
    }

    .linhaAmarela{
        background-color: #FFBD59;
        height: 6px;
    }

    @media screen and (min-width: 570px) {
        .containerTopo{
            img{
                margin-top: 3%;
            }
        }
    }

    @media screen and (min-width: 570px) {
        .containerTopo{
            img{
                margin-top: 2%;
            }
        }
    }
`;