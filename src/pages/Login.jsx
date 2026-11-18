import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { login, selectAuthStatus } from '../features/authSlice';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectAuthStatus);

    const [username, setUsername] = useState("emilys");
    const [password, setPassword] = useState("emilyspass");
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await dispatch(login({username, password})).unwrap();
            navigate("/")
        } catch (err) {
            setFormError(err);
        }
    }
  return (
    <form onSubmit={handleSubmit}>
        <input 
            type="text"
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input 
            type="password"
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Log in"}
        </button>
        {formError && <p style={{color: "red"}}>{formError}</p>}
    </form>
  )
}

export default Login