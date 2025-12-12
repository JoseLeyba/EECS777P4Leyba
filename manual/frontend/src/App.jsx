import { useEffect, useState } from 'react'

import './App.css'
import {Login} from './Login.jsx'
//import './TaskList.jsx'


export default function App() {
  const [token, setToken] = useState(window.sessionStorage.getItem("token"));

  if (token === undefined || token === "undefined"|| token === null){
    return <Login tokenSetter={setToken} />
  }
  else{
    return (<p>{"Logged in!!!!"}</p>); 
  }

}