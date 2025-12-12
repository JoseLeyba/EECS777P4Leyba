import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios"
const CREATE_END = "http://localhost:3002/register"


export function Register({tokenSetter}){
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async function(e){
        e.preventDefault();
        
        if (name.trim() === '' || password.trim() === '') {
            alert('Please enter a username and password');
            return;
        }
        try{
            let params = {name:name, pw: password};
            const response = await axios.post(CREATE_END, params);
            //Doing it as the video showed I couldn't print the message that you can only delete your own url's so I changed it a bit
            if (response.data && response.data.ok) {
                const t = response.data.token;
                window.sessionStorage.setItem("token", t);
                //Log in Immediately
                tokenSetter(t);

            }
            else {
                alert(response.data.error || "Registratiion Failed.");
            }
        } catch(err){
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            }
        }

    };


    return (
        <div>
        Don't have an account? Create one!
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
        </div>
    );
}