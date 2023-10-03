import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createMeeting, getMeetingList } from '../../apis/meetingApi';

interface MeetingInterface{
    createMeetingLoading: boolean;
    createMeetingError: boolean;
    getMeetingListLoading: boolean;
    getMeetingListError: boolean;
    meetingList: any;
}
const initialState = {
    createMeetingLoading: false,
    createMeetingError: false,
    getMeetingListLoading: false,
    getMeetingListError: false,
    meetingList: []
} as MeetingInterface;

export const createMeetingAction = createAsyncThunk(
    `/create-meeting`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await createMeeting(id);
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const getMeetingListAction = createAsyncThunk(
    `/get-meeting-list`,
    async (id: any, thunkAPI: any) => {
        try{
            const response: any = await getMeetingList(id);
            return response;
        } catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const meetingSlice = createSlice({
    name: 'friend',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(createMeetingAction.pending, (state, action) => {
            state.createMeetingLoading = true;
        })
        .addCase(createMeetingAction.fulfilled, (state, action) => {
            state.createMeetingLoading = false;
            state.createMeetingError = false;
        })
        .addCase(createMeetingAction.rejected, (state, action)=> {
            state.createMeetingError = true;
            state.createMeetingLoading = false;
        }).addCase(getMeetingListAction.pending, (state, action) => {
            state.getMeetingListLoading = true;
        })
        .addCase(getMeetingListAction.fulfilled, (state, action) => {
            state.getMeetingListLoading = false;
            state.getMeetingListError = false;
            state.meetingList = action.payload;
        })
        .addCase(getMeetingListAction.rejected, (state, action)=> {
            state.getMeetingListError = true;
            state.getMeetingListLoading = false;
        })
    },
})
export default meetingSlice.reducer;