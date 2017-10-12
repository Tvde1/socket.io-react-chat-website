import React, { Component } from 'react';
import './App.css';
import Message from './Message.js';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000/');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [
                // {username: 'Geert', text: 'Hallo allemaal!'},
                // {username: 'Piet', text: 'Rot op piet.'}
            ],
            chatBoxText: '',
            username: '',
            roomid: '',
            joined: false
        };

        socket.on('message', (username, text) => { 
            console.log('message'); 
            this.addMessage(username, text); 
        });
        socket.on('join', username => { 
            console.log('Someone joined.'); 
            this.addMessage(username, 'joined'); 
        });
        socket.on('leave', username => { 
            console.log('Someone left.'); 
            this.addMessage(username, 'left'); 
        });
    }

    sendMessage() {
        socket.emit('message', this.state.chatBoxText);
        this.addMessage('Me', this.state.chatBoxText);
        this.setState({chatBoxText: ''});
    }

    addMessage(username, text) {
        const newMessages = this.state.messages.slice();
        if (text === 'joined' || text === 'left') {
            username = `${username} ${text} the chat.`;
            text = '';
        }
        
        newMessages.push({username, text});
        this.setState({messages: newMessages, chatBoxText: ''});
    }

    render() {
        return (
            <div className="App">
        
                <div className="Information">
                    Information.
                </div>

                {this.renderBody()}

            </div>
        );
    }

    renderBody() {
        if (this.state.joined) {
            return (this.renderMessages());
        } else {
            return (this.renderJoining());
        }
    }

    renderJoining() {
        const updateName = (evt) => this.setState({ username: evt.target.value });
        const updateRoom = (evt) => this.setState({ roomid: evt.target.value });

        return (
            <div className="joining">
                Username: 
                <input type="text" id="tbName" value={this.state.username} onChange={updateName} autoFocus="autoFocus" />
                <br />
                Roomid: 
                <input type="text" id="tbRoom" value={this.state.roomid} onChange={updateRoom} autoFocus="autoFocus"/>
                <br />
                <input type="button" id="btnJoin" value="Join" onClick={() => this.joinRoom()}/>
            </div>
        );
    }

    joinRoom() {
        socket.emit('join', this.state.username, this.state.roomid);
        this.setState({joined: true});
    }

    renderMessages() {
        const updateMessage = (evt) => this.setState({ chatBoxText: evt.target.value });

        return (
            <div>

                <div className="roomInfo">
                    Username: {this.state.username}<br />
                    Room: {this.state.roomid}
                </div>

                <br />

                <div className="messages">
                    <ul>
                        {this.state.messages.map((m) => <li>{this.renderMessage(m.username, m.text)}</li>)}
                    </ul>
                </div>

                <div className="typing">
                    <input type="text" id="tbMessage" value={this.state.chatBoxText} onChange={updateMessage} autoFocus="autoFocus" />
                    <input type="button" value="Send" onClick={() => this.sendMessage()} />
                </div>
            </div>  
        );
    }

    renderMessage(name, text) {
        return (
            <Message username={name} text={text} />
        );
    }
}

export default App;
