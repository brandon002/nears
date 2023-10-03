import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getProfile, editProfile, getInterest, getSkill, editInterest, editSkill, getResetToken, uploadPicUser, getUsers, getUserDetail, getSkillInterest } from "../../apis/profileApi";

// const API_URL = "http://localhost:5000/api/users";
interface UserProfile {
    profile: any;
    loading: boolean;
    error: boolean;
    editPersonalLoading: boolean;
    editPersonalError: boolean;
    editSkillLoading: boolean;
    editInterestLoading: boolean;
    editSkillError: boolean;
    editInterestError: boolean;
    getSkillLoading: boolean;
    getSkillError: boolean;
    skill: any;
    getInterestLoading: boolean;
    getInterestError: boolean;
    interest: any;
    resetToken: any;
    loadingUploadPicUser: boolean;
    successUploadPicUser: boolean;
    errorUploadPicUser: boolean;
    loadingGetUsers: boolean;
    users: any;
    errorGetUsers: boolean;
    loadingGetUserDetail: boolean;
    userDetail: any;
    errorGetUserDetail: boolean;
    getSkillInterestLoading: boolean;
    skillInterest: any;
    getSkillInterestError: boolean;
}
const initialState = {
    profile: {},
    loading: false,
    error: false,
    editPersonalLoading: false,
    editPersonalError: false,
    editSkillLoading: false,
    editInterestLoading: false,
    editSkillError: false,
    editInterestError: false,
    getSkillLoading: false,
    getSkillError: false,
    skill: {},
    getInterestLoading: false,
    getInterestError: false,
    resetToken: '',
    interest: {},
    loadingUploadPicUser: false,
    successUploadPicUser: false,
    errorUploadPicUser: false,
    users: {},
    loadingGetUsers: false,
    errorGetUsers: false,
    loadingGetUserDetail: false,
    userDetail: [],
    errorGetUserDetail: false,
    getSkillInterestLoading: false,
    skillInterest: [],
    getSkillInterestError: false,
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
            return response;
        } catch (err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)
export const getProfileAction = createAsyncThunk(
    `/get-user`,
    async (token:any, thunkAPI: any) => {
        try {
            const response: any = await getProfile(token)
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)  
export const getResetTokenAction = createAsyncThunk(
    `/get-reset-token`,
    async (oldPassword:string, thunkAPI: any) => {
        try {
            const response: any = await getResetToken(oldPassword);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)  
export const editProfileAction = createAsyncThunk(
    `/edit-profile`,
    async (config:any, thunkAPI: any) => {
        try {
            const response: any = await editProfile(config)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)  
export const getInterestAction = createAsyncThunk(
    `/get-interests`,
    async (thunkAPI: any) => {
        try{
            const response: any = await getInterest();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const getSkillAction = createAsyncThunk(
    `/get-skills`,
    async (thunkAPI: any) => {
        try{
            const response: any = await getSkill();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const getSkillInterestAction = createAsyncThunk(
    `/get-skill-interest`,
    async (thunkAPI: any) => {
        try{
            const response: any = await getSkillInterest();
            return response
        }catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const editInterestAction = createAsyncThunk(
    `/edit-interests`,
    async (interests: any, thunkAPI: any) => {
        try{
            const response: any = await editInterest(interests);
            return response.data;
        } catch(error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const editSkillAction = createAsyncThunk(
    `/edit-skills`,
    async (skills: any, thunkAPI: any) => {
        try{
            const response: any = await editSkill(skills);
            return response.data;
        } catch(error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const uploadPicUserAction: any = createAsyncThunk(
    `/upload-picture`,
    async (image: any, thunkAPI: any) => {
        try{
            const response: any = await uploadPicUser(image);
            return response.data;
        } catch(error) {
            return thunkAPI.rejectWithValue("Something Went Wrong");
        }
    }
)
export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        remember: (state) => {

        },
        logout: (state) => {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProfileAction.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(getProfileAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.loading = false;
            state.error = false;
        })
        .addCase(getProfileAction.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
        })
        .addCase(editProfileAction.pending, (state, action) => {
            state.editPersonalLoading = true;
        })
        .addCase(editProfileAction.fulfilled, (state, action) => {
            state.editPersonalLoading = false;
            state.editPersonalError = false;
        })
        .addCase(editProfileAction.rejected, (state, action) => {
            state.editPersonalLoading = false;
            state.editPersonalError = true;
        })
        .addCase(getInterestAction.pending, (state, action) => {
            state.getInterestLoading = true;
        })
        .addCase(getInterestAction.fulfilled, (state, action) => {
            state.interest = action.payload;
            state.getInterestLoading = false;
            state.getInterestError = false;
        })
        .addCase(getInterestAction.rejected, (state, action) => {
            state.getInterestLoading = false;
            state.getInterestError = true;
        })
        .addCase(getSkillAction.pending, (state, action) => {
            state.getSkillLoading = true;
        })
        .addCase(getSkillAction.fulfilled, (state, action) => {
            state.skill = action.payload;
            state.getSkillLoading = false;
            state.getSkillError = false;
        })
        .addCase(getSkillAction.rejected, (state, action) => {
            state.getSkillLoading = false;
            state.getSkillError = true;
        })
        .addCase(getSkillInterestAction.pending, (state, action) => {
            state.getSkillInterestLoading = true;
        })
        .addCase(getSkillInterestAction.fulfilled, (state, action) => {
            state.skillInterest = action.payload;
            state.getSkillInterestLoading = false;
            state.getSkillInterestError = false;
        })
        .addCase(getSkillInterestAction.rejected, (state, action) => {
            state.getSkillInterestLoading = false;
            state.getSkillInterestError = true;
        })
        .addCase(editInterestAction.pending, (state, action) => {
            state.editInterestLoading = true;
        })
        .addCase(editInterestAction.fulfilled, (state, action) => {
            state.editInterestLoading = false;
            state.editInterestError = false;
        })
        .addCase(editInterestAction.rejected, (state, action) => {
            state.editInterestLoading = false;
            state.editInterestError = true;
        })
        .addCase(editSkillAction.pending, (state, action) => {
            state.editSkillLoading = true;
        })
        .addCase(editSkillAction.fulfilled, (state, action) => {
            state.editSkillLoading = false;
            state.editSkillError = false;
        })
        .addCase(editSkillAction.rejected, (state, action) => {
            state.editSkillLoading = false;
            state.editSkillError = true;
        })
        .addCase(getResetTokenAction.pending, (state, action) => {
           
        })
        .addCase(getResetTokenAction.fulfilled, (state, action) => {
           state.resetToken = action.payload;
        })
        .addCase(getResetTokenAction.rejected, (state, action) => {
        
        })
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
        }).addCase(getUserDetailAction.pending, (state, action) => {
            state.loadingGetUserDetail = true;
        })
        .addCase(getUserDetailAction.fulfilled, (state, action) => {
            state.userDetail = action.payload;
            state.loadingGetUserDetail = false;
            state.errorGetUsers = false;
        })
        .addCase(getUserDetailAction.rejected, (state, action) => {
            state.loadingGetUserDetail = false;
            state.errorGetUserDetail = true;
        })
    },
    
})

export const { remember, logout } = profileSlice.actions
export default profileSlice.reducer;