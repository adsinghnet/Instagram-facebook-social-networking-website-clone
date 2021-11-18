import Axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import cookie from "react-cookies";
import moment from "moment";
import LikeIcon from "../Icons/like.png";
import HeartIcon from "../Icons/heart.png";
import CommentIcon from "../Icons/comment.png";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
const check_logged_in = async () => {
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

const Post = (params) => {
    const [postInfo, setPostInfo] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [totalLike, setTotalLike] = useState(0);
    const [inputComment, setInputComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commenterName, setCommenterName] = useState({});

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/posts/${params.match.params.id}`)
            .then(res => {
                setPostInfo(res.data);
            })
    }, [params.match.params.id])

    useEffect(() => {
        check_logged_in().then(result => setUserInfo(result))
    }, [])

    useEffect(() => {
        if (postInfo) document.title = `${postInfo.description} by @${username}`
    }, [postInfo, username])

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/users`)
            .then(res => {
                const token = cookie.load('token');
                (res.data).forEach((i) => {
                    if (i.token === token) if (postInfo) if (i._id === postInfo.user) setIsOwner(true);
                    if (postInfo) if (i._id === postInfo.user) setUsername(i.username.toLowerCase());
                })
            })
    }, [postInfo])

    useEffect(() => {
        if (userInfo && postInfo) {
            Axios.get(`${BACKEND_URL}/likes/get/${postInfo._id}/all`)
                .then(res => {
                    (res.data).forEach((like) => {
                        if (like.liker === userInfo._id) setIsLiked(like._id);
                    })
                    setTotalLike(res.data.length)
                })
        }
    }, [userInfo, postInfo])

    useEffect(() => {
        if (postInfo) {
            Axios.get(`${BACKEND_URL}/comments/get/${postInfo._id}/all`)
                .then(res => {
                    setComments(res.data)
                })
        }
    }, [postInfo])

    const DeletePost = () => {
        if (window.confirm("Are you sure?")) {
            const token = cookie.load('token');
            Axios.post(`${BACKEND_URL}/posts/delete/${params.match.params.id}`, { token })
                .then(() => window.location = `/u/${username}`)
                .catch(err => console.log(err));
        }
    }

    const LikePost = () => {
        if (isLiked === false) {
            if (postInfo && userInfo) {
                Axios.post(`${BACKEND_URL}/likes/add`, { liker: userInfo._id, post: postInfo._id })
                    .then(res => {
                        setIsLiked(res.data.id);
                        setTotalLike(like => like + 1);
                    })
                    .catch(err => console.log(err));
            }
        }
    }

    const UnlikePost = () => {
        if (isLiked !== false) {
            Axios.delete(`${BACKEND_URL}/likes/remove/${isLiked}`)
                .then(() => {
                    setIsLiked(false);
                    setTotalLike(like => like - 1);
                })
                .catch(err => console.log(err));
        }
    }

    const addComment = (e) => {
        e.preventDefault();

        Axios.post(`${BACKEND_URL}/comments/add`, { commenter: userInfo._id, post: postInfo._id, token, comment: inputComment })
            .then(() => {
                Axios.get(`${BACKEND_URL}/comments/get/${postInfo._id}/all`)
                    .then(result => {
                        setComments(result.data)
                    })
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        comments.forEach((comment) => {
            Axios.get(`${BACKEND_URL}/users`)
                .then(users => {
                    (users.data).forEach((user) => {
                        if (user._id === comment.commenter) {
                            setCommenterName(ex => ({
                                ...ex,
                                [comment.commenter]: user.username
                            }))
                        }
                    })
                })
        })
    }, [comments])

    return (
        <div className="container">
            {postInfo
                ?
                <div className="margin-top-bottom container-sm px-4 w-50">
                    <div className="box box-shadow">
                        <img src={`${BACKEND_URL}/${postInfo.image.filename}`} className="box-image" alt={postInfo.description} />
                        {userInfo !== false && userInfo !== null
                            ? <div className="post-section">
                                {isLiked === false
                                    ? <span className="to-like-icon" onClick={() => { LikePost() }}><img src={LikeIcon} alt="Like Icon" /></span>
                                    : <span className="to-like-icon" onClick={() => { UnlikePost() }}><img src={HeartIcon} alt="Unlike Icon" /></span>}
                                <NavLink to="#comment"><span className="share-icon"><img src={CommentIcon} alt="Comment Icon" /></span></NavLink>
                                <p className="box-text">{totalLike} {totalLike <= 1 ? <span>Like</span> : <span>Likes</span>}</p>
                            </div>
                            : null}
                        <div className="post-section">
                            <p className="box-text">{postInfo.description}</p>
                        </div>
                        {postInfo.tags.length > 0 && postInfo.tags[0] !== ""
                            ? <div className="post-section">
                                <p className="form-label">Tags:</p>
                                {postInfo.tags.map((tag) => (<span key={tag}><NavLink to={`/u/${tag.toLowerCase()}`} className="link text primary">@{tag.toLowerCase()} </NavLink></span>))}
                            </div>
                            : null}
                        {postInfo.hashtags.length > 0 && postInfo.hashtags[0] !== ""
                            ? <div className="post-section">
                                <p className="form-label">Hashtags:</p>
                                {postInfo.hashtags.map((hashtag) => (<span key={hashtag}>#{hashtag} </span>))}
                            </div>
                            : null
                        }
                        <p className="box-text">Posted {moment(postInfo.createdAt).fromNow()} by <NavLink className="link text primary" to={`/u/${username}`}>{username}</NavLink></p>
                        {postInfo.createdAt !== postInfo.updatedAt ?
                            <p className="box-text">Updated {moment(postInfo.updatedAt).fromNow()}</p>
                            : null}
                        {isOwner ?
                            <div>
                                <h3><NavLink to={`/post/${params.match.params.id}/edit`} className="link text primary">Edit Post</NavLink></h3>
                                <h3 className="link text-danger" onClick={DeletePost}>Delete Post</h3>
                            </div>
                            : null
                        }
                    </div>
                    <div className="margin-top-bottom box box-shadow" id="comment">
                        <h1 className="box-title">Comments</h1>
                        <div className="margin box box-shadow">
                            {comments.map((comment) => {
                                return <p key={comment._id} className="box-text"><NavLink to={`/u/${commenterName[comment.commenter]}`} className="link text primary">{commenterName[comment.commenter]}</NavLink>
                            &nbsp;commented {comment.comment} {moment(comment.createdAt).fromNow()}</p>
                            })}
                        </div>
                        {userInfo ?
                            <form onSubmit={addComment}>
                                <textarea className="form-control" rows="5" onChange={({ target: { value } }) => setInputComment(value)}></textarea>
                                <input className="btn btn-primary form-control py-4" type="submit" />
                            </form>
                            : null}
                    </div>
                </div>
                : <h1 className="box-title">Loading...</h1>}
        </div>
    )
}

export default Post;