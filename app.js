const express = require('express'); // si aucun chemin précisé : recup dans le dossier node_modules
const morgan = require('morgan');
const { dirname } = require('path');
const favicon = require('serve-favicon');
const { success, getUniqueId } = require('./helper.js'); // importation de la methode du fichier require
let pokemons = require('./mock-pokemon');

const app = express(); // permet d'utiliser express
const port = 3000;





// -------------- MIDDLEWARE ------------------
// fonction permettant d'utiliser les req et res pour effectuer un traitement, elle s'active lors d'une requete entrante ou sortante
// possède 3 arguments (4 pour traiter les erreures): req, res, next / next : sert a passer à l'etape d'apres
// s'active avec .use

app
    .use(favicon(__dirname + '/favicon.ico')) // importe middleware utilisant un favicon
    .use(morgan('dev')); // importation middleware tiers affichant url

// app.use((req,res,next) => { // creation middleware affichant url 
//     console.log(`URL : ${req.url}`); // affiche l'url a chaque requete
//     next();
// });




// ---------------- ROUTES ------------------
app.get('/', (req, res) => res.send('salutation, Express !'));

// params : get / body: post
// req : recupere la data / res : la réponse
app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    const message = 'pokemon bien trouvé';
    res.json(success(message, pokemon));
});

// nbr de pokemon en tout
app.get('/api/pokemons', (req,res) => {
    const message = 'tous les pokemon sont bien trouvé';
    res.json(success(message, pokemons));
});


app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})




// ---------------- PORT -----------------------
app.listen(port, () => console.log(`notre app est démarré sur le port: ${port}`));