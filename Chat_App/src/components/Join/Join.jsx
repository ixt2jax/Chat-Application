import React, {useState} from "react";
import {Link} from 'react-router-dom';

import './Join.css'

const Join=()=>{
const [name,setName]=useState('');
const [room,setRoom]=useState('');
 
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">join</h1>
                <div><input placeholder="Name" type="text" className="joinInput" onChange={(event)=>{
                    setName(event.target.value);
                }}/></div>
                <div><input placeholder="Room" type="text" className="joinInput mt-20" onChange={(event)=>{
                    setRoom(event.target.value)
                }}/></div>
                <Link onClick={event=>(!name || !room)? event.preventDefault(): null} 
                to={`/chat?name=${name.trim()}&room=${room.trim()}`}>
                    <button className="button mt-20" type="submit">Sign-in</button>
                </Link>
            </div>
        </div>
        
    )
};

export default Join;