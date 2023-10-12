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
        padding-top: 35%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .containerDescricao{
        position: absolute;
        background-color: #c4c1c1;
        z-index: 1000;
        width: 84%;
        height: 30%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 3%;

        svg{
            position: absolute;
            left: 92%;
            cursor: pointer;
        }

        p{
            padding-top: 5%;
        }
    }

    .reservas{
        position: absolute;
        bottom: 20px;

        p{
            padding-top: 2%;
        }
    }

    .iconAdd{
        cursor: pointer;
    }

    .topoTabela{
        width: 90%;
        position: relative;
        display: flex;
        justify-content: space-between;

        input{
            border: 1px solid;
            border-radius: 20px;
            border-color: #646464;
            font-size: 15px;
            width: 150px;
            padding: 2%;
        }
    }

    .tabelaCardapio{
       width: 90%;
    }

    .tabela{
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    
    }

    .tabela tbody{
        cursor: pointer;

        :hover{
            background-color: #ebe7e7;
        }
    }

    .tabela th, td{
        border: 1px solid #a3a2a2;
        padding: 8px;
        text-align: center;
    } 

    .tabela thead {
        font-weight: bold;
        color: #302f2f;
    }

    .iconBusca{
        position: absolute;
        left: 10px;
        top: 25%;
    }

    .containerNew{
        width: 100%;
        height: 100%;
        background-color: white;
        position: absolute;
        z-index: 999;
        padding-top: 35%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .new{
        border: 1px solid;
        border-color: #a3a2a2;
        width: 80%;
        text-align: center;
        padding: 1%;
        background-color: #e0dede;
        margin-bottom: 5%;
    }

    .formulario{
        width: 80%;
        font-size: 18px;

        form{
            display: flex;
            flex-direction: column;

            label{
                font-weight: 600;
                margin-bottom: 1%;
                padding-top: 2%;
            }

            input{
                font-size: 18px;
                padding: 1%;
            }

            button{
                width: 40%;
                font-size: 18px;
                padding: 8px;
                border-radius: 30px;
                border: 1px solid;
                align-self: center;
                margin-top: 5%;
                cursor: pointer;
            }

            textarea{
                min-height: 100px;
                font-size: 18px;
                padding: 2%;
                resize: none;
                border: 1px solid #666666;
            }
        }
    }

    @media screen and (min-width: 600px){
        .buttons{
            padding-top: 40%;

            button{
                width: 50%;
            }
        }

        .containerCardapio{
            padding-top: 25%;
        }

        .topoTabela{
            input{
                padding: 1%;
            }
        }

        .containerNew{
            padding-top: 25%;
        }
    }

    @media screen and (min-width: 800px){

        .buttons{
            padding-top: 30%;

            button{
                width: 45%;
                padding: 5%;
            }
        } 

        .containerCardapio{
            padding-top: 20%;
        }

        .containerNew{
            padding-top: 20%;
        }

        .new{
            width: 60%;
        }

        .formulario{
            width: 60%;
        }


    }

    @media screen and (min-width: 1000px){
        .buttons{
            padding-top: 15%;

            button{
                width: 35%;
                padding: 4%;
            }
        }

        .containerCardapio{
            padding-top: 15%;
        }

        .containerNew{
            padding-top: 13%;
        }

        .new{
            width: 60%;
        }

        .formulario{
            width: 60%;
        }

    }

`