import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios"
const CREATE_END = "http://localhost:3002/add"


function isValidUrl(str) {
  try {
    const u = new URL(str);
    if (/\s/.test(str)) {
        alert("URLs cannot contain spaces. Replace spaces with %20.");
        return false;
    }
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Add({auth, setData}){
    const [newUrl, setnewUrl] = useState("");
    const submitCallback = async function(e){
        e.preventDefault();

        if (newUrl == ""){
            //probably better to make sure it is also a valid url (in format at least)
            alert("Please enter some txt")
            return;
        }
        if (!isValidUrl(newUrl)){
            alert("This isn't a valid link. Try again")
            return;
        } 
        let body = {url:newUrl};
        let config = {'headers': { Authorization: "Bearer "+ auth}};
        const response = await axios.post(CREATE_END, body, config)
        .catch(function(err){ console.log("catch err is: ", err)});
        window.location.reload();

    };

    return (
        <form onSubmit={submitCallback}>
        <input className="input" type="text" onChange={function(e){ setnewUrl(e.target.value)}} />
        <button type='submit'>Add New URL</button>
        </form>
    );
}