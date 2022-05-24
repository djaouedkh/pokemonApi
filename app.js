const express = require('express'); // si aucun chemin précisé : recup dans le dossier node_modules
const helper = require('./helper.js');
let pokemons = require('./mock-pokemon');

const app = express(); // permet d'utiliser express
const port = 3000;

app.get('/', (req, res) => res.send('salutation, Express !'));

// params : get / body: post
// req : recupere la data / res : la réponse
app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    const message = 'pokemon bien trouvé';
    res.json(helper.success(message, pokemon));
});

// nbr de pokemon en tout
app.get('/api/pokemons', (req,res) => {
    res.send(`il y a ${pokemons.length}`);
});

// app.listen(port, () => console.log(`notre app est démarré sur le port: ${port}`));