function findById (id) {
  return this.bookmarks.find(currentItem => currentItem.id === id);
};


let error = null;
let filter = 0;
let bookmarks = [];
let adding = false;


function toggleExpand(bookmark) {
  bookmark.expanded = !bookmark.expanded;
}

function addItem(item) {
  bookmarks.push(item);

}

function setError(e) {
  this.error = e;
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};
export default {
  setError,
  filter,
  toggleExpand,
  findAndDelete,
  addItem,
  findById,
  bookmarks,
  adding,
  error
}