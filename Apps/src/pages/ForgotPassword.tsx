import { useState } from "react";
import logo from "../assets/logo.png";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { requestForgotPassword } from "../redux/slices/forgotPasswordSlice";
import { Console } from "console";


const ForgotPassword = (prop: any) => {
    const [emailValue, setEmailValue] = useState("");
    // useSelector((state: any) =>console.log( state.forgotPassword));
    let stateOfForgotPassword = useSelector((state: any) => state.forgotPassword)
        ;
    const updateEmail = (event: any) => {
        setEmailValue(event.target!.value);
    }
    const dispatch = useDispatch<any>()
    const handleForgotPassword = () => {
        dispatch(requestForgotPassword(emailValue));
    };
    return (
        <div className="flex h-screen bg-purple tracking-[0.05em]">
            <div className="flex justify-center w-full">
                <div className="flex flex-col items-center justify-center w-1/4 h-screen">
                    <img className="w-1/3 mb-3" src={logo} alt="logo" />
                    <div className="flex flex-col w-11/12 bg-white px-7 py-9">
                        <span className="text-2xl font-semibold">Forgot Password</span>
                        <div className="bg-line h-px w-full mt-2.5 mb-4" />
                        <form>
                            <div className="mb-5">
                                <span className="text-xs">Email</span>
                            <div className="flex items-center py-2 border-b border-teal-500">
                                <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
                                    placeholder="Your Email" type="text" name="email" onChange={updateEmail} />
                            </div>
                            </div>
                            {
                                stateOfForgotPassword.runned ?
                                    stateOfForgotPassword.loading ?
                                        <div >
                                            loading...
                                        </div>
                                        :
                                        <span className={stateOfForgotPassword.success ? "text-green-500" : "text-red-500"}>
                                            {stateOfForgotPassword.message}
                                        </span>
                                    : ""
                            }
                            <div className="mt-4 mb-4">
                                <button className="w-full h-10 text-base text-white bg-button" type="button" onClick={handleForgotPassword} value="Forgot password" >
                                    Reset Password
                                </button>
                            </div>
                            <a className="text-sm font-bold tracking-tight text-link" href="/login" >Login now</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default (ForgotPassword);
