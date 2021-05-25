import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import logo from '../Icons/logo.png';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = cookie.load('token');
        axios.get(`${BACKEND_URL}/users`)
            .then(res => {
                (res.data).forEach(i => {
                    
                    if (i.token === token) window.location = "/";
                })
            })
    },[])

    const Submit = (e) => {
        e.preventDefault();

        const User = {
            username: username,
            password: password
        }
        axios.post(`${BACKEND_URL}/users/login`, User)
            .then(res => {
                if (res.status === 200) setError("");
                cookie.save('token', res.data, { path: '/' });
                window.location = "/";
            })
            .catch(err => {
                if (err) setError("Your username and/or password doesn't match")
            })
    }

    return (
        <div className="container-sm px-4 w-50">
            <form className="margin box" onSubmit={Submit}>
                <img src={logo} className="img-fluid px-4" alt="Logo" />
                <div className="form-group">
                    <h4 className="form-error ">{error}</h4>
                </div>
                <div className="form-group">
                    <p className="form-label">Username:</p>
                    <input className="form-control" type="text" value={username} onChange={({ target: { value } }) => setUsername(value.toLowerCase())} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Password:</p>
                    <input className="form-control" type="password" value={password} onChange={({ target: { value } }) => setPassword(value)} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Don't have an account? <a className="link text-blue" href="/register">Register</a></p>
                </div>
                <div className="form-group">
                    <input className="form-control btn btn btn-outline-primary" type="submit"></input>
                </div>
            </form>
        </div>
    )
}

export default Login;