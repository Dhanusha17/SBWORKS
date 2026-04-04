import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FreelancerNav, ClientNav } from '../components/Navbar';
import { useAuth } from '../AuthContext';
import { getProject, getChat, sendMessage } from '../db';

export default function Chat({ role }) {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const loadChat = () => {
    const chat = getChat(projectId);
    setMessages(chat.messages || []);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  useEffect(() => {
    setProject(getProject(projectId));
    loadChat();
    const interval = setInterval(loadChat, 4000);
    return () => clearInterval(interval);
  }, [projectId]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(projectId, { senderId: user.id, senderName: user.username, text: text.trim(), timestamp: new Date().toLocaleTimeString() });
    setText('');
    loadChat();
  };

  const Nav = role === 'freelancer' ? FreelancerNav : ClientNav;

  return (
    <div>
      <Nav />
      <div className="page-container" style={{padding:'20px 24px'}}>
        {!project ? <p>Loading...</p> : (
          <div className="chat-layout">
            <div className="chat-info-panel">
              <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:'#1a1a2e'}}>{project.title}</div>
              <div style={{fontSize:13,color:'#78909c',marginBottom:4,lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{project.description}</div>
              <div style={{marginTop:12,fontSize:13,color:'#546e7a',marginBottom:4}}>
                {role === 'freelancer' ? `Client: ${project.clientName}` : `Freelancer: ${project.freelancerName || '—'}`}
              </div>
              <span className={`badge badge-${project.status.replace(' ','').toLowerCase()}`}>{project.status}</span>
              <div style={{marginTop:10,fontSize:13,color:'#78909c'}}>Budget: ₹{project.budget}</div>
              {project.status !== 'In Progress' && (
                <div style={{marginTop:16,background:'#FFF8E1',borderRadius:8,padding:10,fontSize:12,color:'#E65100'}}>
                  Chat is available after a freelancer is accepted.
                </div>
              )}
            </div>

            <div className="chat-main-panel">
              <div className="chat-header">
                {role === 'freelancer' ? '💬 Chat with the client' : '💬 Chat with the freelancer'}
              </div>
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div style={{textAlign:'center',color:'#90a4ae',padding:'40px 0',fontSize:14}}>No messages yet. Say hello!</div>
                )}
                {messages.map((m, i) => (
                  m.senderId === user.id ? (
                    <div key={i} className="msg-sent">
                      <div className="bubble">{m.text}</div>
                      <div className="msg-time">{m.timestamp}</div>
                    </div>
                  ) : (
                    <div key={i} className="msg-recv">
                      <div className="msg-sender">{m.senderName}</div>
                      <div className="bubble">{m.text}</div>
                      <div className="msg-time">{m.timestamp}</div>
                    </div>
                  )
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="chat-input-area">
                <input className="chat-input" value={text} onChange={e=>setText(e.target.value)} placeholder="Enter something..." onKeyDown={e=>e.key==='Enter'&&handleSend()} />
                <button className="btn btn-primary" onClick={handleSend}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
