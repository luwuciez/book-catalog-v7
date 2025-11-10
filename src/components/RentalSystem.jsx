import { useState, useEffect } from "react";

export default function RentalSystem() {
  const [rented, setRented] = useState(() => {
    const saved = localStorage.getItem("rentals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rentals", JSON.stringify(rented));
  }, [rented]);

  function clearRentals() {
    setRented([]);
  }

  return (
    <div className="rental-system">
      <h2>Rental System</h2>
      {rented.length === 0 ? (
        <p>No rented books yet.</p>
      ) : (
        <ul>
          {rented.map((r) => (
            <li key={r.id}>
              {r.title} — {r.renter || "Unknown"}
            </li>
          ))}
        </ul>
      )}
      <button onClick={clearRentals}>Clear Rentals</button>
    </div>
  );
}
