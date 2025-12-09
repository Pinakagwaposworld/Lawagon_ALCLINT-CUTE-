// In-memory storage for notes
let notes = [];
let currentFilter = 'all';
let searchQuery = '';

// Load notes on startup
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    initEventListeners();
});

// Initialize all event listeners
function initEventListeners() {
    document.getElementById('add-note').addEventListener('click', addNote);
    
    document.getElementById('note-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNote();
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderNotes();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderNotes();
        });
    });
}

// Add a new note
function addNote() {
    const input = document.getElementById('note-input');
    const category = document.getElementById('category-select').value;
    const text = input.value.trim();

    if (!text) return;

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        })
    };

    notes.unshift(note);
    saveNotes();
    renderNotes();
    input.value = '';
}

// Delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

// Render notes to the DOM
function renderNotes() {
    const container = document.getElementById('notes-container');
    
    let filteredNotes = notes.filter(note => {
        const matchesFilter = currentFilter === 'all' || note.category === currentFilter;
        const matchesSearch = note.text.toLowerCase().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    if (filteredNotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                </svg>
                <p>No notes found. Start creating!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <span class="note-category category-${note.category}">${note.category}</span>
                <span class="note-date">${note.date}</span>
            </div>
            <div class="note-content">${note.text}</div>
            <div class="note-actions">
                <button class="btn-delete" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Save notes to memory
function saveNotes() {
    // Store in memory only - no localStorage
    // Notes persist only during the current session
}

// Load notes from memory
function loadNotes() {
    // Load from memory only
    renderNotes();
}