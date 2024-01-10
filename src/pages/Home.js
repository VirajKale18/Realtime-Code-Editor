import React, {useState} from 'react';
import { createRoutesFromChildren, useNavigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) =>{
        e.preventDefault();
        const id = uuidV4()
        setRoomId(id);
        toast.success('New Room Created Succesfully');
    }
    const joinRoom = () =>{
        if(!roomId|| !username){
            toast.error("Room ID & username is required");
            return;
        }
        //Redirect
        navigate(`/editor/${roomId}`, {
            state:{
                username, 

            },
        });
    };
    const handleINputEnter = (e) =>{
        console.log('event',e.code);
        if(e.code==='Enter'){
            joinRoom();
        }
    }
    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img className='homePageLogo' src='/code-sync.jpeg' alt='code-sync-logo' />
                <h4 className='mainLabel' >Paste Invitation ROOM Id</h4>
                <div className='inputGroup'>
                    <input type='text' className='inputBox' placeholder='ROOM ID'  onChange={(e)=> setRoomId(e.target.value)} value={roomId} />
                    <input type='text' className='inputBox' placeholder='username'  onChange={(e)=> setUsername(e.target.value)} onKeyUp={handleINputEnter} value={username} />
                    <button className='btn joinBtn' onClick={joinRoom}>
                        Join
                    </button>
                    <span className='createInfo'>
                        If you dont have a invite then create &nbsp;
                        <a onClick={createNewRoom} href="" className='createNewBtn'>
                            new room
                        </a>
                    </span>

                </div>
            </div>
            <footer>
                <h4> Built under Guidance with <a href="https://vcet.edu.in/">VCET</a>  </h4>
            </footer>
        </div>

    )
}

export default Home