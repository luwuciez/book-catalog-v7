import { useState, useEffect } from "react";

export default function Rental() {
  const [borrower, setBorrower] = useState("");
  const [bookId, setBookId] = useState("");
  const [weeks, setWeeks] = useState(1);
  const [rentals, setRentals] = useState(() => {
    const saved = localStorage.getItem("rentals");
    return saved ? JSON.parse(saved) : [];
  });

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rentals", JSON.stringify(rentals));
  }, [rentals]);

  function formatDate(date) {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Do nothing if no book is selected
    if (!bookId || !bookId.trim()) return;

    const book = books.find((b) => String(b.id) === String(bookId));
    const now = new Date();
    const due = new Date(now);
    due.setDate(now.getDate() + weeks * 7);

    const newLoan = {
      id: Date.now(),
      borrower: borrower.trim(),
      bookId: book ? book.id : bookId,
      bookTitle: book ? book.title : "Unknown",
      dueDate: due.toISOString(),
    };

    setRentals([newLoan, ...rentals]);
    // reset form
    setBorrower("");
    setBookId("");
    setWeeks(1);
  }

  const availableBooks = books.filter(
    (b) => !rentals.some((r) => String(r.bookId) === String(b.id))
  );

  return (
    <div className="rental-container">
      <div className="form-container">
        {availableBooks.length === 0 ? (
          <div className="no-rent">There are no available books to borrow</div>
        ) : (
          <form onSubmit={handleSubmit} className="form rental-form">
            <div className="input-container">
              <label htmlFor="borrower">Borrower</label>
              <input
                className="form__input"
                id="borrower"
                name="borrower"
                value={borrower}
                onChange={(e) => setBorrower(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="input-container">
              <label htmlFor="rental-book">Book:</label>
              <select
                className="form__input"
                id="rental-book"
                name="rental-book"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              >
                <option value="">Select a book</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-container">
              <label htmlFor="rental-period">Rental period: (in weeks)</label>
              <input
                className="form__input"
                id="rental-period"
                name="rental-period"
                type="number"
                min={1}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value || 1))}
              />
            </div>

            <button type="submit" className="rental-submit" disabled={availableBooks.length === 0}>
              Submit
            </button>
          </form>
        )}
      </div>

      <h3 className="rental-subheading">Currently on loan</h3>

      <div className="rentals-list" style={{ marginTop: 12 }}>
        {rentals.length === 0 && <p>No current loans.</p>}

        {rentals.map((r) => (
          <div key={r.id} className="rental-card">
            <p>Borrower: {r.borrower}</p>
            <p>Book: {r.bookTitle}</p>
            <p>Due date: {formatDate(r.dueDate)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
