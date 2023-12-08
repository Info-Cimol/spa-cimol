import styled from "styled-components";

export const Container = styled.div`
    .buttons{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 55%;

        button{
            width: 55%;
            padding: 7%;
            border: 1px solid;
            border-radius: 10px;
            margin-top: 5%;
            background-color: white;
            font-size: 25px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5); /* x, y, desfoque, cor */
            transition: box-shadow 0.3s ease;
        }
    }

    .containerCardapio{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 30%;
    }

    .reservado{
        color: #38eb14;
    }

    .checkboxContainer input[type="checkbox"] {
        appearance: none;
        width: 26px;
        height: 24px;
        border: 1px solid #474947;
        border-radius: 10px;
        position: relative;
    }

    .checkboxContainer input[type="checkbox"]:checked::before {
        content: "✓";
        color: #38eb14;
        position: absolute;
        font-size: 19px;
        left: 5px;
        bottom: 0.1%;
    }

    .checkboxContainer{
        display: flex;
        position: relative;
        padding-bottom: 3%;
        
        svg{
            position: absolute;
            left: 9px;
            bottom: 4px;
        }

        label{
            margin-left: 2%;
        }
    }

    .boxTurno{
        width: 60%;
        height: 17%;
        z-index: 1000;
        background-color: white;
        border: solid 1px black;
        border-radius: 5%;
        position: absolute;
        top: 47.5%;
        padding: 3%;
        display: flex;
        flex-direction: column;

        p{
            font-weight: bold;
            margin-bottom: 3%;
        }

        label{
            padding-left: 2%;
            padding-bottom: 2%;
        }
    }

    .turno{
        padding-bottom: 1.5%;
    }

    .reservarBloqueado{
        color: red;
    }

    .boxCardapio{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        

        h1{
            font-size: 25px;
            margin-bottom: 5%;
            margin-top: 4%;
            margin-left: 3%;
            align-self: flex-start;
        }
    }

    .inner{
        display: flex;
        max-width: 300px;
    }

    .item{
        min-height: 150px;
        min-width: 200px;

        p{
            margin-left: 5%;
            margin-bottom: 2%;
        }
    }
    
    .containerCarrossel{
        margin-left: 3%;
        border: 1px solid;
        border-radius: 10px;
        min-height: 250px;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        input{
            margin-left: 5%;
            margin-top: 0;
        }
    }

    .item img{
        width: 100%;
        height: 75%;
        pointer-events: none;
    }

    .carrossel{
        cursor: grab;
        overflow: hidden;
    }

    @media screen and (min-width: 600px){
        .boxCardapio{
            width: 400px;
        }

        .carrossel{
            width: 400px;
        }

        .containerCardapio{
            padding-top: 20%;
        }

        .buttons{
            padding-top: 40%;

            button{
                width: 50%;
            }
        }
    }

    @media screen and (min-width: 800px){
        .boxCardapio{
            width: 500px;
        }

        .carrossel{
            width: 500px;
        }

        .containerCardapio{
            padding-top: 15%;
        }

        .buttons{
            padding-top: 30%;

            button{
                width: 45%;
                padding: 5%;
            }
        }
    }

    @media screen and (min-width: 1000px){
        .boxCardapio{
            width: 600px;
        }

        .carrossel{
            width: 600px;
        }

        .containerCardapio{
            padding-top: 10%;
        }

        .buttons{
            padding-top: 15%;

            button{
                width: 35%;
                padding: 4%;
            }
        }
    }
`