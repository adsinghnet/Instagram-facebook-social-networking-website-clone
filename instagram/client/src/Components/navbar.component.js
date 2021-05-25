import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import profileLogo from "../Icons/profile.png";
import cookie from "react-cookies";
import axios from "axios";
import LogoutIcon from "../Icons/Logout.png";
import LoginIcon from "../Icons/Login.png";
import PostIcon from "../Icons/post.png";
import SettingIcon from "../Icons/setting.png";
import SearchIcon from "../Icons/search.png";
import ChatIcon from "../Icons/chat.png";
import logonav from "../Icons/logonav.png";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
const logged_in = async () => {
    let is_logged_in = false
    if (token === null) is_logged_in = false;
    await axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach((i) => {

                
                if (i.token === token) is_logged_in = i
            })
        })
    return is_logged_in
}
const Navbar = () => {
    const [PP, setPP] = useState(null);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = cookie.load('token');
        axios.get(`${BACKEND_URL}/users`)
            .then(res => {
                (res.data).forEach(i => {
                    
                    if (i.token === token) {
                        setUsername(i.username);
                        if (i.profile_picture) setPP(BACKEND_URL + '/' + i.profile_picture.filename)
                    }
                })
            })
    },[])
    useEffect(() => {
        logged_in().then(result => setLoggedIn(result))
    },[])
    const Logout = () => {
        cookie.save('token', '', { path: '/' });
        window.location = "/login";
    }
    return (
        <div className="d-flex justify-content-evenly">
            <nav className="navbar fixed-top navbar-light bg-light ">
            <Link to="/" className="nav-logorounded mx-auto d-block"><img src={logonav} className="img-fluid px-0 py-0" alt="Logo" /></Link>
            </nav>
            <br />
            <br />
            <nav className="navbar fixed-bottom navbar-light bg-light">
                <div className="container d-flex justify-content-evenly">
                    
                    <ul className="nav-list" id="nav-list ">
                        {PP === null
                            ? <NavLink to={`/u/${username}`} className="link"><li className="nav-item"><img src={profileLogo} alt="Profile Icon" className="logoRound" /><span className="nav-item-description">Profile</span></li></NavLink>
                            : <NavLink to={`/u/${username}`} className="link"><li className="nav-item"><img src={PP} alt="Profile Icon" className="logoRound" /><span className="nav-item-description">Profile</span></li></NavLink>
                        }
                        {isLoggedIn
                            ? <li className="nav-item" onClick={Logout}><img src={LogoutIcon} alt="Logout Icon" className="logo" /><span className="nav-item-description link">Logout</span></li>
                            : <NavLink to='/login'><li className="nav-item"><img src={LoginIcon} alt="Login Icon" className="logo" /><span className="nav-item-description link">Login</span></li></NavLink>
                        }
                        <NavLink to="/post/create"><li className="nav-item"><img src={PostIcon} alt="Create post icon" className="logo" /><span className="nav-item-description link">Create post</span></li></NavLink>
                        <NavLink to="/setting"><li className="nav-item"><img src={SettingIcon} alt="Create post icon" className="logo" /><span className="nav-item-description link">Setting</span></li></NavLink>
                        <NavLink to="/search"><li className="nav-item"><img src={SearchIcon} alt="Create post icon" className="logo " /><span className="nav-item-description link">Search User</span></li></NavLink>
                        <NavLink to="/chats"><li className="nav-item"><img src={ChatIcon} alt="Chat icon" className="logo" /><span className="nav-item-description link">Message user</span></li></NavLink>
                    </ul>
                </div>
            </nav>
        </div>
    
        
    )
}

export default Navbar;