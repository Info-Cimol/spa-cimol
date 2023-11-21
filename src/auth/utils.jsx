
const createHeaders = (userData) =>{
    if(userData){
        return{
            "Content-Type": "application/json",
            "x-access-token": userData.token,
            "perfil": userData.user.perfil,
            "iduser": userData.user.id
        };
    }

    return {};
}

export default createHeaders;