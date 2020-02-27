'use strict'

import api from './api.js';
import store from './store.js';


//serializer for parsing user input
function serializeJson(form) {
  let formData = new FormData(form);;
  const o = {};
  formData.forEach((val, name) => o[name] = val);
  return JSON.stringify(o);
}

// These functions generate the html used by render()



function generateInitialView(f) {
  let html = `<h1>Your Bookmarks</h1>
  <section class="bkmrks-list">
      <form id ="buttons">
        <input type="submit" name="new" value="new" id="js-new-item"/>
        <select id="filter-select" aria-label="Star Rating">
          <option value="1" id= "1">1 star</option>
          <option value="2" id= "2">2 star</option>
          <option value="3" id= "3">3 star</option>
          <option value="4" id= "4">4 star</option>
          <option value="5" id= "5">5 star</option>
        </select>
        <input type="button" name="filter-submit" value="filter" id= "filter-submit">
      </form>
        <ul class="bookmark-list">
        ${f()}
        </ul>
        </section>`

  return html;
}



//adjusts user view when they have filtered
function handleFilterChange() {
  $('main').on('click', '#filter-submit', function (event) {
    event.preventDefault();
    let filterValue = $('#filter-select').val();
    store.filter = parseInt(filterValue);
    render()
    console.log(store.filter)
  });
}

function  generateBookmarkString () {
  let items = store.bookmarks.filter(item => item.rating >= store.filter)
  items = items.map((item) => generateBookmark(item));
  return items.join('');
}

function generateBookmark (item) {
  let list = '';
  if (item.expanded === true) {
    list = `<li class="bookmark-expanded js-bookmark" item-id="${item.id}">
            ${item.title}  <div type="button" id="delete-button" item-id=${item.id}><i class="fas fa-trash"></i></div> 
        
        <div class="expanded-header">
          <input type="button" value="visit site" id="visit-button" onclick="location.href = '${item.url}';"> 
          <div class="expanded-stars" aria-label="${item.rating} star rating">${generateRating(item.rating)}</div>
        </div>
        <p>${item.desc}</p></li> `
  } else {
    list = `<li class="bookmark-title js-bookmark" item-id="${item.id}">
      ${item.title}<div class="rating" >${generateRating(item.rating)}</div ></li >`
  }
  return list;
}

function generateRating(rating) {
  let stars = ''
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars += `<i class="fas fa-star"></i>`
    } else { stars += `<i class="far fa-star"></i>` }
  } return stars;
}

function addBookmark() {
  let html = `<h1>Bookmarks</h1>
  <section class= "bkmrks-container">
          <form id="new-bookmark-form">
            <h4>Add Bookmark</h4>
              <input name="url" type="text" placeholder="URL" id="new-bookmark-url" aria-label="Bookmark URL">
            <div>
              <input name="title" type="text" placeholder="Title" id="new-bookmark-name">
              <select name="rating" id="stars">
                <option value="1 stars">1 star</option>
                <option value="2 stars">2 star</option>
                <option value="3 stars">3 star</option>
                <option value="4 stars">4 star</option>
                <option value="5 stars">5 star</option>
        </select>
            </div>
            <input name="desc" type="text" placeholder="Description" id="new-bookmark-description">
            <input type="submit" id="new-item-submit">
            <div class="error-container"></div>
          </form>
          </section>`
  return html;
}

//if the user attempts to submit a new bookmark without the required input fields this function runs with the error message
function displayError() {
  let html = `${addBookmark()}<div id="error-message">${store.error}</div>`;
  return html;
}


// event listeners for user

function handleExpand() {
  $('main').on('click', '.js-bookmark', event => {
    let id = getItemIdFromElement(event.currentTarget);
    let bookmark = store.findById(id);
    store.toggleExpand(bookmark);
    render()

  })
}

//this function removes the bookmark from my endpoint, and the local store, if an error is associated with the returned promise 
//it is displayed for the user
function handleDeleteItem() {
  $('main').on('click', '#delete-button', event => {
    let id = getItemIdFromElement(event.target)
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      })
  })
}

//renders the screen for expanded bookmark view
function handleAddingToggle() {
  $('main').on('click', '#js-new-item', event => {
    event.preventDefault();
    store.adding = true;
    render();

  })
}
// when user interacts with input fields during 'add new bookmark' this function takes care of creating the object for store and sending
// the object data to my endpoint on the server
function handleNewItemSubmit() {
  $('main').on('submit','#new-bookmark-form', event => {
    console.log("new item submit is listening");
    event.preventDefault();
    let data = serializeJson(event.target)
    console.log(data)
    api.createBookmark(data)
      .then((newItem) => {
        console.log(newItem);
        store.addItem(newItem);
        store.adding = false;
        store.filter = 0;
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  })
}



// error functions
const generateError = function (message) {
  return `
      <section class="error-content">
        <button type="button" id="cancel-btn">Cancel</button>
        <p>Please fill out required fields.</p>
      </section>
    `;
};

function renderError() {

//error var associated with store module export contains value for notifying user of problems with input
  if (store.error) {
    console.log("There has been a malfunction!");
    const el = generateError(store.error);
    $('.error-container').html(el);
    handleCancel();
  }
  
   else {
    $('.error-container').empty();
  }
};
// I have yet to get this listener's function working properly
function handleCancel () {
console.log("handle cancel is listening shhhhhh....");
  $('#cancel-btn').on('click',(event) => {
    console.log("you clicked CANCEL!");
    event.preventDefault();
    store.adding = false;
    store.error=null;
    render();
    
   
  });
};


// renders the user view live as they interact with the App :)
function render() {
  //does nothing if there is not a current error
  renderError();

  let html = '';

//view state changes if user has chosen to add a new bookmark
  if (store.adding === true) {
    html = addBookmark()
  }
  //if the value of error has changed state from its initial value of null displayError will inject the msg into the html
   else if (store.error != null) {
    html = displayError()
  }
  
  //finally, if no errors are present the initial view of the app will render
   else { html = generateInitialView(generateBookmarkString) }
  $('main').html(html)
  store.filter = 0
}



const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-bookmark')
    .attr('item-id');
};



export default {

  handleExpand,
  handleDeleteItem,
  handleNewItemSubmit,
  handleAddingToggle,
  render,
  handleCancel,
  handleFilterChange
}
