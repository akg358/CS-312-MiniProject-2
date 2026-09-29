const express = require('express');
const axios = require('axios');
const app = express();

// ejs for rendering pages
app.set('view engine', 'ejs');

// lets us read form data
app.use(express.urlencoded({ extended: true }));

// serves css from public
app.use(express.static('public'));

// api url and free key
const apiBase = "https://www.thecocktaildb.com/api/json/v1/1";
const testKey = "1";

// empty forms, we have no results yet
app.get('/', (req, res) => {
    res.render('index', { drinks: null, error: null });
});

// searching by name
app.post('/search', async (req, res) => {
    let searchTerm = req.body.searchTerm;

    try {
        let response = await axios.get(`${apiBase}/search.php`, {
            params: { s: searchTerm, apiKey: testKey }
        });
        let drinks = response.data.drinks;

        // null sent from api when no result
        if (!drinks) {
            return res.render('index', {
                drinks: null,
                error: `Nothing for "${searchTerm}". Keep searching.`
            });
        }

        res.render('index', { drinks: drinks, error: null });

    } catch (err) {
        res.render('index', {
            drinks: null,
            error: "Isn't responding. Try again."
        });
    }
});

// random drink
app.post('/random', async (req, res) => {
    try {
        // no input needed, api returns a drink on its own
        let response = await axios.get(`${apiBase}/random.php`, {
            params: { apiKey: testKey }
        });

        res.render('index', { drinks: response.data.drinks, error: null });

    } catch (err) {
        res.render('index', {
            drinks: null,
            error: "Wasn't able to grab a drink."
        });
    }
});

// start server
app.listen(3000, () => console.log("running on 3000"));