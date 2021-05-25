import React, { useEffect, useState } from "react";
import logo from '../Icons/logo.png';
import axios from 'axios';
import cookie from 'react-cookies';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [email, setEmail] = useState('');
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

    useEffect(() => {
        if (password !== confirmation) {
            setError('Password and confirmation must be same')
        } else {
            setError('')
        }
    }, [password, confirmation])

    useEffect(() => {
        if (username.length < 3 && username.length !== 0) {
            setError('Username length should be more than or equal to three')
        } else { setError('') }
    }, [username])

    const register = (e) => {
        e.preventDefault();
        if (username.length >= 3 && password === confirmation) {
            const User = {
                username: username,
                password: password,
                email: email
            }
            axios.post(`${BACKEND_URL}/users/register`, User)
                .then(res => {
                    
                    cookie.save('token', res.data.token, { path: '/' })
                    window.location = "/";
                })
                .catch((err) => setError("Please choose another username."));
        }
    }
    return (
        
        <div className="container-sm w-50 mh-50">
            
            <form className="margin box " onSubmit={register}>
                <img src={logo} className="img-fluid px-4" alt="Logo" />
                <h1 className=" text-center fs-5 text-wrap text-secondary fw-light">Sign up to see photos and videos from your friends.</h1>
                <div className="form-group">
                    <h4 className="form-error">{error}</h4>
                </div>
                <div className="form-group">
                    <p className="form-label">Username:</p>
                    <input className="form-control" type="text" value={username} onChange={({ target: { value } }) => setUsername(value.toLowerCase())} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Email:</p>
                    <input className="form-control" type="email" value={email} onChange={({ target: { value } }) => setEmail(value)} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Password:</p>
                    <input className="form-control" type="password" value={password} onChange={({ target: { value } }) => setPassword(value)} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Password Confirmation:</p>
                    <input className="form-control" type="password" value={confirmation} onChange={({ target: { value } }) => setConfirmation(value)} required></input>
                </div>
                <div className="form-group">
                    <p className="form-label">Have an account? <a className="link text-blue" href="/login">Login</a></p>
                </div>
                <div className="form-group">
                    <input className="form-control btn btn btn-outline-primary" type="submit"></input>
                </div>
                <p className=" text-center fs-6 text text-wrap text-secondary">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
            </form>
            <br />
            <br />
            <br />
        </div>
    )
}

export default Register;