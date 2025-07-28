let myLibrary = [];

function Book(title, author, pages, isRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function displayBooks() {
  const bookList = document.getElementById("book-list");
  const bookCount = document.getElementById("book-count");

  bookList.innerHTML = "";

  // Update book count
  const count = myLibrary.length;
  bookCount.textContent = `${count} ${count === 1 ? "book" : "books"}`;

  if (myLibrary.length === 0) {
    // Show empty state
    bookList.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="bi bi-book"></i>
          <h4>No books in your library yet</h4>
          <p>Add your first book using the form on the left!</p>
        </div>
      </div>
    `;
    return;
  }

  myLibrary.forEach((book) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card book-card shadow-sm h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const title = document.createElement("h5");
    title.className = "card-title book-title";
    title.textContent = book.title;

    const author = document.createElement("h6");
    author.className = "card-subtitle mb-2 book-author";
    author.textContent = `by ${book.author}`;

    const pages = document.createElement("p");
    pages.className = "card-text book-pages mb-2";
    pages.innerHTML = `<i class="bi bi-file-earmark-text me-1"></i>${book.pages} pages`;

    const readStatus = document.createElement("span");
    readStatus.className = `badge ${
      book.isRead
        ? "bg-success text-white read-status"
        : "bg-warning text-dark not-read-status"
    } book-read-status mt-auto`;
    readStatus.innerHTML = book.isRead
      ? '<i class="bi bi-check-circle me-1"></i>Read'
      : '<i class="bi bi-clock me-1"></i>Not Read';

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "mt-2 d-flex gap-2";

    const toggleButton = document.createElement("button");
    toggleButton.className = `btn btn-sm ${
      book.isRead ? "btn-outline-warning" : "btn-outline-success"
    } flex-fill`;
    toggleButton.innerHTML = book.isRead
      ? '<i class="bi bi-arrow-clockwise me-1"></i>Mark Unread'
      : '<i class="bi bi-check me-1"></i>Mark Read';
    toggleButton.onclick = (e) => {
      e.stopPropagation();
      toggleReadStatus(book.id);
      displayBooks();
    };

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-sm btn-outline-danger";
    removeButton.innerHTML = '<i class="bi bi-trash"></i>';
    removeButton.title = "Remove book";
    removeButton.onclick = (e) => {
      e.stopPropagation();
      if (
        confirm(
          `Are you sure you want to remove "${book.title}" from your library?`
        )
      ) {
        removeBookFromLibrary(book.id);
        displayBooks();
        showToast(
          "success",
          "Book removed successfully!",
          `"${book.title}" has been removed from your library.`
        );
      }
    };

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(removeButton);

    cardBody.appendChild(title);
    cardBody.appendChild(author);
    cardBody.appendChild(pages);
    cardBody.appendChild(readStatus);
    cardBody.appendChild(buttonContainer);

    card.appendChild(cardBody);
    col.appendChild(card);
    bookList.appendChild(col);
  });
}

function addBookToLibrary(book) {
  console.log("Adding book to library:", book);
  myLibrary.push(book);
}

function removeBookFromLibrary(bookId) {
  const book = myLibrary.find((book) => book.id === bookId);

  if (!book) {
    console.error("Book not found in library:", bookId);
    return;
  }

  myLibrary = myLibrary.filter((book) => book.id !== bookId);
  console.log("Removed book from library:", book);
}

function toggleReadStatus(bookId) {
  const book = myLibrary.find((book) => book.id === bookId);
  if (book) {
    book.isRead = !book.isRead;
    console.log("Toggled read status for book:", book);
  }
}

const form = document.getElementById("book-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const pages = parseInt(document.getElementById("book-pages").value);
  const isRead = document.getElementById("is-read").checked;

  if (title && author && pages && pages > 0) {
    const newBook = new Book(title, author, pages, isRead);
    addBookToLibrary(newBook);
    form.reset();
    displayBooks();

    showToast(
      "success",
      "Book added successfully!",
      `"${title}" has been added to your library.`
    );
  } else {
    showToast(
      "error",
      "Please fill in all fields correctly.",
      "Make sure all fields are filled and page count is greater than 0."
    );
  }
});

// Toast notification function
function showToast(type, title, message) {
  const toastContainer =
    document.getElementById("toast-container") || createToastContainer();

  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header ${
        type === "success" ? "bg-success text-white" : "bg-danger text-white"
      }">
        <i class="bi ${
          type === "success" ? "bi-check-circle" : "bi-exclamation-triangle"
        } me-2"></i>
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
  toast.show();

  // Remove toast element after it's hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "1055";
  document.body.appendChild(container);
  return container;
}

displayBooks();
