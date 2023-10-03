import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getLeaderBoard } from './../../apis/leaderBoardApi';

// const API_URL = "http://localhost:5000/api/users";
interface LeaderBoardI {
    loadingGetLeaderboard: boolean;
    leaderboard: any;
    errorGetLeaderboard: boolean;
}
const initialState = {
    leaderboard: {},
    loadingGetLeaderboard: false,
    errorGetLeaderboard: false
} as LeaderBoardI;

export const getLeaderBoardAction = createAsyncThunk(
    `/get-leaderboard`,
    async (config:any, thunkAPI: any) => {
        try{
            const response: any = await getLeaderBoard(config);
            return response;
        } catch (err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const leaderBoardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        remember: (state) => {

        },
        logout: (state) => {

        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getLeaderBoardAction.pending, (state, action) => {
            state.loadingGetLeaderboard = true;
        })
        .addCase(getLeaderBoardAction.fulfilled, (state, action) => {
            state.leaderboard = action.payload;
            state.loadingGetLeaderboard = false;
            state.errorGetLeaderboard = false;
        })
        .addCase(getLeaderBoardAction.rejected, (state, action) => {
            state.loadingGetLeaderboard = false;
            state.errorGetLeaderboard = true;
        })
    },
    
})

export default leaderBoardSlice.reducer;