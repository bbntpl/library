/*** DATABASE ***/
const myLibrary = [{
    id: 1,
    title: 'The Body Keeps The Score',
    author: 'Bessel van der Kolk',
    pages: '464',
    readStatus: 'plan to read',
    notes: 'Gut is an underrated organ',
},
{
    id: 2,
    title: 'Pro Git',
    author: 'Scott Chacon & Ben Straub',
    pages: '261',
    readStatus: 'reading',
    notes: 'Just in case if I wanted to become a Git God one day'
},
{
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    pages: '400',
    readStatus: 'read',
    notes: 'Best read of 2021',
}];

// filtered bookshelf
const myCurrentLibrary = [...myLibrary];

const myLibraryStatus = {
    sort: {
        category: 'id',
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
const bookReadStatusInput = document.getElementById('book__readStatus');
const bookNotesInput = document.getElementById('book__notes');
const searchbarEl = document.querySelector('.searchbar');

// DOM buttons and links
const bookSubmitBtn = document.getElementById('library__book-submit');
const bookFilterBtns = document.querySelectorAll('.book-status__filter');


/*** HELPER FUNCTIONS ***/
function createElementAndAppend(tag, parent, className) {
    const element = document.createElement(tag);
    parent.append(element);
    if (Array.isArray(className)) {
        element.classList.add(...className)
    } else {
        element.classList.add(className)
    }
    return element;
}
function createElementAndInsertBefore(tag, parent, className) {
    const element = document.createElement(tag);
    parent.insertBefore(element, parent.lastChild);
    if (Array.isArray(className)) {
        element.classList.add(...className)
    } else {
        element.classList.add(className)
    }
    return element;
}

function removeChildNodesExceptOneById(element, id) {
    while (element.firstChild.className !== id) { element.removeChild(element.firstChild) }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function strToLowercaseWithoutSpaces(str) {
    return str.toLowerCase().replaceAll(' ', '');
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

//remove the elements that display the books in table
function removeBooksInTable() {
    while (bookshelfEl.childNodes.length > 2) {
        bookshelfEl.removeChild(bookshelfEl.lastChild);
    }
}

//Update the element that presents as the bookshelf of the library
function updateBookShelf(library) {
    library.forEach((v, i) => updateBookDisplay(i));
}

//update the bookshelf by adding a set of book info
function updateBookDisplay(index) {
    if (!myCurrentLibrary[index]) return;
    const newTableRow = createElementAndAppend('div', bookshelfEl, 'tr');
    const book = myCurrentLibrary[index];
    const bookId = myCurrentLibrary[index].id;
    for (const prop in book) {
        if (prop !== 'id') {
            const newTableBookInfo = createElementAndAppend('div', newTableRow, 'td');
            newTableBookInfo.classList.add(`book__${prop}--info`);
            newTableBookInfo.textContent = book[prop];
        }
    }
    const newTableBookInfo = createElementAndAppend('div', newTableRow, 'td');
    newTableBookInfo.classList.add('btns-container');
    appendEditBook(newTableBookInfo, bookId);
    appendRemoveBook(newTableBookInfo, bookId);
}

//Redisplay the presented books from the table
function redisplayBookshelf(library) {
    removeBooksInTable();
    updateBookShelf(library);
}

//change class and text content to save btn
function replaceClassNameAndText(element, oldClass, newClass, text) {
    element.classList.remove(oldClass);
    element.classList.add(newClass);
    if (text) {
        element.textContent = text;
    }
}

//append button that allow to edit book information
function appendEditBook(tableData, bookId) {
    const editBtn = createElementAndAppend('button', tableData, 'edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleEditMode(e, bookId);
    });
}

//append button that allow to remove book
function appendRemoveBook(tableData, bookId) {
    const rmvBtn = createElementAndAppend('button', tableData, 'rmv-btn');
    rmvBtn.textContent = 'Remove';
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
function addBookToTheLibrary(lib, title, author, pages, status, notes, id) {
    const newBook = new Book(title, author, pages, status, notes, id);
    lib.push(newBook);
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
    //Add the book for the main library and filtered library for display
    addBookToTheLibrary(myLibrary, bookTitleVal, bookAuthorVal, bookPagesVal, bookReadStatusVal, bookNotesVal, nextBookId);
    addBookToTheLibrary(myCurrentLibrary, bookTitleVal, bookAuthorVal, bookPagesVal, bookReadStatusVal, bookNotesVal, nextBookId)
    clearBookSubmissionInputs();
    if(bookReadStatusVal === 'all' || bookReadStatusVal !== myLibraryStatus.display){
        updateBookDisplay(myCurrentLibrary.length - 1);
    }
    incrementTotalBooks();
}

function removeBook(bookId) {
    for (let i = myLibrary.length - 1; i >= 0; --i) {
        if (myLibrary[i].id === bookId) {
            myLibrary.splice(i, 1);
        }
    }
    const filteredLibrary = filterBookshelf('readStatus', validateBookStatusDisplay());
    redisplayBookshelf(filteredLibrary);
}

function toggleEditMode(toggleBtn, bookId) {
    //reference the grandparent of the passed element
    const tr = toggleBtn.target.parentElement.parentElement;

    //get the object based on the prop that matches with the given value
    const filteredLibrary = myLibrary.filter(o => o.id === bookId);

    if (toggleBtn.target.className === 'edit-btn') {
        editBook(tr, toggleBtn, filteredLibrary, bookId);
    } else {
        updateBook(tr, toggleBtn, bookId);
    }
}

function editBook(grandparentEl, toggleBtn, filteredLibrary, bookId) {
    replaceClassNameAndText(toggleBtn.target, 'edit-btn', 'save-btn', 'Save');
    removeChildNodesExceptOneById(grandparentEl, 'td btns-container');
    //insert new children of inputs associated with book property
    for (const prop in filteredLibrary[0]) {
        if (prop === 'id') continue;
        //insert a div with td class element before the first child
        const td = createElementAndInsertBefore('div', grandparentEl, ['td', 'book-input']);

        //insert a child based on the target prop key
        if (prop === 'readStatus') {
            const select = htmlToElement(`<select name="read-status" id="book__${prop}--edit${bookId}"></select>`)
            const readStatusOptions = ['read', 'reading', 'plan to read'];
            td.append(select);
            readStatusOptions.forEach(v => {
                select.append(htmlToElement(`<option value="${v}" ${filteredLibrary[0][prop] === v ? 'selected="selected"' : ''}">${v}</option>`));
            })
        } else if (prop === 'notes') {
            td.append(htmlToElement(`<textarea id="book__${prop}--edit${bookId}" placeholder="notes">${filteredLibrary[0][prop]}</textarea>`));
        } else {
            td.append(htmlToElement(`<input id="book__${prop}--edit${bookId}" type="text" placeholder="${prop}" value="${filteredLibrary[0][prop]}"/>`));
        }
    }
}

function updateBook(grandparentEl, toggleBtn, bookId) {
    replaceClassNameAndText(toggleBtn.target, 'save-btn', 'edit-btn', 'Edit');

    /* get the index of the filtered library that matches 
    the given value based on the prop */
    const index = myLibrary.map(o => o.id).indexOf(bookId);

    //update the property of the the selected book
    for (const prop in myLibrary[index]) {
        if (prop === 'id') continue;
        myLibrary[index][prop] = document.getElementById(`book__${prop}--edit${bookId}`).value;
    }
    removeChildNodesExceptOneById(grandparentEl, 'td btns-container');

    //display the updated information as a children of the target element 
    for (const prop in myLibrary[index]) {
        if (prop !== 'id') {
            const td = createElementAndInsertBefore('div', grandparentEl, 'td');
            grandparentEl.classList.add(`book__${prop}--info`);
            td.textContent = myLibrary[index][prop];
        }
    }
}

function filterBookshelf(prop, val) {
    //if the value is false replace the current library with the main library
    if (!val) { 
        myCurrentLibrary.splice(0, myCurrentLibrary.length, ...myLibrary);
        return myCurrentLibrary;
    } else {
        //otherwise if the value is a string filter the library
        const filteredReadStatus = myLibrary.filter(book => book[prop] === val);
        //replace the current library
        myCurrentLibrary.splice(0, myCurrentLibrary.length, ...filteredReadStatus);
        return myCurrentLibrary;
    }
}

//filter the objects of the library using the included characters of title or author
function searchbarFilter(str) {
    const newStr = strToLowercaseWithoutSpaces(str);
    console.log(myLibraryStatus.display);
    const filteredReadStatus = filterBookshelf('readStatus', validateBookStatusDisplay()).filter(book => {
        const newTitle = strToLowercaseWithoutSpaces(book.title);
        const newAuthor = strToLowercaseWithoutSpaces(book.author);
        return newTitle.includes(newStr) || newAuthor.includes(newStr);
    });
    console.log(filteredReadStatus);
    return myCurrentLibrary.splice(0, myCurrentLibrary.length, ...filteredReadStatus);
}

function updateBookshelfByKeyword(e){
    const libraryFilteredByKeyword = searchbarFilter(e.target.value);
    redisplayBookshelf(libraryFilteredByKeyword);
}

function sortItemsByProperty(prop, order){

}

function validateBookStatusDisplay() {
    return myLibraryStatus.display === 'all' ? false : myLibraryStatus.display;
}
/*** EVENT LISTENERS */
bookSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitBook();
});

bookFilterBtns.forEach(el => {
    el.addEventListener('click', () => {
        if (el.parentElement.classList.contains('status__selected')) return;
        bookFilterBtns.forEach(el => {
            replaceClassNameAndText(el.parentElement, 'status__selected', 'status__not-selected', null);
        });
        //Set the class of the clicked element parent as active
        replaceClassNameAndText(el.parentElement, 'status__not-selected', 'status__selected', null);
        const filterKey = el.id.split('__')[1].replaceAll('-', ' ');
        myLibraryStatus.display = filterKey;
        if (filterKey !== 'all') {
            const filteredLibrary = filterBookshelf('readStatus', filterKey);
            redisplayBookshelf(filteredLibrary);
        } else {
            const filteredLibrary = filterBookshelf('readStatus', false);
            redisplayBookshelf(filteredLibrary);
        }
    });
});

searchbarEl.addEventListener('input', (e) => updateBookshelfByKeyword(e));

/*** INITIALIZATION */
if (myLibrary) {
    updateBookShelf(myLibrary);
}