import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios"
import {Register} from './Register.jsx'
const CREATE_END = "http://localhost:3002/login"
export function Login({tokenSetter}){
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async function(e){
        e.preventDefault();
        try{
        let params = {name:name, pw:password};
        const response = await axios.post(CREATE_END, params)
        if (response.data && response.data.ok) {
            const t = response.data.token;
            window.sessionStorage.setItem('token', t);
            tokenSetter(t);
            } 

        }catch(err){
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            }
        }
    };


    return (
        <div>
        Please log in here!
        <form onSubmit={handleSubmit}>
        <p>Name:
        <input type="text" onChange={function(e){ setName(e.target.value)}}>
        </input>
        </p>

        <p>Password: 
        <input type="password" onChange={function(e){ setPassword(e.target.value)}}>
        </input>
        <br />
        <input type="submit" />
        </p>
        </form>
        <p></p>
        <Register tokenSetter={tokenSetter} />
        </div>
    );
}