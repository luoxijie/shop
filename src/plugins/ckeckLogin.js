export const checkLogin = ()=>{
    if(sessionStorage.getItem('token') == undefined){
        return false;
    }
    else{
        return true;
    }
};
