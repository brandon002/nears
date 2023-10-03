import axios from "axios";
const API_URL = "https://api-nears.onrender.com/api/users";
// const API_URL = "http://localhost:5000/api/users";
const token: any = localStorage.getItem('jwtToken')
const headers = { 'Authorization': token };

export const insertForum = async (config: any) => {
    try {
        const formData = new FormData();
        formData.set('image', config.image);
        formData.set('description', config.description);
        formData.set('title', config.title)
        formData.set('skillinterestId', config.skillInterestId)
        if (config.groupId != null) {
            formData.set('groupId', config.groupId)
        }
        const response: any = await axios.post(`${API_URL}/thread`, formData, { headers })
        return response.data
    } catch (err: any) {
        throw new Error(err);
    }
}
export const getThreadList = async (configs: any) => {
    let configString: string[] = [];
    for (let config in configs) {
        configString.push(config + "=" + configs[config]);
    }
    try {
        const response: any = await axios.get(`${API_URL}/threads?${configString.join("&")}`, { headers })
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
export const getThreadDetail = async (id: any) => {

    try {
        const response: any = await axios.get(`${API_URL}/thread?id=${id}`, { headers })
        return response.data
    } catch (err: any) {
        throw new Error(err);
    }
}
export const getThreadComment = async (configs: any) => {
    let configString: string[] = [];
    for (let config in configs) {
        configString.push(config + "=" + configs[config]);
    }
    try {
        const response: any = await axios.get(`${API_URL}/comments?${configString.join("&")}`, { headers })
        return response.data
    } catch (err: any) {
        throw new Error(err);
    }
}
export const likeThread = async (config: any) => {
    try {
        const response: any = await axios.post(`${API_URL}/like`, config, { headers })
        return response.data
    } catch (err: any) {
        throw new Error(err);
    }
}
export const dislikeThread = async (config: any) => {
    try {
        const response: any = await axios.post(`${API_URL}/dislike`, config, { headers })
        return response.data
    } catch (err: any) {
        throw new Error(err);
    }
}
export const insertComment = async (config: any) => {
    try {
        const response: any = await axios.post(`${API_URL}/comment`, config, { headers })
        return response.data
    } catch (err: any) {
        throw new Error(err);
    }
}