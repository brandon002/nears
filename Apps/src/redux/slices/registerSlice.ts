import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { register } from '../../apis/authApi'

interface UserData {
    user: any;
    loading: boolean;
    error: boolean;
    token: any;
}
const initialState = {
    token: null,
    user: {},
    loading: false,
    error: false
} as UserData;

export const registerUser = createAsyncThunk(
    'http://localhost:5000/api/users/register',
    async (userData: any, thunkAPI) => {
        try {
            const response: any = await register(userData)
            return response
        } catch (error) {
            console.log(thunkAPI);
            return thunkAPI.rejectWithValue("Register Failed");
        }
    }
)
export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.loading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.user = JSON.parse(action.payload.config.data);
            window.location.href = "./#/login";
        }).addCase(registerUser.rejected, (state, action) => {
            state.error = true;
            state.loading = false;
        })
    },
})

export default registerSlice.reducer;