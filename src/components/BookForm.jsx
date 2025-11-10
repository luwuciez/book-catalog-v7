import { nanoid } from "nanoid";

export default function BookForm({ book, onSubmit, onClose }) {
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    onSubmit({
      id: book?.id || nanoid(),
      title: data.get("title"),
      author: data.get("author") || "Unknown",
      publisher: data.get("publisher"),
      year: data.get("year"),
      language: data.get("language"),
      pages: data.get("pages"),
      image: data.get("image"),
      isSelected: book?.isSelected || false,
    });

    e.target.reset();
  }

  return (
    <div className="form-container">
      <h2 className="form__title">{book ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-container">
          <label htmlFor="title">Title</label>
          <input
            className="form__input"
            type="text"
            id="title"
            name="title"
            defaultValue={book?.title}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="author">Author</label>
          <input
            className="form__input"
            type="text"
            id="author"
            name="author"
            defaultValue={book?.author}
          />
        </div>
        <div className="two-column">
          <div className="input-container">
            <label htmlFor="publisher">Publisher</label>
            <input
              className="form__input"
              type="text"
              id="publisher"
              name="publisher"
              defaultValue={book?.publisher}
            />
          </div>
          <div className="input-container">
            <label htmlFor="year">Publication Year</label>
            <input
              className="form__input"
              type="number"
              id="year"
              name="year"
              defaultValue={book?.year}
            />
          </div>
        </div>
        <div className="two-column">
          <div className="input-container">
            <label htmlFor="language">Language</label>
            <input
              className="form__input"
              type="text"
              id="language"
              name="language"
              defaultValue={book?.language}
            />
          </div>
          <div className="input-container">
            <label htmlFor="pages">Pages</label>
            <input
              className="form__input"
              type="number"
              id="pages"
              name="pages"
              defaultValue={book?.pages}
            />
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="image">Image URL</label>
          <input
            className="form__input"
            type="text"
            id="image"
            name="image"
            defaultValue={book?.image}
          />
        </div>
        <div className="form__buttons">
          <div className="form__close" onClick={onClose}>
            Cancel
          </div>
          <button className="form__save" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
