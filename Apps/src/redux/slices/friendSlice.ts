import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addFriend, removeFriend, getRequest, getRequestReceived, acceptRequest, getFriend } from "../../apis/friendApi";

interface FriendInterface{
    getFriendsLoading: boolean;
    getFriendsError: boolean;
    friends: any;
    getFriendsRequestLoading: boolean;
    getFriendsRequestError: boolean;
    friendRequests: any;
    addFriendLoading: any;
    removeFriendLoading: any;
    getFriendLoading: boolean;
    friendList: any;
    errorGetFriend: boolean;
    errorGetRequestReceived: boolean;
    loadingGetRequestReceived: boolean;
    requestReceived: any;
}
const initialState = {
    getFriendsLoading: false,
    getFriendsError: false,
    friends: [],
    getFriendsRequestLoading: false,
    getFriendsRequestError: false,
    friendRequests: [],
    addFriendLoading: false,
    removeFriendLoading: false,
    errorGetRequestReceived: false,
    loadingGetRequestReceived: false,
    requestReceived: []
} as FriendInterface;

export const acceptFriendAction = createAsyncThunk(
    `/accept-friend-request`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await acceptRequest(id);
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const getFriendAction = createAsyncThunk(
    `/get-friend`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await getFriend(id);
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const addFriendAction = createAsyncThunk(
    `/add-friend-request`,
    async (id:any, thunkAPI:any) => {
        try{
            const response: any = await addFriend(id);
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const removeFriendAction = createAsyncThunk(
    `/remove-friend-request`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await removeFriend(id);
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const getRequestAction = createAsyncThunk(
    `/get-request`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await getRequest();
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const getRequestReceivedAction = createAsyncThunk(
    `/get-request-received`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await getRequestReceived();
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getRequestAction.pending, (state, action) => {
            state.getFriendsRequestLoading = true;
        })
        .addCase(getRequestAction.fulfilled, (state, action) => {
            state.getFriendsRequestLoading = false;
            state.friendRequests = action.payload;
            state.getFriendsRequestError = false;
        })
        .addCase(getRequestAction.rejected, (state, action)=> {
            state.getFriendsRequestError = true;
            state.getFriendsRequestLoading = false;
            state.friendRequests = []
        })
        .addCase(addFriendAction.pending, (state, action) => {
            state.addFriendLoading = true;
        })
        .addCase(addFriendAction.fulfilled, (state, action) => {
            state.addFriendLoading = false;
        })
        .addCase(addFriendAction.rejected, (state, action) => {
            state.addFriendLoading = false;
        })
        .addCase(removeFriendAction.pending, (state, action) => {
            state.removeFriendLoading = true;
        })
        .addCase(removeFriendAction.fulfilled, (state, action) => {
            state.removeFriendLoading = false;
        })
        .addCase(removeFriendAction.rejected, (state, action) => {
            state.removeFriendLoading = false;
        }).addCase(getFriendAction.pending, (state, action) => {
            state.getFriendLoading = true;
        })
        .addCase(getFriendAction.fulfilled, (state, action) => {
            state.getFriendLoading = false;
            state.friendList = action.payload;
            state.errorGetFriend = false;
        })
        .addCase(getFriendAction.rejected, (state, action) => {
            state.getFriendLoading = false;
            state.errorGetFriend = true;
        }).addCase(getRequestReceivedAction.pending, (state, action) => {
            state.loadingGetRequestReceived = true;
        })
        .addCase(getRequestReceivedAction.fulfilled, (state, action) => {
            state.loadingGetRequestReceived = false;
            state.requestReceived = action.payload;
            state.errorGetRequestReceived = false;
        })
        .addCase(getRequestReceivedAction.rejected, (state, action) => {
            state.loadingGetRequestReceived = false;
            state.errorGetRequestReceived = true;
        })
    },
})
export default friendSlice.reducer;