let allBooks = [];
let currentPage = 1;
const booksPerPage = 5;

document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
});

function fetchBooks() {
    fetch('books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allBooks = data;
            displayBooksPaginated();
        })
        .catch(error => {
            document.getElementById("book-list").innerHTML = "<p>Error fetching books. Please try again later.</p>";
            console.error("Error fetching books:", error);
        });
}

function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>No books found.</p>';
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Year: ${book.year}</p>
        `;
        bookList.appendChild(bookDiv);
    });
}

function applyFilters() {
    let filteredBooks = allBooks;

    const filterAuthor = document.getElementById("filter-author").value.toLowerCase();
    const sortOption = document.getElementById("sort").value;

    if (filterAuthor) {
        filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(filterAuthor));
    }

    if (sortOption === 'title') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'year') {
        filteredBooks.sort((a, b) => a.year - b.year);
    }

    currentPage = 1; // Reset to first page when filters are applied
    displayBooksPaginated(filteredBooks);
}

function changePage(delta) {
    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    currentPage += delta;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    displayBooksPaginated();
}

function displayBooksPaginated(filteredBooks = allBooks) {
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;

    displayBooks(filteredBooks.slice(start, end));
    document.getElementById("current-page").innerText = currentPage;
}
