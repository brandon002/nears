import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { loginUser } from "../redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"
const Login = (props: any) => {
    const log = useSelector((state: any) => state.login);
    const dispatch = useDispatch<any>();
    const [click, setClick] = useState(false);
    const [captchaClick, setCaptchaClick] = useState(false);
    const captchaRef = useRef<any>(null);
    const [error, setError] = useState({
        condition: false,
        email: false,
        password: false
    })
    const [configLogin, setConfigLogin] = useState<any>({
        email: '',
        password: ''
    })
    function handleChange(inputs:any){
        setConfigLogin((prev:any)=>({
            ...prev,
            [inputs.target.name]: inputs.target.value,
        }))
    }
    function handleLogin(e:any){
        e?.preventDefault();
        setClick(true)
        if(configLogin.email.length <= 0){
            setError((prev:any)=> ({
                ...prev,
                condition: true,
                email: true
            }))
        } else if(configLogin.password.length < 6 || configLogin.password.length > 25){
            setError((prev:any)=> ({
                ...prev,
                condition: true,
                password: true
            }))
        } else if(!captchaClick){
            alert("Please verify if you are a human!")
        } else {
            setTimeout(()=>{
                dispatch(loginUser({value: configLogin, captcha: captchaRef.current.getValue()}));
            }, 1)
            setError((prev:any)=> ({
                ...prev,
                condition: false,
                email: false,
                password: false
            }))
        }
        setTimeout(()=>{
            captchaRef?.current?.reset();
        }, 2)
    }
    return(
        <div className="flex h-screen bg-purple tracking-[0.05em]">
            <div className="flex justify-center w-full">
                <div className="flex flex-col items-center justify-center w-1/4 h-screen">   
                   <img className="w-1/3 mb-3" src={logo} alt = "logo" />
                   <div className="flex flex-col w-11/12 bg-white px-7 py-9">
                        <span className="text-2xl font-semibold">Hi, Welcome Back!</span>
                        <div className="bg-line h-px w-full mt-2.5 mb-4"/>
                        <form onSubmit={(e:any)=>handleLogin(e)}>
                            <div className="mb-5">
                                {!log.loading && !log.isAuthenticated && click && !error.condition &&
                                    <span className="flex items-center mt-1 ml-1 text-sm font-medium tracking-wide text-red">
                                        Invalid email address or user doesn't exists!
                                    </span>
                                }
                                {log.apiMessage?
                                    <span className="flex items-center mt-1 ml-1 text-sm font-medium tracking-wide text-red">
                                       {log.apiMessage}
                                    </span>:<></>
                                }
                                <span className="text-xs">Email Address</span>
                                <div className="flex items-center py-2 border-b">
                                    <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none" 
                                    placeholder="Your Email" 
                                    value={configLogin.email}
                                    name={'email'}
                                    onChange={(e)=>handleChange(e)}
                                    type="text" />
                                </div>
                                {error.email && 
                                    <span className="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red">
                                        Invalid email !
                                    </span>
                                }
                            </div>
                            <div className="mb-5">
                                <span className="text-xs">Password</span>
                                <div className="flex items-center py-2 border-b">
                                    <input className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none" 
                                    placeholder="password"
                                    value={configLogin.password}
                                    name={'password'}
                                    onChange={(e)=>handleChange(e)}
                                    type="password" />
                                </div>
                                {error.password && 
                                    <span className="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red">
                                        Password at least 6 characters !
                                    </span>
                                }
                                
                            </div>
                            <a className="text-sm font-bold tracking-tight text-link" href="/forgot-password" >Forgot Password?</a>
                            <div className="mt-4 mb-4">
                                <ReCAPTCHA
                                    sitekey={'6LeE4asmAAAAAHjXzglgi2Ad-Bnct_EtVyPGOG_o'} 
                                    onChange={()=> setCaptchaClick(true)}
                                    ref={captchaRef}
                                />
                                <button type="submit" className="w-full h-10 mt-2 text-base text-white bg-button">
                                    Sign In
                                </button>
                            </div>
                            <span className="text-sm tracking-tight">Don't have an account? </span>
                            <Link className="text-sm font-bold tracking-tight text-link" to={"/register"}>Register Here</Link>
                        </form>
                        
                   </div>
                </div>
            </div>
        </div>
    )
}

export default Login;