import axios from "axios";
const API_URL = "http://localhost:5000/api/users";
// const API_URL = "https://api-nears.onrender.com/api/users";
const headers = { 'Access-Control-Allow-Origin': '*' };
export const register = async (userData: any) => {
  try {
    const response: any = await axios.post(`${API_URL}/register`, userData, {headers});
    return response;

  } catch (err: any) {
    throw new Error(err);
  }
}

export const login = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {headers});
    return response;
  } catch (err: any) {
    throw new Error(err);
  }
};
export const forgotPassword = async (emailValue:any) => {
  try {
    const response = axios.post(`${API_URL}/forgot-password`,  {email: emailValue}, {headers} );
    return response;
  } catch (err: any) {
    throw (err);
  }

}
export const resetPassword = async (resetPassword: any) => {
  try {
    const response = axios.post(`${API_URL}/reset-password`,resetPassword, {headers});
    return response;
  } catch (err: any) {
    throw (err);
  }

}

export const verifiedEmail = async (verifiedData: any) => {
  try {
    const response =await axios.post(`${API_URL}/verified`,verifiedData);
    return response;
  } catch (err: any) {
    throw (err);
  }

}