import Game from './models/game.mjs';
import './example.json' with { type: 'json' };

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

function importGamesJSON(file) {
    fetch(file)
        .then(response => response.json())
        .then(data => {
            data.forEach(game => {
                saveLocal(game);
            });
        });
}