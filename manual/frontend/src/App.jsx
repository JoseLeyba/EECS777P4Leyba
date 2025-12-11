import { useEffect, useState } from 'react'

import './App.css'
import {Login} from './Login.jsx'
import './TaskList.jsx'


export default function App() {
  const [count, setCount] = useState(0)
  const [token, setToken] = useState(window.sessionStorage.getItem("token"));

  if (token === undefined || token === "undefined"|| token === null){
    return <Login tokenSetter={setToken} />
  }
  else{
    return (<TaskList auth={token} setAuth={setToken} />); 
  }

}