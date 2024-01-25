import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import Login from "./Login"
import Users from './Users';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import User from './User';
import Book from './Book';
import Books from './Books';


function setToken(userToken) {
	sessionStorage.setItem('token', JSON.stringify(userToken));
}
  
function getToken() {
	const tokenString = sessionStorage.getItem('token');
	const userToken = JSON.parse(tokenString);
	return (userToken != null)
}

function removeToken() {
	sessionStorage.removeItem('token');
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login setToken={setToken} removeToken={removeToken}  />} />
            <Route path="/users" element={<Users getToken={getToken} />} />
            <Route path="/user" element={<User getToken={getToken} />} />
            <Route path="/books" element={<Books  getToken={getToken}/>} />
            <Route path="/book" element={<Book getToken={getToken}/>} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
