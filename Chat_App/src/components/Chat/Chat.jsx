import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
let socket;


const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'http://localhost:3000';

    // Connection useEffect
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        console.log("Name:", name, "Room:", room);
        
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        // Emit join event directly (not inside connect event)
        socket.emit('join', { name, room }, (error) => {
            if (error) {
                console.error('Join error:', error);
            } else {
                console.log('Successfully joined room');
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        };
    }, [ENDPOINT, location.search]);

    // Message handling useEffect
    useEffect(() => {
        socket.on('message', (messageData) => {
            console.log('Received message:', messageData);
            setMessages(prevMessages => [...prevMessages, messageData]);
        });

        return () => {
            socket.off('message');
        };
    }, [message]);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            console.log('Attempting to send message:', message, 'from user:', name, 'in room:', room);
            socket.emit('sendMessage', message, (error) => {
                if (error) {
                    console.error('Send message error:', error);
                } else {
                    setMessage('');
                }
            });
        }
    };
    console.log("message",message);
    console.log("messages",messages);
    return (
        <div className="outerContainer">
            <div className="container">

                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    );
};

export default Chat;