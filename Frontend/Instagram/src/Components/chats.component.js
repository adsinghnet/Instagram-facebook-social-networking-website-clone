import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import queryString from "query-string";
import Axios from "axios";
import { NavLink } from "react-router-dom";
import cookie from "react-cookies";
import ScrollToBottom from 'react-scroll-to-bottom';

let socket;
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

const Chats = ({ location }) => {
    const [to, setTo] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [userList, setUserList] = useState([]);
    const [userInfo, setUserInfo] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = BACKEND_URL;

    useEffect(() => {
        const { qto } = queryString.parse(location.search);
        setTo(qto);
        Axios.get(`${BACKEND_URL}/users`)
            .then(users => {
                (users.data).forEach((user) => {
                    
                    if (user.username === qto) setReceiverId(user._id);
                })
            })

        socket = io(ENDPOINT);

    }, [ENDPOINT, location.search])

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/users`)
            .then(res => {
                (res.data).forEach((user) => {
                    
                    setUserList(users => [...users, user.username])
                })
            })
    }, [])

    useEffect(() => {
        check_logged_in().then(result => {
            if (!result) window.location = "/login";
            else setUserInfo(result)
        })
    }, [])

    useEffect(() => {
        socket.on('receiveMessage', ({ chat, from, to }) => {
            if (to === userInfo._id) {
                setMessages(messages => [...messages, { chat, from, to }])
            }
        })
    }, [userInfo])

    useEffect(() => {
        if (userInfo && receiverId) {
            socket.emit("getInfo", { from: receiverId, to: userInfo._id });
            socket.on("ChatInfo", (result) => {
                setMessages(result);
            })
        }
    }, [userInfo, receiverId])

    const FilterUser = (e) => {
        var filter, ul, li, div, txtValue;

        filter = e.target.value.toLowerCase();
        ul = document.querySelector("#users");
        li = ul.getElementsByTagName('li');

        for (let i = 0; i < li.length; i++) {
            
            let user = li[i];
            div = user.getElementsByTagName('div')[0];
            txtValue = div.textContent || div.innerText;
            if (txtValue.toLowerCase().indexOf(filter) === -1) user.style.display = "none";
            else user.style.display = "block";
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', { message, from: userInfo._id, to: receiverId })
            setMessage('');
            setMessages(messages => [...messages, { chat: message, from: userInfo._id, to: receiverId }]);
        }
    }

    return (
        <div>
            {to && userInfo ?
                <div className="container">
                    {(userList.length !== 0 && userList.indexOf(to) === -1) || userInfo.username === to ?
                        <h3 className="box-title text-dark">The user you are looking for is unavailable for some reasons. &nbsp;
                    <NavLink to="/" className="link">Back to home page</NavLink></h3>
                        : <div className="margin box box-shadow">
                            <div className="chat-info">
                                <h1 className="chat-to">{to}</h1>
                                <div className="closeIcon" onClick={() => window.location = "/chats"}><span className="closeIconText">&#10006;</span></div>
                            </div>
                            <div className="chats">
                                <ScrollToBottom className="messages">
                                    {messages.map(message => {
                                        if (message.from === userInfo._id) {
                                            return <div key={message._id || message.chat} className="sentText"><p className="message">{message.chat}</p></div>
                                        } else {
                                            return <div key={message._id || message.chat} className="receivedText"><p className="message">{message.chat}</p></div>
                                        }
                                    })}
                                </ScrollToBottom>
                            </div>
                            <form className="sendMessage " onSubmit={sendMessage}>
                                <div className="input-message">
                                    <input type="text" className="form-control" placeholder="Type a message..."
                                        value={message} onChange={({ target: { value } }) => setMessage(value)}
                                        onKeyPress={event => event.key === "Enter" ? sendMessage(event) : null} />
                                </div>
                                <div className="submit-message">
                                    <span>&nbsp; &nbsp;</span><input type="submit" className=" form-control btn btn btn-outline-primary" />
                                </div>
                            </form>
                        </div>
                    }
                </div>
                : <div className="container">
                    <div className="margin box box-shadow">
                        <div className="form-group">
                            <p className="form-label">Select user to chat with:</p>
                            <input type="text" className="form-control" placeholder="Search for username..." id="searchUsername" onChange={FilterUser} />
                        </div>
                        <ul id="users">
                            {userList.map((user) => {
                                if (user !== userInfo.username) {
                                    return <li key={user} className="user"><div className="box"
                                        onClick={() => window.location = `${window.location.pathname}?qto=${user}`}>{user}</div></li>
                                }
                                else return null;
                            })}
                        </ul>
                    </div>
                </div>
            }
            <br />
            <br />
            <br />
        </div>
    )
}

export default Chats