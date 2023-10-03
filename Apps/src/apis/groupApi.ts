import axios from "axios";
const API_URL = "https://api-nears.onrender.com/api/users";
// const API_URL = "http://localhost:5000/api/users";
const token: any = localStorage.getItem('jwtToken')
var headers = { 'Authorization': token };

export const createGroup = async (config:any) => {
    try{
        const formData = new FormData();
        formData.set('groupPicture', config.image);
        formData.set('name', config.name);
        formData.set('description', config.description);
        formData.set('rules', config.rules);
        formData.set('interests', config.interests);
        formData.set('skills', config.skills);
        formData.set('groupRestriction', JSON.stringify(config.groupRestriction));
        console.log(config.groupRestriction)
        const response: any = await axios.post(`${API_URL}/group`, formData, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const joinGroup = async (config:any) => {
    try{
        const data = {'groupId': config};
        const response: any = await axios.post(`${API_URL}/membership`, data, {headers})
        return response.data
    } catch(err: any){
        throw new Error(err);
    }
}
export const getGroupList = async(configs:any) => {
    let configString:string[]=[];
    for(let config in configs){
        configString.push(config+"="+configs[config]);
    }
    try{
        const response: any = await axios.get(`${API_URL}/groups?${configString.join("&")}`, {headers})
        return response.data
    } catch(err:any){
        throw new Error(err);
    }
}
export const getGroupDetail= async(configs:any)=>{
    let configString:string[]=[];
    for(let config in configs){
        configString.push(config+"="+configs[config]);
    }
    try{
        const response: any = await axios.get(`${API_URL}/group?${configString.join("&")}`, {headers})
        return response.data
    } catch(err:any){
        throw new Error(err);
    }
}