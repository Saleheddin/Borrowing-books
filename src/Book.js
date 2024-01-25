
import React, { Component } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { postServiceData } from './util';
import { NavBar } from './NavBar';

// Hook definition
const Book = ({ getToken }) => {
    const location = useLocation();
    if (location.state === null) {
        return <Navigate to="/" />;
    } else {
        return <BookClass id={location.state.id} getToken={getToken} />;
    }
};

// Class definition
class BookClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            book_id: "NEW",
            book_title: "",
            book_authors: "",
            book_available: "",
            canGoBack: false
        };

        this.handleChangeBookTitle = this.handleChangeBookTitle.bind(this);
        this.handleChangeBookAuthors = this.handleChangeBookAuthors.bind(this);
        this.saveBook = this.saveBook.bind(this);
    }

    componentDidMount() {
        if (this.props.id > 0) {
            this.fetch();
        }
    }

    fetch() {
        const params = { id: this.props.id };
        postServiceData("book", params).then((data) => {
            let book = data[0];
            this.setState({ book_id: book.book_id });
            this.setState({ book_title: book.book_title });
            this.setState({ book_authors: book.book_authors });
            this.setState({ book_available: book.available });
        });
    }

    handleChangeBookTitle(event) {
        this.setState({ book_title: event.target.value });
    }

    handleChangeBookAuthors(event) {
        this.setState({ book_authors: event.target.value });
    }

    saveBook(event) {
        event.preventDefault();
        var params = {
            book_id: this.state.book_id,
            book_title: this.state.book_title,
            book_authors: this.state.book_authors
        };
        if (params.book_id === "NEW") {
            params.book_id = -1;
        }
        postServiceData("saveBook", params).then((data) => {
            this.setState({ canGoBack: true });
        });
    }

    render() {
        const token = this.props.getToken();
        if (!token) {
            return <Navigate to="/" />;
        }
        if (this.state.canGoBack) {
            return <Navigate to="/books" />;
        }
        return (
            <div className="py-3">
                <NavBar />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="">Create / Edit Book page</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                            <th scope="col">Book #</th>
                                            <td>{this.state.book_id}</td>
                                        </tr>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <td><input type="text" className="form-control" onChange={this.handleChangeBookTitle} value={this.state.book_title} /></td>
                                        </tr>
                                        <tr>
                                            <th scope="col">Author</th>
                                            <td><input type="text" className="form-control" onChange={this.handleChangeBookAuthors} value={this.state.book_authors} /></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="2" className="text-center">
                                                <button type="submit" className="btn btn-block btn-primary" onClick={this.saveBook}>Save</button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default Book;

