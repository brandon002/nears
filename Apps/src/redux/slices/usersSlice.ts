import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getProfile, editProfile, getInterest, getSkill, editInterest, editSkill, getResetToken, uploadPicUser, getUsers, getUserDetail } from "../../apis/profileApi";

// const API_URL = "http://localhost:5000/api/users";
interface UserProfile {
    loadingGetUsers: boolean;
    users: any;
    errorGetUsers: boolean;
}
const initialState = {
    users: {},
    loadingGetUsers: false,
    errorGetUsers: false
} as UserProfile;

export const getUsersAction = createAsyncThunk(
    `/get-users`,
    async (config:any, thunkAPI: any) => {
        try{
            const response: any = await getUsers(config);
            return response;
        } catch (err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const getUserDetailAction = createAsyncThunk(
    `/get-user/detail`,
    async (id:any, thunkAPI: any) => {
        try{
            const response:any = await getUserDetail(id);
            console.log(response)
            return response;
        } catch (err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const usersSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        remember: (state) => {

        },
        logout: (state) => {

        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getUsersAction.pending, (state, action) => {
            state.loadingGetUsers = true;
        })
        .addCase(getUsersAction.fulfilled, (state, action) => {
            state.users = action.payload;
            state.loadingGetUsers = false;
            state.errorGetUsers = false;
        })
        .addCase(getUsersAction.rejected, (state, action) => {
            state.loadingGetUsers = false;
            state.errorGetUsers = true;
        })
    },
    
})

export default usersSlice.reducer;