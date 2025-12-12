import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios"
const CREATE_END = "http://localhost:3002/home"




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

    if (isLoading){ return <div>Loading...</div>;}
    if (!data) {return <div>{data} is null/empty</div>}


    return (
        <div>
        Articles
        <ul>
            {data.urls.map((item, idx)=>
                    <li>{item.name}</li>
            )}
        </ul>  
        <input type="button" defaultValue={"Log out"}
            onClick={function(){
                window.sessionStorage.removeItem('token');
                setAuth(null);
            }} />
        </div>
    );
}