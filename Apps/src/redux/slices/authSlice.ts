import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login } from '../../apis/authApi'
import authToken from '../../utils/authToken';
import jwt_decode from 'jwt-decode';

import { AxiosResponse } from 'axios';
interface UserState {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    token: any;
    apiMessage:string
}
const initialState = {
    isAuthenticated: false,
    token: null,
    user: {},
    loading: false,
    apiMessage:""
} as UserState;

export const loginUser = createAsyncThunk(
    'http://localhost:5000/api/users/login',
    async (userData: any, thunkAPI) => {
        try {
            const response: AxiosResponse = await login(userData)
            const { token } = response.data;
            if (response.status==202){
                return  {isVerified:false,message:  response.data.message}
            }
            localStorage.setItem("jwtToken", token);
            authToken(token);
            const decoded = jwt_decode(token);
            return {isVerified:true,user: decoded};
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue("Login Failed");
        }
    }
)   

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        remember: (state) => {
            state.loading = true;
            const token = localStorage.jwtToken;
            state.token = token;
            authToken(token);
            const decoded: any = jwt_decode(token);
            state.user = decoded;
            state.isAuthenticated = true;
            const currentTime = Date.now() / 1000; 
            if (decoded.exp < currentTime) {
                state.token = null;
                state.isAuthenticated = false;
                state.user = {};
                localStorage.removeItem('jwtToken');
                window.location.href = "./#/login";
            }
        },
        logout: (state) => {
            state.loading = true;
            state.user = {};
            state.isAuthenticated=false;
            state.token = null;
            localStorage.removeItem('jwtToken');
            window.location.href = "./#/login";
        }
    },
    extraReducers: (builder) => { 
        builder.addCase(loginUser.pending, (state, action) => {
            state.loading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.token = localStorage.getItem('jwtToken')
            if(action.payload.isVerified){
            state.user = action.payload.user;
            window.location.href =  "./#/profile";}
            else{
                state.apiMessage= action.payload.message
            }
        }).addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
        })
    },
    
})
export const { remember, logout } = loginSlice.actions
export default loginSlice.reducer;