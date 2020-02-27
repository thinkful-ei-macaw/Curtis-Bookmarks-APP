'use strict'

import bookmark from './bookmark.js'
import api from './api.js';
import store from './store.js'



function main() {
  api.getBookmarks()
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmark.render();
    });
  bookmark.handleNewItemSubmit();
  bookmark.handleAddingToggle();
  bookmark.render();
  bookmark.handleExpand();
  bookmark.handleDeleteItem();
  bookmark.handleFilterChange();
}



$(main);