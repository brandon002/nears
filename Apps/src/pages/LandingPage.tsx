import { useEffect } from "react";
import { Navbar } from "../components";
import vidcall from "../assets/vidcall.svg"
import profile from "../assets/profilefea.svg"
import connection from "../assets/connectionfea.svg"
import forum from "../assets/FAQ.svg"
import ig from "../assets/ig.svg"
import mail from "../assets/mail.svg"
import phone from "../assets/phone.svg"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";

const LandingPage = (props: any) => {
    const navigate = useNavigate(); 

    useEffect(()=>{
        if(props.user.isAuthenticated) navigate("/profile");
    }, [props.user.isAuthenticated])
    return(
        <>
            <Navbar/>
            <div className="flex flex-col">
                <div className="flex items-center justify-center w-screen h-24 bg-blue-light2" >
                    <span className="mr-12 font-extrabold">Don’t have an account yet? </span>
                    <button onClick={()=> navigate('/register')} type="button" className="bg-blue-light3 text-white text-xs w-36 h-10 rounded font-bold">
                        Register Now
                    </button>
                </div>
                <div className="flex w-screen items-center justify-between mt-12 mb-56" id="home">
                    <img className="h-96 ml-60" src={vidcall} alt="vidcall" />
                    <div className="w-96 mr-60">
                        <span className="text-3xl font-bold">Keep connecteed anytime</span>
                        <p className="text-2xl">We provide platform for anyone who is looking for friends, connection, job, employee, or just having fun!</p>
                        <a href="#feature">
                            <button type="button" className="bg-blue-dark text-white text-xs w-36 h-8 rounded-xl font-bold p-0 mt-6">
                                Learn More
                            </button>
                        </a>
                  
                    </div>
                </div>
                <div className="flex w-screen mb-56" id="feature" >
                    <div className="flex flex-col w-screen justify-center" >
                        <p className="font-bold text-2xl self-center mb-16">Features</p>
                        <div className="flex flex-row self-center items-center justify-between w-4/5">
                            <div className="flex flex-col justify-center w-2/3 mx-8 text-center">
                                <img src={profile} alt="profile" className="h-48" />
                                <p className="font-bold">Custom Profile</p>
                                <p>Manage your profile about information you want others to know.</p>
                            </div>
                            <div className="flex flex-col justify-center w-2/3 mx-8 text-center">
                                <img src={connection} alt="connection" className="h-48" />
                                <p className="font-bold">Connection</p>
                                <p>Expand connection with the same hobby and interest.</p>
                            </div>
                            <div className="flex flex-col justify-center w-2/3 mx-8 text-center">
                                <img src={forum} alt="forum" className="h-48" />
                                <p className="font-bold">Forum</p>
                                <p>Share your experiences, ask a question with varied interest.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-screen mb-56" id="contact" >
                    <div className="flex flex-col w-screen justify-center" >
                        <p className="font-bold text-2xl self-center mb-16">Contact us</p>
                        <div className="flex flex-row self-center items-center justify-between w-4/5">
                            <div className="flex flex-col justify-center w-2/3 mx-8 text-center">
                                <img src={ig} alt="ig" className="h-36" />
                                <p className="font-bold">@nears</p>
                            </div>
                            <div className="flex flex-col justify-center w-2/3 mx-8 text-center">
                                <img src={mail} alt="nail" className="h-36" />
                                <p className="font-bold">(+62) 812-xxxx-xxxx</p>
                            </div>
                            <div className="flex flex-col justify-center w-2/3 mx-8 text-center">
                                <img src={phone} alt="phone" className="h-36" />
                                <p className="font-bold">nears@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center bg-blue-dark h-36 relative">
                <img className="h-6" src={logo} alt="logo"/>
                <p className="text-white font-light ml-8">your social destination.</p>
                <span className="text-white absolute bottom-0">&copy; nears 2023</span>
            </div>
        </>
    )
}

export default LandingPage;