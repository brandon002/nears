import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_dark.png"
import connection from "../assets/nav_connect.svg";
import { useState, useEffect } from "react";
import forum from "../assets/nav_forum.svg"
import groups from "../assets/nav_groups.svg"
import leaderboard from "../assets/leaderboard.svg"
import { logout } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
const NavbarUser = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>()
    const log = useSelector((state: any) => state.login);
    const [dropdown, setDropdown] = useState(false)
    function handleDropdown() {
        if(dropdown){
            setDropdown(false);
        } else {
            setDropdown(true);
        }
    }
    function handleSignout(){
        dispatch(logout());
    }
    return(
        <div className="flex px-1 h-16 items-center justify-center w-[70%] ml-[1.8rem]">
            <img src={logo} alt="logo" className="relative h-6 mt-2 mr-10" />
            <div className="flex flex-row justify-end w-full mr-9">
                <div className="flex items-center">
                    <div className="flex flex-col mr-12" onClick={()=>navigate("/leaderboard")} role="button">
                        <img className="h-6" src={leaderboard} alt="leaderboard"/>
                        <span className="text-sm font-semibold leading-3">Leaderboard</span>
                    </div>
                    <div className="flex flex-col mr-12" onClick={()=>navigate("/search-group")} role="button">
                        <img className="h-6" src={groups} alt="groups"/>
                        <span className="text-sm font-semibold leading-3">Groups</span>
                    </div>
                    <div className="flex flex-col mr-12 relative top-[-0.18rem]" onClick={()=>navigate("/search-user")} role="button">
                        <img className="h-8" src={connection} alt="friends"/>
                        <span className="text-sm font-semibold leading-[0.5rem]">Friends</span>
                    </div>
                    <div className="flex flex-col mr-12" onClick={()=>navigate("/forum")} role="button">
                        <img className="h-6" src={forum} alt="forum"/>
                        <span className="text-sm font-semibold leading-3">Forum</span>
                    </div>
                    <div className="relative inline-block mb-2 ml-8 mr-6 text-left">
                        <div>
                            <button type="button" onClick={handleDropdown} className="inline-flex w-full justify-center gap-x-0.5 rounded-md bg-white px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-logo" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            <span className="material-symbols-outlined" style={{ color: '#4C5FA6' }}>settings</span>
                            </button>
                        </div>
                        {dropdown && 
                            <div onMouseLeave={()=>setDropdown(false)} className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1} >
                                <div className="py-1" role="none" onClick={()=>navigate("/profile")}>
                                <span className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-logo" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</span>
                                <button onClick={handleSignout}className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:text-white hover:bg-logo" role="menuitem" tabIndex={-1} id="menu-item-3">Sign out</button>
                                </div>
                            </div>
                        }
                   
                    </div>
                </div>
            </div>
        </div>
    )

}

export default NavbarUser