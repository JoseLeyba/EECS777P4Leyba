import {useState} from 'react'
import axios from "axios"
const CREATE_END = "http://localhost:3002"
export function Login({tokenSetter}){
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async function(e){
        e.preventDefault();

        const params = {username:name, pw:password}
        axios.post(CREATE_END, params)
    }


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
        </div>
    );
}