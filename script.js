let data = { audience: [], problem: [], twist: [] };

// Load data from JSON
fetch('ideas.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        console.log("Data loaded successfully");
    })
    .catch(err => console.error("Error loading JSON. Make sure you are running on a local server (like Live Server).", err));

const reels = {
    audience: document.getElementById('reel-audience'),
    problem: document.getElementById('reel-problem'),
    twist: document.getElementById('reel-twist')
};

const locks = {
    audience: document.getElementById('lock-audience'),
    problem: document.getElementById('lock-problem'),
    twist: document.getElementById('lock-twist')
};

const lever = document.getElementById('lever-btn');
const saveBtn = document.getElementById('save-btn');
const vaultList = document.getElementById('vault-list');

// Spin Logic
lever.addEventListener('click', () => {
    lever.disabled = true;
    
    // Start animation
    Object.values(reels).forEach(r => {
        r.classList.add('spinning');
    });

    // Simulate spinning delay
    setTimeout(() => {
        Object.keys(reels).forEach(key => {
            // If not locked, pick new random item
            if (!locks[key].checked) {
                const randomIndex = Math.floor(Math.random() * data[key].length);
                reels[key].innerText = data[key][randomIndex];
            }
        });

        // Stop animation
        Object.values(reels).forEach(r => {
            r.classList.remove('spinning');
        });

        lever.disabled = false;
    }, 1500); // 1.5 seconds of "spinning"
});

// Save Logic
saveBtn.addEventListener('click', () => {
    const idea = {
        audience: reels.audience.innerText,
        problem: reels.problem.innerText,
        twist: reels.twist.innerText,
        date: new Date().toLocaleDateString()
    };

    let savedIdeas = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
    savedIdeas.push(idea);
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));

    renderVault();
    alert("Idea saved to the vault!");
});

// Render Vault items from localStorage
function renderVault() {
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
    vaultList.innerHTML = '';
    
    savedIdeas.reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'vault-item';
        div.innerHTML = `<strong>${item.audience}</strong> | ${item.problem} | <em>${item.twist}</em> <br> <small>${item.date}</small>`;
        vaultList.appendChild(div);
    });
}

// Initial Render
renderVault();
