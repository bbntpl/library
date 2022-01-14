/*** DATABASE ***/
const myLibrary = [{
    title: 'The Body Keeps The Score',
    author: 'Bessel van der Kolk',
    pages: '464',
    readStatus: 'plan to read',
    notes: ''
}];

const libraryStatus = {
    sort: {
        category: 'title',
        order: 'ascending'
    },
    display: 'all'
}

/*** DOM INSTANCES ***/
const bookshelfEl = document.querySelector('.library__bookshelf');

//DOM informative elements - inputs
const bookTitleInput = document.getElementById('book__title');
const bookAuthorInput = document.getElementById('book__author');
const bookPagesInput = document.getElementById('book__pages');
const bookReadStatusInput = document.getElementById('book__read-status');
const bookNotesInput = document.getElementById('book__notes');

//DOM buttons
const bookSubmitBtn = document.getElementById('library__book-submit');

/*** OBJECT CONSTRUCTOR ***/
function Book(title, author, pages, status, notes) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = status;
    this.notes = notes;
}

/*** HTML MANIPULATION ***/

//remove the elements that display the books in table
function removeBooksInTable() {
    while (bookshelfEl.firstChild)
    bookshelfEl.removeChild(bookshelfEl.lastChild);
}

//Update the element that presents as the bookshelf of the library
function updateBookShelf() {
    myLibrary.forEach((v, i) => updateBookRow(i));
}

//update the bookshelf by adding a set of book info
function updateBookRow(index) {
    const newTableRow = document.createElement('tr');
    bookshelfEl.append(newTableRow);
    const book = myLibrary[index];
    for (const info in book) {
        const newTableBookInfo = document.createElement('td');
        newTableRow.append(newTableBookInfo);
        newTableBookInfo.textContent = book[info];
    }
    const newTableBookInfo = document.createElement('td');
    newTableRow.append(newTableBookInfo);

    appendEditBook(newTableBookInfo);
    appendRemoveBook(newTableBookInfo);
}

//add elements that allow books to be edited or removed
function bookOptions() {

}

//append button that allow to edit book information
function appendEditBook(tableData) {
    const editBtn = document.createElement('button');
    tableData.append(editBtn);
    editBtn.textContent = 'edit';
    editBtn.classList.add('edit-btn');
}

//append button that allow to remove book
function appendRemoveBook(tableData) {
    const rmvBtn = document.createElement('button');
    tableData.append(rmvBtn);
    rmvBtn.textContent = 'remove'
}

//Reset the value of the inputs after submitting a book
function clearBookSubmissionInputs() {
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    bookPagesInput.value = '';
    bookNotesInput.value = '';
}

/*** ARRAY FUNCTIONS ***/
//add book to the library
function addBookToTheLibrary(title, author, pages, status, notes) {
    const newBook = new Book(title, author, pages, status, notes);
    myLibrary.push(newBook);
}

//submit the book
function submitBook() {
    const bookTitleVal = bookTitleInput.value;
    const bookAuthorVal = bookAuthorInput.value;
    const bookPagesVal = bookPagesInput.value;
    const bookReadStatusVal = bookReadStatusInput.value;
    const bookNotesVal = bookNotesInput.value;
    addBookToTheLibrary(bookTitleVal, bookAuthorVal, bookPagesVal, bookReadStatusVal, bookNotesVal);
    clearBookSubmissionInputs();
    updateBookRow(myLibrary.length - 1);
}

function removeBook() {
    
}

function editBook(){

}

/*** EVENT LISTENERS */
bookSubmitBtn.addEventListener('click', submitBook);

/*** INITIALIZATION */
if (myLibrary) {
    updateBookShelf(myLibrary.length - 1);
}
