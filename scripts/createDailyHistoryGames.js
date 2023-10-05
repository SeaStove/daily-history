import 'dotenv/config'
import fs from "fs"
import axios from "axios"

async function createDailyHistoryGames() {
    const games = {};
    const MAX_YEAR = 2023;
    const MIN_YEAR = 1;

    for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().slice(0, 10);

        let response;
        let events;
        let yearToGuess;

        do {
            const randomYear =
                Math.floor(Math.random() * (MAX_YEAR - MIN_YEAR + 1)) + MIN_YEAR;

            response = await axios.get(
                `https://api.api-ninjas.com/v1/historicalevents?year=${randomYear}`,
                {
                    headers: { "X-Api-Key": process.env.API_KEY },
                }
            );

            if (response?.data) {
                if (response.data.length > 5) {
                    yearToGuess = randomYear.toString();
                    events = response.data;
                }
            } else {
                console.error("Couldn't retrieve data from API.");
            }
        } while (!events);

        games[dateString] = { yearToGuess, events };
    }

    fs.writeFileSync('games.json', JSON.stringify(games));
    return games;
}

createDailyHistoryGames();