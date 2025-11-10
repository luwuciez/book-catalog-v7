import { useRef } from "react";
import BookForm from "./BookForm";

export default function EditBook({ book, onSubmit }) {
  const dialog = useRef(null);

  function handleSubmit(bookData) {
    onSubmit(bookData);
    dialog.current.close();
  }

  function handleClose() {
    dialog.current.close();
  }

  function showDialog() {
    dialog.current.showModal();
  }

  return (
    <>
      <dialog ref={dialog} className="book__dialog">
        <BookForm book={book} onSubmit={handleSubmit} onClose={handleClose} />
      </dialog>
      <div className="edit" onClick={showDialog}>
        Edit
      </div>
    </>
  );
}
