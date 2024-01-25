
import React, { Component } from 'react';

export class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="logo">
                        <img src="img/Logo.png" alt="BookBorrow" />
                    </div>
                    <div className="nav">
                        <a href="/home">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/books">Books</a>
                        <a href="/users">Users</a>
                    </div>
            </nav>
        );
    }
}
