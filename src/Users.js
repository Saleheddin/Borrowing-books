import Resct, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { postServiceData } from './util';
import { NavBar } from "./NavBar";

class UserInList extends Component {
    constructor(props) {
		super(props);

		this.state = {wantToEdit: false, Deleted: false};
		this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    editUser(event) {
		event.preventDefault();
        this.setState({wantToEdit: true});
	}
    deleteUser(event) {
        const params = {person_id: this.props.user.person_id};
        postServiceData("deletUser", params).then((data)=>{
            this.setState({deleted: true});
        })
    }
    render() {
        let user = this.props.user;
        if(this.state.wantToEdit){
            return <Navigate to="/user" state={{id: user.person_id}}/>;
        }if(this.state.deleted){
            return <Navigate to="/users" />;
        }
        return (
            <tr>
				<td>{user.person_id}</td>
				<td>{user.person_firstname}</td>
				<td>{user.person_lastname}</td>
				<td>{(new Date(user.person_birthdate)).toLocaleDateString()}</td>
				<td className="text-center">
                    <button name="edit" className="btn" onClick={this.editUser}><img src="img/edit.png" alt="edit" className="icon" /></button>
                    <button name="delete" className="btn" onClick={this.deleteUser}><img src="img/delete.png" alt="delete" className="icon" /></button>
                </td>
			</tr>
        );
    }
    
   
}

class UsersInList extends Component {
    render() {
        let users = this.props.users;
        // we loop the users list and send each user to the UserinList to display
		return (<tbody>
			{users.map((user) => <UserInList user={user} key={user.person_id} /> )}
         </tbody>);
    }
}

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {users: [], createNew:false};
        this.createUser = this.createUser.bind(this);
    }

    createUser(event) {
		// event.preventDefault();
        this.setState({createNew: true});
	}

    componentDidMount(){
        this.fetch();
    }

    fetch(){
        const params = {ok:1};
        postServiceData("users",params).then((data)=>{
            this.setState({users:data});
        });
    }

    render() {
        const Token = this.props.getToken();
        if (!Token) {
            return <Navigate to = "/" />
        }
        if(this.state.createNew){
            return <Navigate to = "/user" state={{id: "NEW"}} />
        }
        return (
            <div className="users">
                <NavBar />
                <body>
                    <div className="py-3">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <h2 className="">List of users</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col" class="text-center">user #</th>
                                                    <th scope="col" class="text-center">FirstName</th>
                                                    <th scope="col" class="text-center">LastName</th>
                                                    <th scope="col" class="text-center">Birthdate</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <UsersInList users={this.state.users} />
                                            <tfoot>
                                                <tr id="addNew">
                                                    <td scope="col" colspan="4"></td>
                                                    <td className="text-center">
                                                        <form action="createuser.do" method="POST">
                                                            <button className="btn" onClick={this.createUser}><img src="img/plus.png" alt="add" className="icon" /></button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </div>

        )
    }
}

export default Users;