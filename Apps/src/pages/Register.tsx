import { useState } from "react";
import logo from "../assets/logo.png";
import { registerUser } from "../redux/slices/registerSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const Register = (props: any) => {
    const dispatch = useDispatch<any>()
    const [configRegister, setConfigRegister] = useState<any>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: 0
    })
    function handleChange(inputs:any){
        setConfigRegister((prev:any)=>({
            ...prev,
            [inputs.target.name]: 
                inputs.target.type === 'checkbox'
                ? inputs.target.checked
                : inputs.target.value
        }) )
    }
    function handleRegister(){
        dispatch(registerUser(configRegister));
    }
    return(
        <div className="flex h-screen bg-purple tracking-[0.05em]">
            <div className="flex justify-center w-full">
                <div className="flex flex-col items-center justify-center w-1/4 h-screen">   
                   <img className="w-1/3 mb-3" src={logo} alt = "logo" />
                   <div className="flex flex-col w-11/12 bg-white px-7 py-9">
                        <span className="text-2xl font-semibold">Create an Account</span>
                        <div className="bg-line h-px w-full mt-2.5 mb-4"/>
                        <form>
                            <div className="mb-5">
                                <span className="text-xs" >Name</span>
                                <div className="flex items-center py-2 border-b border-teal-500">
                                    <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none" 
                                    placeholder="Your Name" 
                                    value={configRegister.name}
                                    name={'name'}
                                    onChange={(e)=>handleChange(e)}
                                    type="text" />
                                </div>
                            </div>
                            <div className="mb-5">
                                <span className="text-xs">Email Address</span>
                                <div className="flex items-center py-2 border-b border-teal-500">
                                    <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none" 
                                    placeholder="Your Email"
                                    value={configRegister.email}
                                    name={'email'}
                                    onChange={(e)=>handleChange(e)}
                                    type="email" />
                                </div>
                            </div>
                            <div className="mb-5">
                                <span className="text-xs">Password</span>
                                <div className="flex items-center py-2 border-b border-teal-500">
                                    <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none" 
                                    placeholder="Password"
                                    value={configRegister.password}
                                    name={'password'}
                                    onChange={(e)=>handleChange(e)} 
                                    type="password" />
                                </div>
                            </div>
                            <div className="mb-5">
                                <span className="text-xs">Confirm Password</span>
                                <div className="flex items-center py-2 border-b border-teal-500">
                                    <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none" 
                                    placeholder="Repeat Password"
                                    value={configRegister.confirmPassword}
                                    name={'confirmPassword'}
                                    onChange={(e)=>handleChange(e)} 
                                    type="password" />
                                </div>
                            </div>  
                            <div className="mb-3">
                                <div className="flex items-center ml-2">
                                    <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    type="checkbox" 
                                    name="agree" 
                                    value={configRegister.agree}
                                    onChange={(e)=>handleChange(e)} 
                                    />
                                    <label className="w-full py-1 ml-2 text-xs font-bold tracking-tighter">I agree to the term and conditions</label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <button onClick={handleRegister} type="button" className="w-full h-10 text-base text-white bg-button">
                                    Register
                                </button>
                            </div>
                            <span className="text-sm tracking-tight">Already have an account? </span>
                            <Link className="text-sm font-bold tracking-tight text-link" to={'/login'} >Login now</Link>
                        </form>
                        
                   </div>
                </div>
            </div>
        </div>
    )
}

export default Register;