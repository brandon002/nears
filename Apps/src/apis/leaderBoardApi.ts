import axios from "axios";
// const API_URL = "https://api-nears.onrender.com/api/users";
const API_URL = "http://localhost:5000/api/users";
const token: any = localStorage.getItem('jwtToken')
const headers = { 'Authorization': token };

export const getLeaderBoard = async(configs: any) => {
    let configString: string[] = [];
    for (let config in configs) {
        configString.push(config + "=" + configs[config]);
    }
    try {
        const response: any = await axios.get(`${API_URL}/leaderboard?${configString.join("&")}`, { headers })
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
}