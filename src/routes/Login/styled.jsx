import styled from "styled-components";

export const Container = styled.div`

.topo{
        background-color: #275faf;
        height: 124px;
        display: flex;
        align-items: flex-end;
    }

    .topo2{
        background-color: #FFBD59;
        width: 100%;
        height: 6%;
    }

    .imgCentral{
        position: absolute; 
        top: 15%; 
        left: 50%;
        transform: translate(-50%, -50%);

        img{
            width: 90px;
        }
    }

    .areaLogin{
        display: flex;
        flex-direction: column;
        padding-top: 18%;
        align-items: center;

        h1{
            margin-bottom: 5%;
            font-weight: bold;
        }

        p{
            font-size: 18px;
            font-weight: 500;
            
            a{
                text-decoration: underline;
                color: black;
                cursor: pointer;
            }
        }

        form{
            display: flex;
            flex-direction: column;
            width: 80%;

            label{
                font-size: 20px;
                margin-bottom: 0.5%;
            }

            input{
                padding: 2%;
                border-radius: 10px;
                margin-bottom: 4%;
                border: 1px solid;
                font-size: 20px;
            }

            button{
                width: 50%;
                background-color: #D8A43D ;
                border-radius: 10px;
                border: 1px solid;
                padding: 1%;
                font-size: 20px;
                font-weight: bold;
                align-self: center;
                margin-bottom: 5%;
            }
        }
    }

    @media screen and (min-width: 750px) {
        
        .areaLogin{
            padding-top: 7%;

            h1{
                margin-bottom: 2%;
            }

            form{
                width: 30%;
            }
        }
    }

`