document.addEventListener("DOMContentLoaded", function () {

    var popupOverlay = document.getElementById("popup-overlay");
    var popupBox = document.getElementById("popup-box");
    var addPopupBtn = document.getElementById("add-popup");
    var addNoteBtn = document.getElementById("add-note");
    var cancelNoteBtn = document.getElementById("cancel-note");
    var notesGrid = document.getElementById("notes-grid");
    var emptyState = document.getElementById("empty-state");

    // Load notes on page load
    async function loadNotes() {
        try {
            const res = await fetch("/notes");
            if (!res.ok) throw new Error("Server error: " + res.status);
            const notes = await res.json();
            renderNotes(notes);
        } catch (err) {
            console.error("Failed to load notes:", err);
            notesGrid.innerHTML = "";
            emptyState.style.display = "block";
            emptyState.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Could not connect to server. Make sure <strong>node server.js</strong> is running.`;
        }
    }

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString("en-US", {
            day: "numeric", month: "short", year: "numeric"
        });
    }

    function renderNotes(notes) {
        notesGrid.innerHTML = "";

        if (notes.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";
        notes.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";
            card.innerHTML = `
                <div class="note-title">${escapeHtml(note.title)}</div>
                <div class="note-content">${escapeHtml(note.content)}</div>
                <span class="note-date">
                    <i class="fa-regular fa-clock me-1"></i>${formatDate(note.id)}
                </span>
                <button class="btn-delete" data-id="${note.id}" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>`;
            notesGrid.appendChild(card);
        });

        // Attach delete listeners (avoids inline onclick XSS risk)
        notesGrid.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", function () {
                deleteNote(Number(this.dataset.id));
            });
        });
    }

    // Escape HTML to prevent XSS in note content
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // Show popup
    addPopupBtn.addEventListener("click", function () {
        popupOverlay.style.display = "block";
        popupBox.style.display = "block";
        document.getElementById("note-title").focus();
    });

    // Close popup
    function closePopup() {
        popupOverlay.style.display = "none";
        popupBox.style.display = "none";
        document.getElementById("note-title").value = "";
        document.getElementById("content").value = "";
    }

    cancelNoteBtn.addEventListener("click", closePopup);

    // Close only when clicking the overlay itself, not the popup box
    popupOverlay.addEventListener("click", closePopup);
    popupBox.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closePopup();
    });

    // Add note
    addNoteBtn.addEventListener("click", async function () {
        const title = document.getElementById("note-title").value.trim();
        const content = document.getElementById("content").value.trim();

        if (!title || !content) {
            alert("Please fill in both title and content.");
            return;
        }

        try {
            const res = await fetch("/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            });
            if (!res.ok) throw new Error("Failed to save note");
            closePopup();
            loadNotes();
        } catch (err) {
            console.error("Failed to add note:", err);
            alert("Could not save note. Make sure the server is running.");
        }
    });

    // Delete note
    async function deleteNote(id) {
        try {
            const res = await fetch(`/notes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete note");
            loadNotes();
        } catch (err) {
            console.error("Failed to delete note:", err);
            alert("Could not delete note. Make sure the server is running.");
        }
    }

    loadNotes();
});
