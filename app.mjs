import Game from './models/game.mjs';
import './example.json' with { type: 'json' };

// Inject memory with localStorage data and display it
let games = loadLocal();
displayGames();

function saveLocal(game) {
    new Game(
        game.title,
        game.designer,
        game.artist,
        game.publisher,
        game.year,
        game.players,
        game.time,
        game.difficulty,
        game.url,
        game.playCount,
        game.personalRating
    );
    // Save the game to localStorage with title as the key
    localStorage.setItem(game.title, JSON.stringify(game));
    displayGames();
}

// Retrieve games from localStorage as an array of objects
function loadLocal() {
    let games = Object.keys(localStorage).map(key => {
        return JSON.parse(localStorage.getItem(key));
    });
    return games;
}

// Unused function to print games in JSON format, good for debugging
function listGamesJSON() {
    let games = loadLocal();
    return JSON.stringify(games, null, 2)
}

// Saves each game from JSON to localStorage
function importGamesJSON(data) {
    JSON.parse(data).forEach(game => {
        saveLocal(game);
        });
}

// Input type file to import JSON data with File reader
document.getElementById('importSource').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            importGamesJSON(e.target.result);
            window.location.reload(); // Reloads the page to see results
        };
        reader.readAsText(file);
    }
});

// Generates HTML for each game in the array
function displayGames() {
    const gamesContainer = document.getElementById('gamesDisplay');
    gamesContainer.innerHTML = ''; // Empties to prevent duplicates

    games.forEach((game, index) => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game-entry';
        gameElement.innerHTML = `
            <h3>${game.title}<button class="removeButton" data-game-title="${game.title}">X</h3>
            <p>Year: ${game.year} Players: ${game.players} Time: ${game.time} Difficulty: ${game.difficulty}</p>
            <br>
            <p>Designer: ${game.designer}</p>
            <p>Artist: ${game.artist}</p>
            <p>Publisher: ${game.publisher}</p>
            <p>BGG Listing: <a href="${game.url}" target="_blank">${game.url}</a></p>
            <br>
            <p>Play Count: <span class="playCount">${game.playCount}</span> 
                <button class="playCountIncrement" data-game-index="${index}">+</button></p>
            <p>Personal Rating: <input type="range" min="0" max="10" value="${game.personalRating}" class="ratingSlider" data-game-index="${index}">${game.personalRating}</input></p>
        `;
        gamesContainer.appendChild(gameElement);
    });

    // Event listeners for buttons and sliders
    document.querySelectorAll('.playCountIncrement').forEach(button => {
        button.addEventListener('click', incrementPlayCount);
    });

    document.querySelectorAll('.ratingSlider').forEach(slider => {
        slider.addEventListener('input', updateRating);
    });

    document.querySelectorAll('.removeButton').forEach(button => {
        button.addEventListener('click', (event) => {
            const title = event.target.getAttribute('data-game-title');
            removeGame(title);
        });
    });
}

// Increments the playCount of a game visually and in localStorage
function incrementPlayCount(event) {
    const index = event.target.getAttribute('data-game-index');

    games[index].playCount++;

    saveLocal(games[index]);

    event.target.previousElementSibling.innerText = games[index].playCount;
}

// Updates personal rating of a game visually and in localStorage
function updateRating(event) {
    const index = event.target.getAttribute('data-game-index');
    const newRating = event.target.value;
    
    games[index].personalRating = newRating;
        
    saveLocal(games[index]);

    event.target.nextElementSibling.innerText = newRating;
}

// Adds a blank game entry to the top of the list, with input fields for game data
document.getElementById('addGame').addEventListener('click', () => {
    const gamesContainer = document.getElementById('gamesDisplay');
    const formContainer = document.createElement('div');
    formContainer.className = 'game-entry editing';
    
    formContainer.innerHTML = `
        <div class="edit-form">
            <h3><input type="text" class="edit-title" placeholder="Game Title" value=""></h3>
            <p>Year: <input type="text" class="edit-year" value="" size="4"></p>
            <p>Players: <input type="text" class="edit-players" value=""></p>
            <p>Time: <input type="text" class="edit-time" value=""></p>
            <p>Difficulty: 
                <select class="edit-difficulty">
                    <option value="Light">Light</option>
                    <option value="Light-Medium">Light-Medium</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Medium-Heavy">Medium-Heavy</option>
                    <option value="Heavy">Heavy</option>
                </select>
            </p>            
            <p>Designer: <input type="text" class="edit-designer" value=""></p>
            <p>Artist: <input type="text" class="edit-artist" value=""></p>
            <p>Publisher: <input type="text" class="edit-publisher" value=""></p>
            <p>BGG URL: <input type="text" class="edit-url" value=""></p>
            <div class="form-actions">
                <button class="confirm-add">Add Game</button>
                <button class="cancel-add">Cancel</button>
            </div>
        </div>
    `;

    gamesContainer.insertBefore(formContainer, gamesContainer.firstChild);

    formContainer.querySelector('.confirm-add').addEventListener('click', () => {
        const newGame = {
            title: formContainer.querySelector('.edit-title').value,
            designer: formContainer.querySelector('.edit-designer').value,
            artist: formContainer.querySelector('.edit-artist').value,
            publisher: formContainer.querySelector('.edit-publisher').value,
            year: formContainer.querySelector('.edit-year').value,
            players: formContainer.querySelector('.edit-players').value,
            time: formContainer.querySelector('.edit-time').value,
            difficulty: formContainer.querySelector('.edit-difficulty').value,
            url: formContainer.querySelector('.edit-url').value,
            playCount: 0,
            personalRating: 0
        };

        games.unshift(newGame);
        saveLocal(newGame);
        
        formContainer.remove();
        displayGames();
    });

    formContainer.querySelector('.cancel-add').addEventListener('click', () => {
        formContainer.remove();
    });
});

// Removes a game from the list and localStorage
function removeGame(title) {
    games = games.filter(game => game.title != title);
    localStorage.removeItem(title);

    displayGames();
}

// Sorts the games based on button pressed
document.querySelectorAll('.sort-options button').forEach(button => {
    button.addEventListener('click', (event) => {
        const data = event.currentTarget.getAttribute('data-sort');
        sort(data);
    });
});

// Different definitions for sorting data
const sortFunctions = {
    title: (a, b) => a.title.localeCompare(b.title),
    players: (a, b) => parseInt(a.players.split('-')[0]) - parseInt(b.players.split('-')[0]),
    rating: (a, b) => a.personalRating - b.personalRating,
    difficulty: (a, b) => {
        const levels = { 'Light': 1, 'Light-Medium': 2, 'Medium': 3, 'Medium-Heavy':4, 'Heavy': 5 };
        return levels[a.difficulty] - levels[b.difficulty];
    },
    playCount: (a, b) => a.playCount - b.playCount
};

// Sorts the games when pressing the buttons
function sort(data) {
    games.sort(sortFunctions[data]);
    displayGames();
}