import { useState, useEffect } from "react";

export default function BookDetails({ book, onDismiss }) {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch similar books with multiple fallback queries and retry option.
  async function fetchSimilarBooks() {
    setLoading(true);
    setError(null);
    setSimilarBooks([]);

    // Build a list of progressively simpler queries to try
    const candidates = [];
    const title = (book.title || "").trim();
    const author = (book.author || "").trim();
    const publisher = (book.publisher || "").trim();

    if (title && author) candidates.push(`${title} ${author}`);
    if (title) candidates.push(title);
    if (author) candidates.push(author);
    if (publisher) candidates.push(publisher);

    if (candidates.length === 0) {
      setLoading(false);
      setError("No metadata available to search for similar books.");
      return;
    }

    let lastError = null;
    for (const q of candidates) {
      try {
        const url = `https://api.itbook.store/1.0/search/${encodeURIComponent(q)}`;
        const response = await fetch(url);
        if (!response.ok) {
          lastError = new Error(`HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        const results = data.books || [];
        // Filter out the current book (case-insensitive match on title)
        const filtered = results.filter((b) => b.title.toLowerCase() !== title.toLowerCase());
        if (filtered.length > 0) {
          setSimilarBooks(filtered.slice(0, 4));
          setLoading(false);
          return;
        }
      } catch (err) {
        // network error or JSON error
        lastError = err;
        // try next candidate
        continue;
      }
    }

    // No results from any query
    setSimilarBooks([]);
    setLoading(false);
    setError(lastError ? lastError.message : "No similar books found.");
  }

  useEffect(() => {
    fetchSimilarBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  return (
    <div className="book-details">
      <button className="dismiss-button" onClick={onDismiss}>
        Back to Catalog
      </button>

      <div className="book-details__main">
        <div className="book-details__image">
          {book.image ? (
            <img src={book.image} alt={book.title} className="book__cover" />
          ) : (
            <div className="book-placeholder" aria-hidden>
              <div className="placeholder-title">{book.title}</div>
            </div>
          )}
        </div>

        <div className="book-details__info">
          <h2>{book.title}</h2>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Publisher:</strong> {book.publisher || "Not available"}
          </p>
          <p>
            <strong>Publication Year:</strong> {book.year || "Not available"}
          </p>
          <p>
            <strong>Pages:</strong> {book.pages || "Not available"}
          </p>
          <p>
            <strong>ISBN:</strong> {book.isbn || "Not available"}
          </p>
        </div>
      </div>

      <div className="similar-books">
        <h3>Similar Books</h3>
        {loading && <p>Loading similar books...</p>}
        {error && (
          <div>
            <p className="error">Error loading similar books: {error}</p>
            <button
              onClick={fetchSimilarBooks}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "none",
                background: "#105e87",
                color: "white",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        )}
        {!loading && similarBooks.length === 0 && <p>No similar books found.</p>}

        <div className="similar-books__grid">
          {similarBooks.map((book) => (
            <a href={book.url} target="_blank">
              <div key={book.isbn13} className="similar-book">
                <img src={book.image} alt={book.title} />
                <h4>{book.title}</h4>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
