import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { requestForgotPassword } from "../redux/slices/forgotPasswordSlice";
import { Console } from "console";
import { resetPasswordThrunk } from "../redux/slices/resetPasswordSlice";
import { useLocation } from "react-router-dom";


const ResetPassword = (prop: any) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("resetToken");
    const email = queryParams.get("email");
    const [passwordConfig, setEmailValue] = useState({ password: "", confirmPassword: "", email: email, resetToken: resetToken });
    let resetPasswordState = useSelector((state: any) => state.resetPassword);
    const updateEmail = (inputs: any) => {
        setEmailValue((prev: any) => ({
            ...prev,
            [inputs.target.name]: inputs.target.value,
        }))
    }
    const dispatch = useDispatch<any>()
    const handleForgotPassword = () => {
        dispatch(resetPasswordThrunk(passwordConfig));
    };

    return (
        <div className="flex h-screen bg-purple tracking-[0.05em]">
            <div className="flex w-full justify-center">
                <div className="flex flex-col w-1/4 h-screen items-center justify-center">
                    <img className="w-1/3 mb-3" src={logo} alt="logo" />
                    <div className="flex flex-col w-11/12 px-7 py-9 bg-white">
                        <span className="font-semibold text-2xl">Reset Password</span>
                        <div className="bg-line h-px w-full mt-2.5 mb-4" />
                        <form>
                            <div className="mb-5">
                                <input type="hidden" name={"resetToken"} value={resetToken != null ? resetToken : ""} />

                                <input type="hidden" name={"email"} value={email != null ? email : ""} />
                                <div className="flex items-center border-b border-teal-500 py-2">
                                    <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none"
                                        placeholder="Password" type="password" name={'password'} onChange={updateEmail} />
                                </div>
                                {
                                    resetPasswordState.validationMessage != null &&resetPasswordState.validationMessage.hasOwnProperty("password")?
                                        <div>{resetPasswordState.validationMessage.password}</div> : ""
                                }
                                <div>{ resetPasswordState.validationMessage != null &&resetPasswordState.validationMessage.hasOwnProperty("password")}</div>
                                <div className="flex items-center border-b border-teal-500 py-2">
                                    <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none"
                                        placeholder="Confim Password" type="password" name={'confirmPassword'} onChange={updateEmail} />
                                </div>
                                {
                                    resetPasswordState.validationMessage != null &&resetPasswordState.validationMessage.hasOwnProperty("confirmPassword")?
                                        <div>{resetPasswordState.validationMessage.confirmPassword}</div> : ""
                                }
                                {
                                    resetPasswordState.runned ?
                                        resetPasswordState.loading ?
                                            <div >
                                                loading...
                                            </div>
                                            :
                                            <span className={resetPasswordState.success ? "text-green-500" : "text-red-500"}>
                                                {resetPasswordState.message}
                                            </span>
                                        : ""
                                }
                                <button className="bg-button text-white text-base w-full h-10" type="button" onClick={handleForgotPassword} value="Forgot password" >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default (ResetPassword);
