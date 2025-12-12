import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios"
const CREATE_END = "http://localhost:3002/add"




export default function Add({auth, setData}){
    const [newUrl, setnewUrl] = useState("");
    const submitCallback = async function(e){
        e.preventDefault();

        if (newUrl == ""){
            //probably better to make sure it is also a valid url (in format at least)
            alert("Please enter some txt")
        }
        let body = {url:newUrl};
        let config = {'headers': { Authorization: "Bearer "+ auth}};
        const response = await axios.post(CREATE_END, body, config)
        .catch(function(err){ console.log("catch err is: ", err)});
    };

    return (
        <form onSubmit={submitCallback}>
        <input className="input" type="text" onChange={function(e){ setnewUrl(e.target.value)}} />
        <button type='submit'>Add New URL</button>
        </form>
    );
}