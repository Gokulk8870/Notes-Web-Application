
var popupoverlay=document.querySelector(".popup-overlay");
var popupbox=document.querySelector(".popup-box");
var addpopup=document.getElementById("add-popup");
var addnote=document.getElementById("add-note");
var notecard=document.getElementById("note-card");
let notes=[];


try{
    
}
catch(error){

}
addpopup.addEventListener("click",function(){
    popupoverlay.style.display="block";
    popupbox.style.display="block";
});
addnote.addEventListener("click",function(){
    event.preventDefault();
    let title=document.getElementById("note-title");
    let content=document.getElementById("content");
    const obj={title:title.value,content:content.value};
    notes.push(obj);
    localStorage.setItem("notes", JSON.stringify(notes));
    display();
});
function display(){
    notes = JSON.parse(localStorage.getItem("notes")) || [];
    notecard.innerHTML="";
    if(notes.length!=0){
        notes.forEach((note,index)=>{ 
            
            notecard.innerHTML+=`<div class="note">
            <h3>${note.title}</h3>
            <p >${note.content}</p>
            <button onclick="deletenote(${index})" class="btn btn-primary">Delete</button>
            <
            </div>`
        });
    }
    else{
        notecard.innerHTML="<p>No notes found</p>"
    }

}
function edit(id){
    addnote.addEventListener(click,function(){
         let title=notes[id].title;
        let content=notes[id].content;
        console.log(title,content);
    })
   
    // notecard.innerHTML+=`<div click="edit(${index})" class="note">
    //         <h3>${title}</h3>
    //         <p >${content}</p>
    //         <button onclick="deletenote(${index})" class="btn btn-primary">Delete</button>
    //         </div>`
}
function deletenote(id){
    
    notes.splice(id,1);
     localStorage.setItem("notes", JSON.stringify(notes));
    display();
    
}

display();







