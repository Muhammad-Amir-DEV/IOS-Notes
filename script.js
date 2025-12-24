
let cam = { x: 0, y: 0, zoom: 1 }, activeNote = null, noteOffset = { x: 0, y: 0 };
let isPanning = false, panStart = { x: 0, y: 0 }, historyStack = [], highestZ = 1000;

const world = document.getElementById('world'), grid = document.getElementById('grid-bg');

const sounds = {
    pop: new Audio('sounds/pop.mp3'),
    paper: new Audio('sounds/paper.mp3')
};
function updateNoteCounter() {
    const counter = document.getElementById('noteCounter');
    if (!counter) return;

    const count = document.querySelectorAll('.note').length;
    counter.textContent = count;

    // Hide badge when no notes
    counter.style.display = count > 0 ? 'flex' : 'none';
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
}
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('final_pro_board_2025'));
    if (saved) {
        cam = saved.cam;
        saved.notes.forEach(n => createNote(n, true));
        updateView();
    } else {
        createNote();
    }

    updateNoteCounter(); // ← important
};



function updateView() {
    world.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.zoom})`;
    grid.style.backgroundPosition = `${cam.x}px ${cam.y}px`;
    grid.style.backgroundSize = `${20 * cam.zoom}px ${20 * cam.zoom}px`;
    save();
}

function adjustZoom(delta) { cam.zoom = Math.max(0.2, Math.min(3, cam.zoom + delta)); updateView(); }
function resetView() { cam = { x: 0, y: 0, zoom: 1 }; updateView(); }

// --- INFINITE PANNING LOGIC ---
let pointers = new Map();
let lastDistance = null;

window.addEventListener('pointerdown', e => {
    pointers.set(e.pointerId, e);

    if (pointers.size === 1 && !activeNote) {
        panStart = { x: e.clientX - cam.x, y: e.clientY - cam.y };
        isPanning = true;
    }

    document.body.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, e);

    // 🔹 Pinch zoom (2 fingers)
    if (pointers.size === 2) {
        const [p1, p2] = [...pointers.values()];
        const dist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);

        if (lastDistance) {
            cam.zoom += (dist - lastDistance) * 0.002;
            cam.zoom = Math.max(0.3, Math.min(3, cam.zoom));
            updateView();
        }

        lastDistance = dist;
        return;
    }

    lastDistance = null;

    // 🔹 Canvas pan
    if (isPanning && !activeNote) {
        cam.x = e.clientX - panStart.x;
        cam.y = e.clientY - panStart.y;
        updateView();
    }

    // 🔹 Note drag
    if (activeNote) {
        let nx = (e.clientX - cam.x) / cam.zoom - noteOffset.x;
        let ny = (e.clientY - cam.y) / cam.zoom - noteOffset.y;
        activeNote.style.left = nx + 'px';
        activeNote.style.top = ny + 'px';
        updateView();
    }
});

window.addEventListener('pointerup', e => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastDistance = null;

    isPanning = false;
    if (activeNote) activeNote.classList.remove('dragging');
    activeNote = null;
    document.body.style.cursor = 'default';
});

window.addEventListener('pointercancel', () => {
    pointers.clear();
    isPanning = false;
    activeNote = null;
});


// --- NOTES LOGIC ---
function hexToRgba(hex, a = 0.6) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
}
function getTextColor(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    // Perceived brightness formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 140 ? '#ffffff' : '#000000';
}

function createNote(restore = null, isUndo = false) {
    const note = document.createElement('div');
    const id = 'n-' + Date.now(); note.id = id; note.className = 'note';
    const palette = ['#ffd60a', '#34c759', '#007aff', '#ff3b30', '#af52de'];
    const startHex = palette[Math.floor(Math.random() * palette.length)];

    const data = restore || {
        x: (Math.random() * (window.innerWidth - 300) - cam.x) / cam.zoom,
        y: (Math.random() * (window.innerHeight - 300) - cam.y) / cam.zoom,
        hex: startHex, rgba: hexToRgba(startHex), rot: ((Math.random() * 6) - 3) + 'deg', content: ''
    };
    note.style.color = getTextColor(data.hex);
    note.style.backgroundColor = data.rgba;
    note.style.color = getTextColor(data.hex);
    note.style.setProperty('--rotation', data.rot);

    note.style.left = data.x + 'px'; note.style.top = data.y + 'px';
    note.style.backgroundColor = data.rgba;
    note.style.setProperty('--rotation', data.rot);
    note.style.zIndex = ++highestZ;

    note.innerHTML = `
            <div class="note-header" onmousedown="grabNote(event, '${id}')">
                <input type="color" class="color-dot" value="${data.hex}" oninput="updateNoteColor('${id}', this.value)">
                <button style="background:none;border:none;cursor:pointer;color:inherit;font-size:18px" onclick="deleteNote('${id}')">✕</button>
            </div>
            <textarea class="note-body" placeholder="Write message..." oninput="save()">${data.content}</textarea>`;
    document.getElementById('board').appendChild(note);
    if (!isUndo) historyStack.push({ type: 'add', id: id });
    save();
updateNoteCounter();

if (!isUndo) {
    playSound(sounds.pop);
}


}


function grabNote(e, id) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    activeNote = document.getElementById(id);
    activeNote.style.zIndex = ++highestZ;
    activeNote.classList.add('dragging');

    noteOffset.x = (e.clientX - cam.x) / cam.zoom - activeNote.offsetLeft;
    noteOffset.y = (e.clientY - cam.y) / cam.zoom - activeNote.offsetTop;
}



function updateNoteColor(id, hex) {
    const el = document.getElementById(id);
    const rgba = hexToRgba(hex);

    el.style.backgroundColor = rgba;
    el.style.color = getTextColor(hex);
    save();
}


function deleteNote(id) {
    const el = document.getElementById(id);

    playSound(sounds.paper); // ← PAPER sound on delete

    historyStack.push({
        type: 'delete',
        id,
        x: el.offsetLeft,
        y: el.offsetTop,
        hex: el.querySelector('.color-dot').value,
        rgba: el.style.backgroundColor,
        rot: el.style.getPropertyValue('--rotation'),
        content: el.querySelector('textarea').value
    });

    el.remove();
updateNoteCounter();
    save();

}


function deleteAll() {
    if (!confirm("Clear board?")) return;

    document.getElementById('board').innerHTML = '';
    localStorage.clear();
    historyStack = [];

    updateNoteCounter(); // 🔴 FIX: update badge
}

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); const a = historyStack.pop(); if (!a) return; if (a.type === 'add') document.getElementById(a.id)?.remove(); else createNote(a, true); save(); }
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); document.querySelectorAll('.note').forEach((n, i) => { n.style.left = (50 + (i % 5) * 280) + 'px'; n.style.top = (50 + Math.floor(i / 5) * 230) + 'px'; n.style.setProperty('--rotation', '0deg'); }); save(); }
});

function save() {
    const notes = Array.from(document.querySelectorAll('.note')).map(n => ({ x: n.offsetLeft, y: n.offsetTop, hex: n.querySelector('.color-dot').value, rgba: n.style.backgroundColor, rot: n.style.getPropertyValue('--rotation'), content: n.querySelector('textarea').value }));
    localStorage.setItem('final_pro_board_2025', JSON.stringify({ cam, notes }));
}

window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('final_pro_board_2025'));
    if (saved) { cam = saved.cam; saved.notes.forEach(n => createNote(n, true)); updateView(); } else createNote();
};
