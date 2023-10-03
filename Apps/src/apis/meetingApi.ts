import axios from "axios";
const API_URL = "https://api-nears.onrender.com/api/users";
// const API_URL = "http://localhost:5000/api/users";
const token: any = localStorage.getItem('jwtToken')
var headers = { 'Authorization': token };

export const createMeeting = async(config: any) =>{
    try{
        const data = config;
        const response: any = await axios.post(`${API_URL}/create-meeting`, data, {headers});

        return response.data;
    } catch(err:any){
        throw new Error(err);
    }
}

export const getMeetingList = async(config: any) => {
    try{
        headers = { 'Authorization': token };
        const data = config;
        const response: any = await axios.post(`${API_URL}/get-meeting-list`, data, {headers});

        return response.data;
    }catch(err:any){
        throw new Error(err);
    }
}