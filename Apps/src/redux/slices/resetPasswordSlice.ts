import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { resetPassword } from '../../apis/authApi';
interface resetPasswordState {
    loading: boolean;
    message: any;
    runned:boolean,
    validationMessage: any;
    success: boolean;
}
const initialState = {
    loading: false,
    message: "",
    runned:false,
    validationMessage: null,
    success: false
} as resetPasswordState;
export const resetPasswordThrunk = createAsyncThunk(
    `http://localhost:5000/api/users/reset-password`,
    async (forgotPasswordValue: any, thunkAPI) => {
        console.log(forgotPasswordValue);
        try {
            const response: any = await resetPassword(forgotPasswordValue)
            return response
        } catch (error: any) {
            console.log( error.response);
            return thunkAPI.rejectWithValue({ validationMessage: error.response.data.validationMessage, message: error.response.data.message });

        }
    }
)
export const forgotPasswordSlice = createSlice({
    name: 'reset-password',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(resetPasswordThrunk.pending, (state, action) => {
            state.loading = true;state.runned=true;
        }).addCase(resetPasswordThrunk.fulfilled, (state, action) => {
            state.success = true;
            state.message = action.payload.message;
            state.loading = false;
            if(localStorage.getItem("jwtToken") === null ){
                window.location.replace("/login");
            }
        }).addCase(resetPasswordThrunk.rejected, (state, action: any) => {
            state.success = false;
            state.message = action.payload.message;
            state.validationMessage = action.payload.validationMessage;
            state.loading = false;
        })
    },
})

export default forgotPasswordSlice.reducer;