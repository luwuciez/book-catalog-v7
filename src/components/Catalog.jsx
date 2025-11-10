import { useState, useEffect } from "react";
import AddBook from "./AddBook.jsx";
import EditBook from "./EditBook.jsx";
import BookDetails from "./BookDetails.jsx";

export default function Catalog() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [detailsBook, setDetailsBook] = useState(null);
  const [rentals, setRentals] = useState(() => {
    const saved = localStorage.getItem("rentals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "rentals") {
        const newRentals = e.newValue ? JSON.parse(e.newValue) : [];
        setRentals(newRentals);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function addBook(book) {
    setBooks([...books, book]);
  }

  function updateBook(updatedBook) {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)));
  }

  function deleteBook() {
    const selected = books.find((book) => book.isSelected);

    if (selected) {
      const isRented = rentals.some((rental) => String(rental.bookId) === String(selected.id));
      if (isRented) {
        return;
      }

      setBooks(books.filter((book) => book.id !== selected.id));
    }
  }

  function selectBook(book) {
    setBooks(
      books.map((b) => ({
        ...b,
        isSelected: b.id === book.id ? !b.isSelected : false,
      }))
    );
  }

  // Get unique authors for the filter
  const authors = ["All", ...new Set(books.map((book) => book.author))];

  // Filter books based on selected author
  const filteredBooks =
    selectedAuthor === "All" ? books : books.filter((book) => book.author === selectedAuthor);

  // Check if a book is currently rented
  function isRented(bookId) {
    return rentals.some((rental) => String(rental.bookId) === String(bookId));
  }

  if (detailsBook) {
    return <BookDetails book={detailsBook} onDismiss={() => setDetailsBook(null)} />;
  }

  return (
    <div className="catalog-container">
      <div className="controls">
        <AddBook addFunction={addBook} />
        <div className="filter">
          <label htmlFor="authorFilter">Filter by Author:</label>
          <select
            id="authorFilter"
            className="author-filter"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            {authors.map((author) => (
              <option key={author} value={author}>
                {author === "All" ? "All" : author}
              </option>
            ))}
          </select>
        </div>
        <EditBook book={books.find((book) => book.isSelected)} onSubmit={updateBook} />
        <div className="delete" onClick={deleteBook}>
          Delete
        </div>
      </div>
      <div className="catalog">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`book ${book.isSelected ? "selected" : ""}`}
            onClick={() => selectBook(book)}
          >
            <div className="book__image">
              {book.image ? (
                <img src={book.image} alt={book.title} className="book__cover" />
              ) : (
                <div className="book-placeholder-thumb" aria-hidden>
                  <div className="placeholder-title-thumb">{book.title}</div>
                </div>
              )}
            </div>
            <div className="book__info">By: {book.author}</div>
            {isRented(book.id) && <div className="book__rental-status">On Loan</div>}
            <button
              className="book__details-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering book selection
                setDetailsBook(book);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
