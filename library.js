/*** DATABASE ***/
const myLibrary = [{
    title: 'The Body Keeps The Score',
    author: 'Bessel van der Kolk',
    pages: '464',
    readStatus: 'plan to read',
    notes: '',
    id: 1
},
{
    title: 'Pro Git',
    author: '',
    pages: '261',
    readStatus: 'reading',
    notes: '',
    id: 2
},
{
    title: 'Atomic Habits',
    author: 'James Clear',
    pages: '400',
    readStatus: 'read',
    notes: 'Best read of 2020',
    id: 3
}];

const myCurrentLibrary = myLibrary;

const myLibraryStatus = {
    sort: {
        category: 'title',
        order: 'ascending'
    },
    display: 'all',
    totalBooks: myLibrary.length //including removed ones
}

/*** DOM INSTANCES ***/
const bookshelfEl = document.querySelector('.library__bookshelf');

// DOM informative elements - inputs
const bookTitleInput = document.getElementById('book__title');
const bookAuthorInput = document.getElementById('book__author');
const bookPagesInput = document.getElementById('book__pages');
const bookReadStatusInput = document.getElementById('book__read-status');
const bookNotesInput = document.getElementById('book__notes');

// DOM buttons
const bookSubmitBtn = document.getElementById('library__book-submit');


/*** HELPER FUNCTIONS ***/
function createElementWithClass(tag, parent, className) {
    const element = document.createElement(tag);
    parent.append(element);
    element.classList.add(className);
    return element;
}
function removeAllChildrenExceptLastChild(element) {
    const elementChildren = element.childNodes;
    while (element.firstChild) {
        element.removeChild(elementChildren[elementChildren.length - 2]);
    }
}
/*** OBJECT CONSTRUCTOR ***/
function Book(title, author, pages, status, notes, id) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = status;
    this.notes = notes;
}

/*** HTML MANIPULATION ***/

//remove the elements that display the books in table
function removeBooksInTable() {
    while (bookshelfEl.childNodes.length > 2) {
        bookshelfEl.removeChild(bookshelfEl.lastChild);
    }
}

//Update the element that presents as the bookshelf of the library
function updateBookShelf() {
    myLibrary.forEach((v, i) => updateBookRow(i));
}

//update the bookshelf by adding a set of book info
function updateBookRow(index) {
    const newTableRow = createElementWithClass('div', bookshelfEl, 'tr');
    const book = myCurrentLibrary[index];
    const bookId = myCurrentLibrary[index].id;
    for (const prop in book) {
        if (prop !== 'id') {
            const newTableBookInfo = createElementWithClass('div', newTableRow, 'td');
            newTableBookInfo.classList.add(`book__${prop}--info`);
            newTableBookInfo.textContent = book[prop];
        }
    }
    const newTableBookInfo = createElementWithClass('div', newTableRow, 'td');
    appendEditBook(newTableBookInfo, bookId);
    appendRemoveBook(newTableBookInfo, bookId);
}

//Redisplay the presented books from the table
function redisplayBookshelf() {
    removeBooksInTable();
    updateBookShelf();
}

//append button that allow to edit book information
function appendEditBook(tableData, bookId) {
    const editBtn = createElementWithClass('button', tableData, 'edit-btn');
    editBtn.textContent = 'edit';
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        editBook(e, bookId);
    });
}

//append button that allow to remove book
function appendRemoveBook(tableData, bookId) {
    const rmvBtn = createElementWithClass('button', tableData, 'rmv-btn');
    rmvBtn.textContent = 'remove';
    rmvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        removeBook(bookId);
    });
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
function addBookToTheLibrary(title, author, pages, status, notes, id) {
    const newBook = new Book(title, author, pages, status, notes, id);
    myLibrary.push(newBook);
}

const incrementTotalBooks = () => myLibraryStatus.totalBooks++;

//submit the book
function submitBook() {
    const bookTitleVal = bookTitleInput.value;
    const bookAuthorVal = bookAuthorInput.value;
    const bookPagesVal = bookPagesInput.value;
    const bookReadStatusVal = bookReadStatusInput.value;
    const bookNotesVal = bookNotesInput.value;
    const nextBookId = myLibraryStatus.totalBooks + 1;
    addBookToTheLibrary(bookTitleVal, bookAuthorVal, bookPagesVal, bookReadStatusVal, bookNotesVal, nextBookId);
    clearBookSubmissionInputs();
    updateBookRow(myLibrary.length - 1);
    incrementTotalBooks();
}

function removeBook(bookId) {
    for (let i = myLibrary.length - 1; i >= 0; --i) {
        if (myLibrary[i].id === bookId) {
            myLibrary.splice(i, 1);
        }
    }
    redisplayBookshelf();
}

function editBook(element, bookId) {
    const tr = element.target.parentElement.parentElement;
    if (element.target.className === 'edit-btn') {
        element.target.classList.remove('edit-btn');
        element.target.classList.add('save-btn');
        element.target.textContent = 'Save';
        //removeAllChildrenExceptLastChild(tr);

        const filteredLibrary = myLibrary.filter(o => o.id === bookId);

        for (const prop of filteredLibrary[0]) {
            const div = createElementWithClass('div', tr, 'td');
            if (prop === 'readStatus') {

            } else if (prop === 'notes') {

            } else if (prop !== 'id') {
                const textInput = createElementWithClass('div', tr, 'td');

            }
        }
        const 

    } else {
        //Get the className of the active form inputs
        
        element.target.classList.remove('save-btn');
        element.target.classList.add('edit-btn');
        element.target.textContent = 'Edit';
        removeAllChildrenExceptLastChild(tr);
        for (const prop of filteredLibrary[0]) {
            if (prop === 'readStatus'){

            }
        }
    }
}

/*** APPEND INPUTS */
function appendInput(tag,) {

}


/*** EVENT LISTENERS */
bookSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitBook();
});

/*** INITIALIZATION */
if (myLibrary) {
    updateBookShelf();
}
