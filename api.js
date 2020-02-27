import store from './store.js'




//url for my own personal endpoint. 
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Curtis-Sessions/bookmarks'





//  I didnt copy this. i memorized it from our shopping-list-api day. it took 8 days with flash cards. my wife quizzed me
function retrieveApi (...args) {
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        store.error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          store.error.message = res.statusText;
          return Promise.reject(store.error);
        }
      }
      return res.json();
    })
    .then(data => {

      if (store.error) {
        store.error.message = data.message;
        return Promise.reject(store.error);
      }
      return data;
    });
};


function getBookmarks() {
  return retrieveApi(`${BASE_URL}`);
}

function createBookmark(arg) {
  console.log(arg);
  const newItem = arg;
  return retrieveApi(`${BASE_URL}`, {
    "method": "POST",
    body: newItem,
    headers: {
      'content-type': 'application/json'
    }
  })
}

function deleteBookmark(id) {
  return retrieveApi(BASE_URL + '/' + id, {
    method: 'DELETE'
  });
};

export default {
  getBookmarks,
  createBookmark,
  deleteBookmark
}