import React, { useEffect, useRef, useState } from 'react';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import Client from '../Components/Client';
import Editor from '../Components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate ,Navigate , useParams } from 'react-router-dom';
const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const [clients, setClients] = useState([
    //{socketId:1, username:"Viraj K"},
    // {socketId:2, username:"Roshan A"},
    // {socketId:3, username:"Avi W"}

  ]);
   const { roomId } = useParams();
   console.log(roomId);
   const reactNavigator = useNavigate();
   

  // const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      //Listening for Join Event
      socketRef.current.on(ACTIONS.JOINED,({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
                toast.success(`${username} joined the room.`);
                console.log(`${username} joined`);
            }
            setClients(clients);
                    // socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    //     code: codeRef.current,
                    //     socketId,
                    // });
                }
            );
            //Disconnected
            socketRef.current.on(
              ACTIONS.DISCONNECTED,
              ({ socketId, username }) => {
                  toast.success(`${username} left the room.`);
                  setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketId !== socketId
                    );
                });
            }
            
            );

    };
    init();
  }, []);

  async function copyRoomId() {
    try {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
}


  function leaveRoom() {
    reactNavigator('/');
}

  

  if(!location.state){
    return <Navigate to="/"/>;
   }
  

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInnner'>
          <div className='logo'>
            <img className="logoImage" src="/code-sync2.jpg" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {
              clients.map((client) => (
                <Client key={client.socketId}
                  username={client.username} />
              ))
            }

          </div>
        </div>
        <button className='btn copyBtn' onClick={{copyRoomId}}>Copy ROOM Id</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId}/>
      </div>


    </div>
  )
}

export default EditorPage;