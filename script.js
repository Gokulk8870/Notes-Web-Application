var popupoverlay=document.querySelector(".popup-overlay");
var popupbox=document.querySelector(".popup-box");
var addpopup=document.getElementById("add-popup");
var addnote=document.getElementById("add-note");
let notes=[];

addpopup.addEventListener("click",function(){
    popupoverlay.style.display="block";
    popupbox.style.display="block";
});
addnote.addEventListener("click",function(){
    let title=document.getElementById("note-title");
    let content=document.getElementById("content");
    const obj={title:title.value,content:content.value};
    notes.push(obj);
});






