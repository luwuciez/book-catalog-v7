import { useRef } from "react";
import BookForm from "./BookForm";

export default function AddBook({ addFunction }) {
  const dialog = useRef(null);

  function handleClick() {
    dialog.current.showModal();
  }

  function handleSubmit(bookData) {
    addFunction(bookData);
    dialog.current.close();
  }

  function handleClose() {
    dialog.current.close();
  }

  return (
    <>
      <dialog ref={dialog} className="book__dialog">
        <BookForm onSubmit={handleSubmit} onClose={handleClose} />
      </dialog>
      <div className="add__button" onClick={handleClick}>
        <span className="material-symbols-rounded">add</span>
      </div>
    </>
  );
}
