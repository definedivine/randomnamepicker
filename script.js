let drawIntervalId;
let drawTimeoutId;
let drawnNames = [];

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const namesTextarea = document.getElementById('names');
    const errorMessage = document.querySelector('.error-message');
    const saveButton = document.getElementById('save');
    const removeWinnerToggle = document.getElementById('removeWinnerToggle');
    const fileUpload = document.getElementById('fileUpload');
    const historyList = document.getElementById('history-list');

    // Function to toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('open');
    }

    // Event listener for the Menu button
    document.getElementById('menu').addEventListener('click', toggleSidebar);

    // Event listener for the Close button in sidebar
    document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);

    // Handle file upload
    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 100000) { // Limit file size to 100KB
                alert("File is too large. Please upload a file smaller than 100KB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileNames = e.target.result.split(/\r?\n/).filter(name => name.trim() !== '');
                namesTextarea.value = fileNames.join('\n');
            };
            reader.readAsText(file);
        }
    });

    // Event listener for the Save button
    saveButton.addEventListener('click', () => {
        const names = namesTextarea.value.split('\n').filter(name => name.trim() !== '');
        if (names.length > 500) {
            errorMessage.hidden = false;
            return;
        }
        errorMessage.hidden = true;
        if (names.length === 0) {
            alert("Please enter names in the names container.");
            return;
        }
        localStorage.setItem('names', JSON.stringify(names));
        toggleSidebar();
    });

    // Function to generate random names
    function generateRandomName(names) {
        const randomIndex = Math.floor(Math.random() * names.length);
        return names[randomIndex];
    }

    // Update drawn names history
    function updateHistory(name) {
        drawnNames.push(name);
        const listItem = document.createElement('li');
        listItem.textContent = name;
        historyList.appendChild(listItem);
        localStorage.setItem('drawnNames', JSON.stringify(drawnNames));
    }

    // Load drawn names from localStorage
    function loadDrawnNames() {
        const storedDrawnNames = JSON.parse(localStorage.getItem('drawnNames') || '[]');
        drawnNames = storedDrawnNames;
        drawnNames.forEach(name => {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            historyList.appendChild(listItem);
        });
    }

    // Initial load
    loadDrawnNames();

    // Event listener for the Draw button
    document.getElementById('draw').addEventListener('click', () => {
        let names = JSON.parse(localStorage.getItem('names') || '[]');
        const nameContainer = document.getElementById('name-container');
        const drawingTime = parseInt(document.getElementById('drawingTime').value, 10) * 1000;

        // Prevent duplicate winners if toggle is on
        if (removeWinnerToggle.checked) {
            names = names.filter(name => !drawnNames.includes(name));
        }

        if (names.length > 0) {
            clearInterval(drawIntervalId);
            clearTimeout(drawTimeoutId);

            nameContainer.classList.add('blink-text');
            drawIntervalId = setInterval(() => {
                nameContainer.innerText = generateRandomName(names);
            }, 150);

            drawTimeoutId = setTimeout(() => {
                clearInterval(drawIntervalId);
                nameContainer.classList.remove('blink-text');
                const chosenName = generateRandomName(names);
                nameContainer.innerText = chosenName;

                // Update history
                updateHistory(chosenName);

                // Remove the winner from the list if toggle is on
                if (removeWinnerToggle.checked) {
                    names = names.filter(name => name !== chosenName);
                    localStorage.setItem('names', JSON.stringify(names));
                }

                // Trigger confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, drawingTime);
        } else {
            alert("No names left to draw.");
        }
    });
});
