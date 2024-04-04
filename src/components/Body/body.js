import axios from "axios";
import { useState } from "react";
import { Card } from 'react-bootstrap'; 
import './body.css';

export default function Body() {

    const [book, setBook] = useState("");  
    const [printType, setPrintType] = useState(""); 
    const [ordered, setOrdered] = useState("relevance");
    const [result, setResult] = useState([]);  
    const [apiKey, setApiKey] = useState("AIzaSyBzap69fLya3UleINtrYIT3BurL9JLxKxo");

    const limitString = (str = '', num = 1) => {
        const { length: len } = str;
        if (num < len){
           return str.slice(0, num) + '...';
        } else {
           return str;
        };
    };

    function handleChange(event) {  
        var inputField = document.getElementById("inputValue");
        const book = inputField.value;  
        var dropdown = document.getElementById("slectedType");
        var value = dropdown.value;
        var printDropdown = document.getElementById("slectedPrintType");
        var printValue = printDropdown.value;

        if (value === "keyword") {
            setBook(book);
        }

        if (value === "subject") {
            setBook("subject:" + book);
        }

        if (value === "title") {
            setBook("intitle:" + book);
        }

        if (value === "author") {
            setBook("inauthor:" + book);
        }

        if (value === "isbn") {
            setBook("isbn:" + book);
        }


        if (printValue === "all") {
            setPrintType("&printType=all");
        }

        if (printValue === "books") {
            setPrintType("&printType=books");
        }

        if (printValue === "magazines") {
            setPrintType("&printType=magazines");
        }

        if (printValue === "ebooks") {
            setPrintType("&filter=ebooks");
        }

    }

    function handleSubmit(event) {
        event.preventDefault();
        axios.get("https://www.googleapis.com/books/v1/volumes?q=" + book + printType + "&orderBy=" + ordered + "&key=" + apiKey + "&maxResults=40")  
            .then(data => {  
                console.log(data.data.items);
                setResult(data.data.items);
            }
        )
    }

    function handleSort(event) {
        event.preventDefault();
        var sortDropdown = document.getElementById("slectedSortType");
        var sortValue = sortDropdown.value;

        if (sortValue === "totalreviews") {
            let sortedByTotalReviews = result.sort((p1, p2) => (p2.volumeInfo.ratingsCount?p2.volumeInfo.ratingsCount: '0') - (p1.volumeInfo.ratingsCount?p1.volumeInfo.ratingsCount: '0'));
            
            setResult(sortedByTotalReviews);
            setResult(prevResult => prevResult.filter(e => e !== result));
        }
        
        if (sortValue === "relevance") {
            setOrdered("relevance");

            axios.get("https://www.googleapis.com/books/v1/volumes?q=" + book + "&printType=" + printType + "&orderBy=" + ordered + "&key=" + apiKey + "&maxResults=40")  
                .then(data => {  
                    console.log(data.data.items);
                    setResult(data.data.items);
                }
            )
        }

        if (sortValue === "totalpages") {
            let sortedByTotalPages = result.sort((p1, p2) => (p2.volumeInfo.pageCount?p2.volumeInfo.pageCount: '0') - (p1.volumeInfo.pageCount?p1.volumeInfo.pageCount: '0'));
            
            setResult(sortedByTotalPages);
            setResult(prevResult => prevResult.filter(e => e !== result));
        }

        if (sortValue === "avgreviewshigh") {
            let sortedByReview = result.sort((p1, p2) => (p2.volumeInfo.averageRating?p2.volumeInfo.averageRating: '0') - (p1.volumeInfo.averageRating?p1.volumeInfo.averageRating: '0'));
            
            setResult(sortedByReview);
            setResult(prevResult => prevResult.filter(e => e !== result));
        }

        if (sortValue === "avgreviewslow") {
            let sortedByReview = result.sort((p1, p2) => (p2.volumeInfo.averageRating?p2.volumeInfo.averageRating: '0') - (p1.volumeInfo.averageRating?p1.volumeInfo.averageRating: '0'));
            
            setResult(sortedByReview.reverse());
            setResult(prevResult => prevResult.filter(e => e !== result));
        }

        if (sortValue === "publisheddateold") {

            let sortedBooks = result.sort((a, b) => Date.parse(a.volumeInfo.publishedDate) - Date.parse(b.volumeInfo.publishedDate));
            setResult(sortedBooks);
            setResult(prevResult => prevResult.filter(e => e !== result));
        }

        if (sortValue === "publisheddatenew") {

            let sortedBooks = result.sort((a, b) => Date.parse(a.volumeInfo.publishedDate) - Date.parse(b.volumeInfo.publishedDate));
            setResult(sortedBooks.reverse());
            setResult(prevResult => prevResult.filter(e => e !== result));
        }
        
    }
        
    return (
        <form onSubmit={handleSubmit}>  
        <div className="card-header main-search">  
            <div className="row">  
                <div className="topRow">  
                    <input onChange={handleChange} id="inputValue" className="AutoFocus form-control" placeholder="Type Here For Results!" type="text" />  
                </div>
                <div className="bottomRow">  
                    <div >  
                        <select onChange={handleChange} id="slectedType">
                            <option value="keyword">Keyword</option>
                            <option value="subject">Subject</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="isbn">ISBN Number</option>
                        </select>
                    </div>     
                    <div >  
                        <select onChange={handleChange} id="slectedPrintType">
                            <option value="all">All Print Types</option>
                            <option value="books">Books</option>
                            <option value="magazines">Magazines</option>
                            <option value="ebooks">EBooks</option>
                        </select>
                    </div>
                    <div>  
                        <input type="submit" value="Search" className="btn btn-primary search-btn" />
                    </div>
                </div>
                <div>
                    <h5> Returned {result.length} out of 40 max results</h5>
                    {result.length > 0 ? <div className="hiddenRow">
                    <h5> Sort by:</h5>
                        <select onChange={handleSort} id="slectedSortType">
                            <option value="relevance">Relevance</option>
                            <option value="totalreviews">Total Reviews</option>
                            <option value="totalpages">Total Pages</option>
                            <option value="avgreviewshigh">Avg. Rating -Highest-</option>
                            <option value="avgreviewslow">Avg. Rating -Lowest-</option>
                            <option value="publisheddatenew">Date Published -Newest-</option>
                            <option value="publisheddateold">Date Published -Oldest-</option>
                        </select>
                    </div> : null}
                </div>
            </div>  
        </div>  
        <div className="container-fluid">  
            <div className="row bookOutput"> 
                {result ? result.map(book => (  
                    <div className="col-sm-2" style={{ 'width': '550px'}}>
                        
                        <Card border="secondary" style={{ 'marginTop': '10px', 'marginBottom': '10px'}}>  
                            <Card.Img variant="top" src={book.volumeInfo.imageLinks !== undefined ? book.volumeInfo.imageLinks.thumbnail : ''} alt={book.volumeInfo.title} />  
                            
                            <Card.Body>  
                            {/* Book Info Here */}

                            <div className="topInfo">

                                <div className="bookcard-title">
                                    Title: {book.volumeInfo.title}
                                </div>

                                <div className="bookcard-authors">
                                    Authors: {book.volumeInfo.authors}
                                </div>
                            </div>

                            <div className="midInfo">
                                
                                <div className="leftInfo">
                                    <div className="bookcard-page">
                                    Number of Pages: {book.volumeInfo.pageCount !== undefined && book.volumeInfo.pageCount !== 0 ? book.volumeInfo.pageCount: 'N/A'}
                                    </div>

                                    <div className="bookcard-published">
                                    Published: {book.volumeInfo.publishedDate}
                                    </div>

                                    <div className="bookcard-average-rating">
                                    Average Rating: {book.volumeInfo.averageRating?book.volumeInfo.averageRating:'None'}
                                    </div>
                                </div>

                                <div className="rightInfo">
                                    <div className="bookcard-total-rating">
                                    Total Reviews: {book.volumeInfo.ratingsCount?book.volumeInfo.ratingsCount: '0'}
                                    </div>

                                    <div className="bookcard-price">
                                    Price: {book.saleInfo.saleability === 'FOR_SALE'? '$'+book.saleInfo.listPrice.amount: 'Not Listed'}
                                    </div>

                                    <div className="bookcard-link">
                                    <a href={book.volumeInfo.infoLink}>Link to Book</a>
                                    </div>
                                </div>
                            </div>

                            <div className="bookcard-description">
                            { book.volumeInfo.description?limitString(book.volumeInfo.description, 200):'Description Unavailable' }
                            </div>
                            
                            </Card.Body>  
                        </Card>  
                    </div>  
                )): <p>Unfortunately, no results were found with your search.  Change the search parameters & try again...</p> }
            </div>  
        </div>  
    </form>  
    )
}
