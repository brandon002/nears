import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { forgotPassword } from '../../apis/authApi';
interface forgotPassworState {
    loading: boolean;
    message: any;
    runned:boolean
    success: boolean;
}
const initialState = {
    loading: false,
   message: "",
   runned:false,
    success:false
} as forgotPassworState;
export const requestForgotPassword = createAsyncThunk(
    `http://localhost:5000/api/users/forgot-password`,
    async (forgotPasswordValue: any, thunkAPI) => {
        try {
            const response: any = await forgotPassword(forgotPasswordValue)
            return response
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
export const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder.addCase(requestForgotPassword.pending, (state, action) => {
            state.loading = true;
            state.runned=true;
        }).addCase(requestForgotPassword.fulfilled, (state, action) => {
            state.success = true;
            console.log(action.payload);
            state.message = action.payload.data.message;
            state.loading = false;
        }).addCase(requestForgotPassword.rejected, (state, action) => {
            if(action.payload!=null)
            state.message = action.payload;
            else
            state.message ="Unknown Error";
            state.loading = false;
        })
    },
})

export default forgotPasswordSlice.reducer;