import axios from "axios";
const API_URL = "https://api-nears.onrender.com/api/users";
// const API_URL = "http://localhost:5000/api/users";
const token: any = localStorage.getItem('jwtToken')
const headers = { 'Authorization': token };

export const addFriend = async(id: any) =>{
    try{
        const data = {'id': id};
        const response: any = await axios.post(`${API_URL}/add-friend-request`, data, {headers});

        return response.data;
    } catch(err:any){
        throw new Error(err);
    }
}
export const removeFriend = async(id: any) =>{
    try{
        const data = {'id': id};
        const response: any = await axios.post(`${API_URL}/remove-friend-request`, data, {headers})

        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}
export const getRequest = async() => {
    try{
        const response: any = await axios.get(`${API_URL}/get-friend-request`, {headers})
        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}
export const getRequestReceived = async() => {
    try{
        const response: any = await axios.get(`${API_URL}/get-friend-request-received`, {headers})
        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}
export const acceptRequest = async(id: any) => {
    try{
        const data = {'id': id};
        const response: any = await axios.post(`${API_URL}/accept-friend-request`, data, {headers})
        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}
export const getFriend = async(id: any) => {
    try{
        const data = {'id': id};
        const response: any = await axios.post(`${API_URL}/get-friend`, data, {headers})
        return response.data;
    } catch(err: any){
        throw new Error(err);
    }
}