import Game from './models/game.mjs';
import './example.json' with { type: 'json' };

const games = loadLocal();
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
    localStorage.setItem(game.title, JSON.stringify(game));
    displayGames();
}

function loadLocal() {
    let games = Object.keys(localStorage).map(key => {
        return JSON.parse(localStorage.getItem(key));
    });
    return games;
}

function listGamesJSON() {
    let games = loadLocal();
    return JSON.stringify(games, null, 2)
}

function importGamesJSON(data) {
    JSON.parse(data).forEach(game => {
        saveLocal(game);
        });
}

document.getElementById('importSource').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            importGamesJSON(e.target.result);
        };
        reader.readAsText(file);
    }
});

function displayGames() {
    const gamesContainer = document.getElementById('gamesDisplay');
    gamesContainer.innerHTML = '';

    games.forEach((game, index) => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game-entry';
        gameElement.innerHTML = `
            <h3>${game.title}</h3>
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
    document.querySelectorAll('.playCountIncrement').forEach(button => {
        button.addEventListener('click', incrementPlayCount);
    });

    document.querySelectorAll('.ratingSlider').forEach(slider => {
        slider.addEventListener('input', updateRating);
    });
}

function incrementPlayCount(event) {
    const index = event.target.getAttribute('data-game-index');

    games[index].playCount++;

    saveLocal(games[index]);

    event.target.previousElementSibling.innerText = games[index].playCount;
}

function updateRating(event) {
    const index = event.target.getAttribute('data-game-index');
    const newRating = event.target.value;
    
    games[index].personalRating = newRating;
        
    saveLocal(games[index]);

    event.target.nextElementSibling.innerText = newRating;
}

