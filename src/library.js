import { app } from './init.js';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "../node_modules/firebase/firebase-auth.js";
import { getDatabase, ref } from "../node_modules/firebase/firebase-database.js";

/*** FIREBASE ***/
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
function uploadBookToCloud(bookId, title, author, pages, readStatus, notes, uid) {
    const db = getDatabase(app);
    const libraryRef = ref(db, `users/${uid}/myLibrary`);
    //const newPostRef = push(postListRef);
    set(libraryRef, {
        id: bookId,
        title: title,
        author: author,
        pages: pages,
        readStatus: readStatus,
        notes: notes,
    });
}

function removeBookFromCloud() {

}

function editBookOnCloud() {

}
function uploadLibraryToCloud(uid) {
    if (!auth.current) return;
    const db = getDatabase(app);
    set(ref(db, 'users/' + uid), {
        id: bookId,
        title: title,
        author: author,
        pages: pages,
        readStatus: readStatus,
        notes: notes,
    });
}

function retrieveLibraryFromCloud(uid) {
    const db = getDatabase();
    const remoteLibraryRef = ref(db, `users/${uid}/library`);
    remoteLibraryRef.once('value', (snap) => {
        clearLibraryData();
        snap.forEach(b => {
            const book = b.val();
            const localBook = new Book(book.title, book.author, book.pages, book.status, book.notes, book.id);
            myLibrary.push(localBook);
        });
    });
    redisplayBookshelf(myLibrary);
}

function validateSignedInUser() {
    const auth = getAuth();
    return !!auth.currentUser;
}

function validateUserFirstTimeSignedIn(uid) {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);
    return userRef.once('value', snapshot => {
        if (!snapshot.exists()) {
            const userData = snapshot.val();
            uploadLibraryToCloud(uid);
            return !!userData;
        }
    });
}
function checkIfLibraryFromCloudExists(userId) {
    const db = getDatabase();
    const libraryRef = ref(db, 'users/' + userId + '/library');
    return libraryRef.once("value", snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return !!userData;
        }
    });
}

/*** LOCAL STORAGE ***/
const updateLocalStorage = (name, array) => localStorage.setItem(name, JSON.stringify(array));
const getItemFromLocal = (name) => JSON.parse(localStorage.getItem(name));
const deleteLocalStorage = (name) => localStorage.removeItem(name);

/*** DATABASE ***/
const myLibrary =
    window.localStorage.getItem('myLibrary') ? getItemFromLocal('myLibrary') : [{
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
        pages: '440',
        readStatus: 'reading',
        notes: 'Just in case if I wanted to Git God one day'
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
    display: 'all',
    totalBooks: myLibrary.length //including removed ones
}

/*** DOM INSTANCES ***/
const bookshelfEl = document.querySelector('.library__bookshelf');
const libraryNameEl = document.getElementById('library__name');
const userProfileImageEl = document.querySelector('.library__photo-id');
const avatarWrapperEl = document.querySelector('.avatar-wrapper');

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
const authBtn = document.querySelector('.auth-btn');
const clearLocalDataBtn = document.querySelector('.clear-data__local');

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
    while (element.firstChild.className !== id) {
        element.removeChild(element.firstChild);
    }
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

function displayUserProfile(name, photoURL) {
    avatarWrapperEl.style.visibility = 'visible';
    avatarWrapperEl.style.width = '40px';
    avatarWrapperEl.style.height = '40px';
    userProfileImageEl.src = photoURL;
    libraryNameEl.textContent = `${name}'s Library`;
}

function hideUserProfile() {
    userProfileImageEl.src = '';
    avatarWrapperEl.style.width = '0px';
    avatarWrapperEl.style.height = '0px';
    avatarWrapperEl.style.visibility = 'hidden';
    libraryNameEl.textContent = 'My Library';
}

//undisplay the element that display books info by removing
//child nodes of the element that contains them
function removeBooksInTable() {
    while (bookshelfEl.childNodes.length > 2) {
        bookshelfEl.removeChild(bookshelfEl.lastChild);
    }
}

//Update the element that presents as the bookshelf of the library
function updateBookShelf(library) {
    library.forEach((v, i) => updateBookDisplay(i));
}

//empty the library array
function clearLibraryData() {
    myLibrary.splice(0, myLibrary.length);
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
    if (bookReadStatusVal === 'all' || bookReadStatusVal !== myLibraryStatus.display) {
        updateBookDisplay(myCurrentLibrary.length - 1);
    }
    incrementTotalBooks();
    updateLocalStorage('myLibrary', myLibrary);
}

function removeBook(bookId) {
    for (let i = myLibrary.length - 1; i >= 0; --i) {
        if (myLibrary[i].id === bookId) {
            myLibrary.splice(i, 1);
        }
    }
    const filteredLibrary = filterBookshelf('readStatus', validateBookStatusDisplay());
    redisplayBookshelf(filteredLibrary);
    updateLocalStorage('myLibrary', myLibrary);
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
    the value of the id */
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
    updateLocalStorage('myLibrary', myLibrary);
}

function filterBookshelf(prop, status) {
    // !status === the book display is not filtered then it'll replace the current
    // library with main library
    if (!status) {
        myCurrentLibrary.splice(0, myCurrentLibrary.length, ...myLibrary);
        return myCurrentLibrary;
    } else {
        //otherwise if the value is a string filter the library
        const filteredReadStatus = myLibrary.filter(book => book[prop] === status);
        //replace the current library with the filtered library
        myCurrentLibrary.splice(0, myCurrentLibrary.length, ...filteredReadStatus);
        return myCurrentLibrary;
    }
}

//filter the objects of the library using the included characters of title or author
function searchbarFilter(str) {
    //making sure both keyword and the keyword being searched
    //have the same pattern casing
    const newStr = strToLowercaseWithoutSpaces(str);
    const filteredReadStatus = filterBookshelf('readStatus', validateBookStatusDisplay()).filter(book => {
        const newTitle = strToLowercaseWithoutSpaces(book.title);
        const newAuthor = strToLowercaseWithoutSpaces(book.author);
        return newTitle.includes(newStr) || newAuthor.includes(newStr);
    });
    return myCurrentLibrary.splice(0, myCurrentLibrary.length, ...filteredReadStatus);
}

function updateBookshelfByKeyword(e) {
    const libraryFilteredByKeyword = searchbarFilter(e.target.value);
    redisplayBookshelf(libraryFilteredByKeyword);
}

function validateBookStatusDisplay() {
    return myLibraryStatus.display === 'all' ? false : myLibraryStatus.display;
}

function confirmLocalStorageDeletion(name) {
    if (!getItemFromLocal(name)) return;
    const confirmAction = confirm("Are you sure you want to clear the local data?");
    if (confirmAction) {
        deleteLocalStorage('myLibrary');
        clearLibraryData();
        redisplayBookshelf(myLibrary);
        console.log(getItemFromLocal('myLibrary'));
    }
}

/*** EVENT LISTENERS ***/
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
clearLocalDataBtn.addEventListener('click', () => confirmLocalStorageDeletion('myLibrary'));
searchbarEl.addEventListener('input', (e) => updateBookshelfByKeyword(e));
authBtn.addEventListener('click', (e) => {
    if (authBtn.classList.contains('signin-btn')) {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('user signed in successfully');
                // The signed-in user info.
                const user = result.user;
                const uid = user.uid;
                //Add auth profile
                displayUserProfile(user.displayName, user.photoURL)
                replaceClassNameAndText(e.target, 'signin-btn', 'signout-btn', 'Sign out');
                //retrieveLibraryFromCloud(uid);

                validateUserFirstTimeSignedIn(uid);
                //checkIfLibraryFromCloudExists(token);
                // ...
            }).catch((error) => {
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error('Error Code: ' + error.code);
                console.error('Error Message: ' + error.message);
                console.error('Error Email: ' + error.email)
                console.error('Credential Error:' + credential);
            });
    } else if (authBtn.classList.contains('signout-btn')) {
        signOut(auth).then(() => {
            console.log('user signed out successfully');
            hideUserProfile();
            replaceClassNameAndText(e.target, 'signout-btn', 'signin-btn', 'Sign in');
        }).catch((error) => {
            console.error('Error Code: ' + error.code);
            console.error('Error Message: ' + error.message);
            console.error('Error Email: ' + error.email)
            console.error('Credential Error:' + credential);
        });
    }
})

/*** INITIALIZATION ***/
if (myLibrary) {
    updateBookShelf(myLibrary);
}

auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log('User is signed in successfully')
        displayUserProfile(user.displayName, user.photoURL)
        replaceClassNameAndText(authBtn, 'signin-btn', 'signout-btn', 'Sign out');
        console.log(validateUserFirstTimeSignedIn);
        if (validateSignedInUser()) {
        // retrieveLibraryFromCloud(uid);
        // } else {

        // }
    }
});
