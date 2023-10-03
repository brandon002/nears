import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createGroup, getGroupDetail, getGroupList, joinGroup } from "../../apis/groupApi";

interface GroupState {
    createGroup: any;
    loadingCreateGroup: boolean;
    errorCreateGroup: boolean;
    groupList: any;
    groupDetail: any;
    loadingGetGroupList: boolean;
    errorGetGroupList: boolean;
    userGroupList: any;
    getUserGroupListLoading: any;
    errorGetUserGroupList: any;
    joinGroupLoading: any;
}
const initialState = {
    createGroup: [],
    loadingCreateGroup: false,
    errorCreateGroup: false,
    groupList: [],
    groupDetail: {
        name: "?",
        description: "?",
        rules: [],
        interests: ["?"],
        skills: ["?"]
    },
    loadingGetGroupList: false,
    errorGetGroupList: false,
    userGroupList: [],
    getUserGroupListLoading: false,
    errorGetUserGroupList: false,
    joinGroupLoading: false
} as GroupState;
export const createGroupAction: any = createAsyncThunk(
    `/create-group`,
    async (config: any, thunkAPI: any) => {
        try {
            const response: any = await createGroup(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const joinGroupAction: any = createAsyncThunk(
    `/join-group`,
    async (config:any, thunkAPI: any) => {
        try{
            const response: any = await joinGroup(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const getGroupListAction: any = createAsyncThunk(
    `/get-group`,
    async (config: any, thunkAPI: any) => {
        try {
            const response: any = await getGroupList(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const getUserGroupListAction: any = createAsyncThunk(
    `/get-group-user`,
    async (config: any, thunkAPI: any) => {
        try {
            const response: any = await getGroupList(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const getGroupDetailAction: any = createAsyncThunk(
    `/get-group-detail`,
    async (config: any, thunkAPI: any) => {
        try {
            const response: any = await getGroupDetail(config);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const groupSlice: any = createSlice({
    name: 'group',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(createGroupAction.pending, (state, action) => {
            state.loadingCreateGroup = true;
        }).addCase(createGroupAction.fulfilled, (state, action) => {
            state.loadingCreateGroup = false;
            state.createGroup = action.payload;
            state.errorCreateGroup = false;
        }).addCase(createGroupAction.rejected, (state, action) => {
            state.loadingCreateGroup = false;
            state.errorCreateGroup = true;
        }).addCase(getGroupListAction.pending, (state, action) => {
            state.loadingGetGroupList = true;
        }).addCase(getGroupListAction.fulfilled, (state, action) => {
            state.loadingGetGroupList = false;
            state.groupList = action.payload;
            state.errorGetGroupList = false;
        }).addCase(getGroupListAction.rejected, (state, action) => {
            state.loadingGetGroupList = false;
            state.errorGetGroupList = true;
        }).addCase(getUserGroupListAction.pending, (state, action) => {
            state.getUserGroupListLoading = true;
        }).addCase(getUserGroupListAction.fulfilled, (state, action) => {
            state.getUserGroupListLoading = false;
            state.userGroupList = action.payload;
            state.errorGetUserGroupList = false;
        }).addCase(getUserGroupListAction.rejected, (state, action) => {
            state.getUserGroupListLoading = false;
            state.errorGetUserGroupList = true;
        }).addCase(getGroupDetailAction.pending, (state, action) => {
            state.loadingGetGroupList = true;
        }).addCase(getGroupDetailAction.fulfilled, (state, action) => {
            state.loadingGetGroupList = false;
            state.groupDetail = action.payload.group;
            state.errorGetGroupList = false;
        }).addCase(getGroupDetailAction.rejected, (state, action) => {
            state.loadingGetGroupList = false;
            state.errorGetGroupList = true;
        }).addCase(joinGroupAction.pending, (state, action) => {
            state.joinGroupLoading = true;
        }).addCase(joinGroupAction.fulfilled, (state, action) => {
            state.joinGroupLoading = false;
        }).addCase(joinGroupAction.rejected, (state, action) => {
            state.joinGroupLoading = false;
        })
    },
})

export default groupSlice.reducer;