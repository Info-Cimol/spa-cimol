import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Private({children, allowedRoles}){
   
    const navigate = useNavigate();
    const userDataString = localStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const perfil = userData.user.perfil[0];

    useEffect(() =>{
        if(!userData){
            navigate('/')
        }else if(!allowedRoles.includes(perfil)){
            navigate('/ErrorPage')
        }
    })
    
    if(userData && allowedRoles.includes(perfil)){
        return children;
    }
}
 
export function UsuarioLogado({children}){
    const navigate = useNavigate();
    
    useEffect(()=>{
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);

        if(userData){
            if(userData.user.perfil[0] === 'aluno'){
                navigate('/AlunoLogado');
            }
        }
    })

    return children;
}