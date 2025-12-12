import {useEffect, useState} from 'react'
import './App.css'
import Add from "./Add.jsx"

import axios from "axios"
const CREATE_END = "http://localhost:3002/home"
const DELETE_END = "http://localhost:3002/delete"






export default function PostList({auth, setAuth}){
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect (() =>{
        async function fetchUrls(){
            let params = {}
            let config = {'headers': { Authorization: "Bearer "+ auth}};
            const response = await axios.post(CREATE_END, params, config)
            .catch(function(err){ console.log("catch err is: ", err)});
            setIsLoading(false);
            setData(response.data);
        }
        fetchUrls();            

    }, []);

        
    //Used the one we did on Login.jsx as a base
    async function handleDelete(id){
        try{
            const config = { headers: { Authorization: "Bearer " + auth } };
            let params = {id:id};
            const response = await axios.post(DELETE_END, params, config);
            //Doing it as the video showed I couldn't print the message that you can only delete your own url's so I changed it a bit
            if (response.data && response.data.success) {
                window.location.reload();
            }
            else {
                alert(response.data.error || "Could not delete URL.");
            }
        } catch(err){
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            }
        }

    }

    if (isLoading){ return <div>Loading...</div>;}
    if (!data) {return (
    <div>There is no links posted
    <p></p>
    <Add auth={auth} setData={setData} />
    <input type="button" defaultValue={"Log out"}
        onClick={function(){
            window.sessionStorage.removeItem('token');
            setAuth(null);
        }} />
    </div>

);}


    return (
        <div>
        Articles
        <ul>
            {data.urls.map((item, idx)=>
                    <li>
                        <a href={item.name} target="_blank" rel="noreferrer">
                            {item.name}
                        </a>
                        {" "}
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </li>
            )}
        </ul>  
        <Add auth={auth} setData={setData} />
        <input type="button" defaultValue={"Log out"}
            onClick={function(){
                window.sessionStorage.removeItem('token');
                setAuth(null);
            }} />
        </div>
    );
}