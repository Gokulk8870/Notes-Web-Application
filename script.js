var popupoverlay = document.querySelector(".popup-overlay");
var popupbox = document.querySelector(".popup-box");
var addpopup = document.getElementById("add-popup");
var addnote = document.getElementById("add-note");
var notecard = document.getElementById("note-card");
let notes = [];

try {
} catch (error) {}

addpopup.addEventListener("click", function () {
  popupoverlay.style.display = "block";
  popupbox.style.display = "block";
});

addnote.addEventListener("click", function () {
  event.preventDefault();

  let title = document.getElementById("note-title");
  let content = document.getElementById("content");
  const exists = notes.find(
    (note) => note.title.toLowerCase() === title.value.toLowerCase(),
  );
  if (exists) {
    title.value = "";
    alert(
      "Note already exists,title must be unique, content Duplicates allowed",
    );
  } else {
    const obj = {
      id: notes.length,
      title: title.value,
      content: content.value,
    };
    notes.push(obj);
    localStorage.setItem("notes", JSON.stringify(notes));
    display();
    window.location.href = "index.html";
  }
});
function display() {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  notecard.innerHTML = "";
  if (notes.length != 0) {
    notes.forEach((note, index) => {
      notecard.innerHTML += `<div class="note">
                <h3>${note.title}</h3>
                <p >${note.content}</p>
                <div class="btns">
                    <button onclick="editnote(${index})" id="editbtn" class="btn btn-primary">Edit</button>
                    <button onclick="deletenote(${index})"  id="detelebtn" class="btn btn-primary">Delete</button>
                </div>
            </div>`;
    });
  } else {
    notecard.innerHTML = "<p>No notes found</p>";
  }
}
function editnote(id) {
  popupoverlay.style.display = "block";
  popupbox.style.display = "block";
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  const oldnote = notes.find((note) => note.id == id);
  document.getElementById("note-title").value = oldnote.title;
  document.getElementById("content").value = oldnote.content;
  let newtitle = document.getElementById("note-title");
  let newcontent = document.getElementById("content");
  const updatebtn = document.getElementById("update");

  updatebtn.hidden = false;
  addnote.hidden = true;

  updatebtn.addEventListener("click", function () {
    event.preventDefault();
    notes[id].title = newtitle.value;
    notes[id].content = newcontent.value;
    localStorage.setItem("notes", JSON.stringify(notes));

    display();
    window.location.href = "index.html";
  });
}

// notecard.innerHTML+=`<div click="edit(${index})" class="note">
//         <h3>${title}</h3>
//         <p >${content}</p>
//         <button onclick="deletenote(${index})" class="btn btn-primary">Delete</button>
//         </div>`

function deletenote(id) {
  notes.splice(id, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  display();
}

display();
