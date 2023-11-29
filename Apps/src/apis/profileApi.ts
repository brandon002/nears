import axios from "axios";
// const API_URL = "https://api-nears.onrender.com/api/users";
const API_URL = "http://localhost:5000/api/users";
const token: any = localStorage.getItem('jwtToken');
var headers = { 'Authorization': token };

export const getProfile = async (token:any) => {
    try{
        headers = { 'Authorization': token };
        const response: any = await axios.get(`${API_URL}/user`, { headers});
        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}
export const editProfile = async (config: any) => {
    try{
        const response: any = await axios.post(`${API_URL}/edit-profile`, config, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const getInterest = async () => {
    try{
        const response: any = await axios.get(`${API_URL}/interests`, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const getSkill = async () => {
    try{
        const response: any = await axios.get(`${API_URL}/skills`, {headers})
        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}
export const getSkillInterest = async() => {
    try{
        if(headers.Authorization!==null){
            const response: any = await axios.get(`${API_URL}/skillInterests`, {headers});
            return response.data;
        }
    } catch(err: any){
        throw new Error(err);
    }
}
export const editInterest = async (interests: any) => {
    try{
        const response: any = await axios.post(`${API_URL}/interests`, interests, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const editSkill = async (skills: any) => {
    try{
        const response: any = await axios.post(`${API_URL}/skillInterests`, skills, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const getResetToken = async (oldPassword: any) => {
    try{
        const response: any = await axios.get(`${API_URL}/resetToken?password=${oldPassword}`, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const uploadPicUser = async (image: any) => {
    try{
        const formData = new FormData();
        formData.set('picture', image);
        const response: any = await axios.post(`${API_URL}/user-picture`, formData, {headers})
        return response;
    } catch(err: any){
        throw new Error(err)
    }
}
export const getUsers = async (config: any) => {
    try{
        const payload = { 'config': config };
        const response: any = await axios.post(`${API_URL}/get-users`, payload, {headers});
       
        return response.data;
    } catch(err: any){
        throw new Error(err)
    }
}
export const getUserDetail = async(id: any) => {
    try{
        const data = { 'id': id };
        const response: any = await axios.post(`${API_URL}/user-detail`, data, {headers});

        return response.data;
    } catch(err:any){
        throw new Error(err)
    }
}