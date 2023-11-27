let drawIntervalId;
let drawTimeoutId;

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const namesTextarea = document.getElementById('names');
    const errorMessage = document.querySelector('.error-message');
    const saveButton = document.getElementById('save');
    const removeWinnerToggle = document.getElementById('removeWinnerToggle');

    // Function to toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('open');
    }

    // Event listener for the Menu button
    document.getElementById('menu').addEventListener('click', () => {
        toggleSidebar();
    });

    // Event listener for the Close button in sidebar
    document.getElementById('closeSidebar').addEventListener('click', () => {
        toggleSidebar();
    });

    // Event listener for the Save button
    saveButton.addEventListener('click', () => {
        const names = namesTextarea.value.split('\n');
        if (names.length > 500) {
            errorMessage.hidden = false;
            return;
        }
        errorMessage.hidden = true;
        if (names.length === 0 || names[0].trim() === '') {
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

    // Event listener for the Draw button
    document.getElementById('draw').addEventListener('click', () => {
        let names = JSON.parse(localStorage.getItem('names') || '[]');
        const nameContainer = document.getElementById('name-container');
        const drawingTime = parseInt(document.getElementById('drawingTime').value, 10) * 1000;

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
        }
    });
});
