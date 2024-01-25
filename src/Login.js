import React, { Component } from 'react';
import { Navigate } from 'react-router-dom'

import { postServiceData } from './util';
import { NavBar } from './NavBar';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { canLogin: false, login: "", pass: "" };

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }

    // Tools to synchronize fiels and variables
    handleChangeLogin(event) {
        this.setState({ login: event.target.value });
    }

    handleChangePass(event) {
        this.setState({ pass: event.target.value });
    }

    checkLogin(event) {
        event.preventDefault();
        const params ={login : this.state.login, passwd : this.state.pass};
        postServiceData("authenticate", params).then((data)=>{
            if (data.ok === 1) {
                this.setState({ canLogin: true });
            }
        })       
    }

    render() {
        this.props.removeToken();
        if (this.state.canLogin) {
            this.props.setToken("No Way");
            return <Navigate push to="/users" />;
        }
        return (
            <div className="App">
                <NavBar />
                <h1 className="App-title">Welcome to BOOKBORROW</h1>
                <body>
                    <h1>Login for more controle on your borrow operation</h1>
                    <form id="c_form-h" onSubmit={this.checkLogin}>
                        <div class="container">
                            <label for="uname"><b>Username</b></label>
                            <input type="text" onChange={this.handleChangeLogin} value={this.state.login} placeholder="Enter Username" name="uname" required='required' />

                            <label for="psw"><b>Password</b></label>
                            <input type="password" onChange={this.handleChangePass} value={this.state.pass} placeholder="Enter Password" name="psw" required='required' />

                            <button type="submit" className="btn btn-success">Login</button>
                            <label>
                                <input type="checkbox" checked="checked" name="remember" />
                            </label>
                        </div>

                        <div class="container" >
                            <button type="button" class="cancelbtn">Cancel</button>
                            <span class="psw">Forgot <a href="#">password ?</a></span>
                        </div>
                    </form>
                </body>
            </div>
        );
    }
}

export default Login;