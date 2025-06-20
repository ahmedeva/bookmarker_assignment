//! SELECTORS
const NameInput = document.querySelector("#siteName");
const UrlInput = document.querySelector("#siteUrl");
const formBtnSubmit = document.querySelector(".form__btn--submit");
const formBtnUpdate = document.querySelector(".form__btn--update");
const searchInput = document.querySelector("#search");
const tableContainer = document.querySelector(".table__body");
//! ====================================================================== !//

//! VARIABELS & CONDITIONALS
let bookmarks = [];
let currentEditIndex = null;

if (localStorage.getItem("bookmarks") !== null) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  handleDisplay();
}

//! ====================================================================== !//
//! FUNCTIONS & HANDLERS

//?? ADDING & DISPLAYING ROWS
function handleAdd() {
  const siteObject = {
    title: NameInput.value,
    url: UrlInput.value,
  };
  bookmarks.push(siteObject);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  handleDisplay();
  handleClear();
}

//?? DOM MANIPULATION & INJECTING ROWS
function handleDisplay() {
  tableContainer.innerHTML = "";

  //   Coulda used for ... of or even a normal for loop...
  bookmarks.forEach((obj, i) => {
    let html = `
     <tr>
            <td>${i}</td>
            <td>${obj.title}</td>
            <td>
              <a class="btn fs-5 btn-success" onclick="handleVisit(${i})"><i class="fa-solid fa-eye"></i>Visit</a>
            </td>
            <td> <a class="btn fs-5 btn-warning" onclick="handleEdit(${i})"><i class="fa-solid fa-pen-to-square"></i>Edit</a></td>
            <td>
              <a class="btn fs-5 btn-danger" onclick="handleDelete(${i})"><i class="fa-solid fa-trash"></i>Delete</a>
            </td>
          </tr>
    
    `;

    tableContainer.insertAdjacentHTML("beforeend", html);
  });
}

//?? EDITING AND RESUBMITTING ROWS
function handleEdit(index) {
  NameInput.value = bookmarks[index].title;
  UrlInput.value = bookmarks[index].url;

  formBtnSubmit.style.display = "none";
  formBtnUpdate.style.display = "inline-block";
  currentEditIndex = index;
}

formBtnUpdate.addEventListener("click", (e) => {
  if (currentEditIndex === null) return;
  e.preventDefault();

  bookmarks[currentEditIndex] = {
    title: NameInput.value,
    url: UrlInput.value,
  };
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  handleDisplay();
  formBtnSubmit.style.display = "inline-block";
  formBtnUpdate.style.display = "none";
  handleClear();
  currentEditIndex = null;
});

//?? DOM MANIPULATION & DELETING ROWS
const handleDelete = function (index) {
  // We are using the splice() method to mutate the original array and
  // specifying 1 as the deleteCount
  bookmarks.splice(index, 1);

  // There is no other way to make the list mutation reflect in the localStorage but-
  // to use setItem() again to update since we cannot use clear() or removeItem() in this situation
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // Now that we deleted the item from the array and the storage, we need to re-display the new data on screen
  handleDisplay();
};

//?? VISITING FUNCTIONALITY onClick
const handleVisit = function (index) {
  let url = bookmarks[index].url;

  // If the URL does not start with http:// or https://, prepend https://

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  window.open(url, "_blank", "noopener");
};

//?? CLEAR FIELDS FUNCTIONALITY
const handleClear = function () {
  NameInput.value = "";
  UrlInput.value = "";
  searchInput.value = "";
};

//! ====================================================================== !//
//! EVENT LISTENERs

searchInput.addEventListener("input", (e) => {
  let searchQuery = searchInput.value.toLowerCase().trim();

  tableContainer.innerHTML = "";

  bookmarks.forEach((site, i) => {
    if (
      site.title.toLowerCase().trim().includes(searchQuery) ||
      site.url.toLowerCase().trim().startsWith(searchQuery)
    ) {
      let html = `
     <tr>
            <td>${i}</td>
            <td>${site.title}</td>
            <td>
              <a class="btn btn-success" onclick="handleVisit(${i})"><i class="fa-solid fa-eye"></i>Visit</a>
            </td>
            <td> <a class="btn fs-5 btn-warning" onclick="handleEdit(${i})"><i class="fa-solid fa-pen-to-square"></i>Edit</a></td>
            <td>
              <a class="btn btn-danger" onclick="handleDelete(${i})"><i class="fa-solid fa-trash"></i>Delete</a>
            </td>
          </tr>
    
    `;

      tableContainer.insertAdjacentHTML("beforeend", html);
    }
  });
});

formBtnSubmit.addEventListener("click", (e) => {
  //! GUARD CLAUSE 🧐
  e.preventDefault();
  if (currentEditIndex !== null) return;
  if (NameInput.value === "" || UrlInput.value === "") return;

  handleAdd();
});

//? ====================================================================== ?//
//! ====================================================================== !//

//! REGEX EXPLANATION
/*
  1. 
    / ... /i
  This is how we write a regular expression in JavaScript.
  The i at the end means: ignore case (so it matches HTTP as well as http).

  2.
  /^https?:/i
This matches URLs that start with http or https:

^ = beginning of the string

http = literal match

s? = the "s" is optional (s? matches 0 or 1 "s")

So far, this matches both http and https.

3.
/^https?:\/\//i
Now we need to match the full prefix like http:// or https://.

We add :// — but slashes are special in regex, since / ends the pattern.

To match a literal slash /, we must escape it using a backslash: \/

So :// becomes :\/\/
  */
