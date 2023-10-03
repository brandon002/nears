import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { insertForum, likeThread, insertComment, getThreadList, getThreadDetail, getThreadComment, dislikeThread } from "../../apis/forumApi";

interface ForumState {
    forums: any,
    comments: any,
    forumsDetailLoading: boolean,
    forumsDetailSuccess: boolean,
    forumsLike: any,
    forumsReply: any,
    loading: boolean,
    insertLoading: boolean,
    insertSuccess: boolean,
    likeSuccess: boolean,
    message: any,
    page: number,
    runned: boolean,
    success: boolean;
    likeThreadStatus: any,
    dislikeThreadStatus: any,
    insertThreadStatus: any,
    commentThreadStatus:any
}
const initialState = {
    forums: [],
    comments: [],
    forumsDetailLoading: false,
    forumsDetailSuccess: false,
    loading: false,
    insertLoading: false,
    likeSuccess: false,
    runned: false,
    message: "",
    page: 0,
    insertSuccess: false,
    success: false,
    likeThreadStatus: {},
    dislikeThreadStatus: {},
    insertThreadStatus: {},
    commentThreadStatus: {}
} as ForumState;
export const getThreadListAction: any = createAsyncThunk(
    `/get-threads`,
    async (config: any, thunkAPI: any) => {
        try {
            const response: any = await getThreadList(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const getThreadAction = createAsyncThunk(
    `/get-thread`,
    async (config: any, thunkAPI: any) => {
        try {
            const response: any = await getThreadComment(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const insertThreadAction = createAsyncThunk(
    `/insert-thread`,
    async (threadContent: any, thunkAPI: any) => {
        try {
            const response: any = await insertForum(threadContent);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const likeThreadAction = createAsyncThunk(
    `/like-thread`,
    async (thread: any, thunkAPI: any) => {
        try {
            const response: any = await likeThread({ id: thread.id });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const dislikeThreadAction = createAsyncThunk(
    `/dislike-thread`,
    async (thread: any, thunkAPI: any) => {
        try {
            const response: any = await dislikeThread({ id: thread.id });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const commentThreadAction = createAsyncThunk(
    `/comment-thread`,
    async (commentContent: any, thunkAPI: any) => {
        try {
            const response: any = await insertComment(commentContent);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const forumSlice: any = createSlice({
    name: 'profile',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(insertThreadAction.pending, (state, action) => {
            state.insertLoading = true;
        }).addCase(insertThreadAction.fulfilled, (state, action) => {
            state.insertLoading = false;
            // state.forums = [action.payload.thread];
            state.insertThreadStatus = action.payload
            state.insertSuccess = true;
        }).addCase(insertThreadAction.rejected, (state, action) => {
            state.insertLoading = false;
            state.insertSuccess = false;
        }).addCase(likeThreadAction.pending, (state, action) => {
            state.loading = true;
        }).addCase(likeThreadAction.fulfilled, (state, thread) => {
            state.loading = false;
            console.log(thread.payload)
            state.likeThreadStatus = thread.payload
            if (!thread.payload.hasOwnProperty("threadId")) {
                let selected: any = state.forums[thread.payload.index];
                if (selected.userLike) selected.numberOfLikes--;
                else selected.numberOfLikes++;
                selected.userLike = !selected.userLike;
            }
            state.success = true;
        }).addCase(likeThreadAction.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        }).addCase(dislikeThreadAction.pending, (state, action) => {
            state.loading = true;
        }).addCase(dislikeThreadAction.fulfilled, (state, thread) => {
            state.loading = false;
            state.dislikeThreadStatus = thread.payload
            if (!thread.payload.hasOwnProperty("threadId")) {
                let selected: any = state.forums[thread.payload.index];
                if (selected.userLike) selected.numberOfLikes--;
                else selected.numberOfLikes++;
                selected.userLike = !selected.userLike;
            }
            state.success = true;
        }).addCase(dislikeThreadAction.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        }).addCase(commentThreadAction.pending, (state, action) => {
            state.loading = true;
        }).addCase(commentThreadAction.fulfilled, (state, action) => {
            console.log(action.payload)
            state.commentThreadStatus = action.payload
            state.loading = false;
            state.comments= [action.payload.comment];
            state.success = true;
        }).addCase(commentThreadAction.rejected, (state, action) => {
            state.loading = false;
            state.success = true;
        }).addCase(getThreadListAction.pending, (state, action) => {
            state.loading = true;
            state.forums = [];
        }).addCase(getThreadListAction.fulfilled, (state, action) => {
            state.loading = false;
            state.forums = action.payload.thread;
            if (action.payload.thread.length != 0)
                state.page++;
        }).addCase(getThreadListAction.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        }).addCase(getThreadAction.pending, (state, action) => {
            state.forumsDetailLoading = true;
            state.forumsDetailSuccess = false;
        }).addCase(getThreadAction.fulfilled, (state, action) => {
            state.forumsDetailLoading = false;
            state.forumsDetailSuccess = true;
            state.comments = [...action.payload.thread];
        }).addCase(getThreadAction.rejected, (state, action) => {
            state.forumsDetailLoading = false;
            state.forumsDetailSuccess = false;
        })
    },
})
export const groupForum= {...forumSlice}.reducer;
export default forumSlice.reducer;