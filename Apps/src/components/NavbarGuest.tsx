import { Link } from "react-router-dom";
import logo from "../assets/logo_dark.png"
const Navbar = () => {

    return(
        <div className="flex items-center h-16 px-1 ml-9">
            <img src={logo} alt="logo" className="relative h-6 mt-2 mr-10" />
            <div className="flex flex-row justify-between w-full mr-9">
                <div className="flex items-center">
                    <a href='#feature' className="mr-12 text-sm text-black">Feature</a>
                    <a href='#contact' className="text-sm text-black">Contact us</a>
                </div>
                <div className="flex items-center text-blue-light hover:text-purple">
                    <Link to={'/login'} className="mr-12 text-sm">Already have an account?</Link>
                    <Link to={'/login'} className="text-sm">Sign in</Link>
                </div>
            </div>
        </div>
    )

}

export default Navbar