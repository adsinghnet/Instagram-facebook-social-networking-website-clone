import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProfilePicturePNG from "../Icons/profile.png";
import cookie from "react-cookies";
import Linkify from "react-linkify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const user_available = async (username) => {
    var available = false
    await Axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach((i) => {
                if (i.username.toLowerCase() === username) available = true
            })
        })
    return available
}
const token = cookie.load('token');
const logged_in = async () => {
    let is_logged_in = false
    if (token === null) is_logged_in = false;
    await Axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach((i) => {
                if (i.token === token) is_logged_in = i
            })
        })
    return is_logged_in
}

const check_followed = (follower, id) => {
    let if_followed = false;
    follower.forEach((i) => {
        if (i.follower === id) {
            if_followed = true;
        }
    })
    return if_followed;
}

const waitLoading = () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 1500))
}

const Profile = (props) => {
    const [username, setUsername] = useState('');
    const [userID, setID] = useState('');
    const [userInfo, setInfo] = useState({});
    const [available, setAvailable] = useState(false);
    const [ProfilePicture, setProfilePicture] = useState(ProfilePicturePNG);
    const [isOwner, SetIsOwner] = useState(false);
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const [followed, setFollowed] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.match.params.username) window.location = "/";
        setUsername(props.match.params.username);
        user_available(username).then(result => setAvailable(result));
        if (available) {
            Axios.get(`${BACKEND_URL}/users`)
                .then(res => {
                    (res.data).forEach((i) => {
                        if (i.username.toLowerCase() === username) {
                            const token = cookie.load('token');
                            if (i.profile_picture) setProfilePicture(BACKEND_URL + '/' + i.profile_picture.filename);
                            if (i.token === token) SetIsOwner(true);
                            if (i.name) document.title = i.name;
                            else document.title = i.username
                            setID(i._id);
                            setInfo(i);
                            Axios.get(`${BACKEND_URL}/follow/get`, { params: { user: i._id } })
                                .then(res => {
                                    setFollowing(res.data.following);
                                    setFollower(res.data.follower);
                                })
                            Axios.get(`${BACKEND_URL}/posts/get/${i._id}/all`)
                                .then(res => setPosts(res.data))
                        }
                    })
                })
        }
    }, [props.match.params.username, username, available, followed])

    useEffect(() => {
        logged_in().then(result => setLoggedIn(result))
    }, [])

    useEffect(() => {
        if (check_followed(follower, isLoggedIn._id)) setFollowed(true)
        else setFollowed(false)
    }, [follower, isLoggedIn])

    useEffect(() => {
        waitLoading().then(() => setLoading(false))
    }, [])

    const Follow = () => {
        logged_in().then(result => { if (!result) return null; })
        Axios.post(`${BACKEND_URL}/follow/add`, { following: userID, follower: isLoggedIn._id, token })
            .then(() => setFollowed(true))
            .catch(err => console.log(err))
    }

    const Unfollow = () => {
        logged_in().then(result => { if (!result) return null; })
        Axios.post(`${BACKEND_URL}/follow/delete`, { following: userID, follower: isLoggedIn._id, token })
            .then(() => setFollowed(false))
            .catch(err => console.log(err))
    }
    return (
        <div className="container-sm px-4 w-50">
            {loading ? <h1>Loading...</h1>
                : [(!available ? <h1 className="box-title" key={isLoggedIn._id}>Sorry, this page is unavailable, please<Link to="/" className="link text primary"> go back</Link></h1> :
                    <div key={isLoggedIn._id}>
                        <div className="row profile">
                            <div className="profile-pp">
                                <NavLink to="/setting/profile-picture" className="d-flex justify-content-center mx-auto col-md-4"><img src={ProfilePicture} alt="Profile" className="profile-picture-img " /></NavLink>
                            </div>
                            <div className="profile-info">
                                <h2 className="profile-heading box-title">{username} {isOwner ?
                                    <NavLink to="/setting/profile/"><button className="btn btn-primary">Edit Profile</button></NavLink>
                                    : null}</h2>
                            </div>
                            <div className="margin">
                                <h3>{userInfo.name}</h3>
                                <Linkify><p style={{ whiteSpace: "pre-wrap" }}>{userInfo.bio}</p></Linkify>
                                <Linkify><span>{userInfo.website}</span></Linkify>
                                {isLoggedIn
                                    ? [
                                        (isOwner
                                            ? null
                                            : [
                                                (followed
                                                    ? <button className="form-control btn btn-primary" onClick={Unfollow} key={isLoggedIn._id}>Unfollow</button>
                                                    : <button className="form-control btn btn-primary" onClick={Follow} key={isLoggedIn._id}>Follow</button>
                                                )
                                            ]
                                        )
                                    ]
                                    : null
                                }
                            </div>
                        </div>
                        <div className="activity-info profile">
                            <div className="profile-bar">
                                <h5>Photos</h5>
                                <span>{posts.length}</span>
                            </div>
                            <div className="profile-bar">
                                <h5>Followers</h5>
                                <span>{follower.length}</span>
                            </div>
                            <div className="profile-bar">
                                <h5>Friends</h5>
                                <span>{following.length}</span>
                            </div>
                        </div>
                        <div className="row posts">
                            {posts.map((post) => (<div key={post._id} className="post box box-shadow"><NavLink to={`/post/${post._id}`}>
                                <img src={`${BACKEND_URL}/${post.image.filename}`} alt={post.description} className="box-image" />
                            </NavLink></div>))}
                        </div>
                    </div>
                )]}
        </div>
    )
}

export default Profile;