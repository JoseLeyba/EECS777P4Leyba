import {useState} from 'react'

export function Login({tokenSetter}){
    [name, setName] = useState("");
    return (
        <div>
        <p>Please log in here!\n</p>
        <p>Name</p>
        <input type="text" onChange={function(e){ setName(e.target.value)}}>
        </input>
        </div>
    );
}