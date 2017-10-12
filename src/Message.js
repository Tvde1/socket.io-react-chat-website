import React, { Component } from 'react';

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            text: props.text
        };
    }

    render() {
        return (
            <span><b>{this.state.username}</b>{this.state.text ? ': ' : ''}{this.state.text}</span>
        );
    }
}

export default Message;