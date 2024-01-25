
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { postServiceData } from './util';
import { NavBar } from "./NavBar";

class BookInList extends Component {
    constructor(props) {
        super(props);

        this.state = { wantToEdit: false, needsReload: false };
        this.editBook = this.editBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    editBook(event) {
        event.preventDefault();
        this.setState({ wantToEdit: true });
    }

    deleteBook() {
        const params = { book_id: this.props.book.book_id };
        postServiceData("deleteBook", params).then((data) => {
            this.setState({ needsReload: true });
        });
    }

    render() {
        let book = this.props.book;
        if (this.state.wantToEdit) {
            return <Navigate to="/book" state={{ id: book.book_id }} />;
        }
        if (this.state.needsReload) {
            return <Navigate to="/books" />;
        }
        return (
            <tr>
                <td>{book.book_id}</td>
                <td>{book.book_title}</td>
                <td>{book.book_authors}</td>
                <td>{book.available}</td>
                <td className="text-center">
                    <button name="edit" className="btn" onClick={this.editBook}><img src="img/edit.png" alt="edit" className="icon" /></button>
                    <button name="delete" className="btn" onClick={this.deleteBook}><img src="img/delete.png" alt="delete" className="icon" /></button>
                </td>
            </tr>
        );
    }
}

class BooksInList extends Component {
    render() {
        let books = this.props.books;
        return (<tbody>
            {books.map((book) => <BookInList book={book} key={book.book_id} />)}
        </tbody>);
    }
}

class Books extends Component {
    constructor(props) {
        super(props);
        this.state = { books: [], createNew: false };
        this.createBook = this.createBook.bind(this);
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        const params = { ok: 1 };
        postServiceData("books", params).then((data) => {
            this.setState({ books: data });
        });
    }

    createBook(event) {
        this.setState({ createNew: true });
    }

    render() {
        const token = this.props.getToken();
        if (!token) {
            return <Navigate to="/" />;
        }
        if (this.state.createNew) {
            return <Navigate to="/book" state={{ id: "NEW" }} />;
        }
        return (
            <div>
                <NavBar />

                <div className="py-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h2 className="">List of books</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="text-center">Book #</th>
                                                <th scope="col" className="text-center">Title</th>
                                                <th scope="col" className="text-center">Authors</th>
                                                <th scope="col" className="text-center">status</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <BooksInList books={this.state.books} />
                                        <tfoot>
                                            <tr id="addNew">
                                                <td colSpan="4"></td>
                                                <td className="text-center">
                                                    <button className="btn" onClick={this.createBook}><img src="img/plus.png" alt="add" className="icon" /></button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Books;

