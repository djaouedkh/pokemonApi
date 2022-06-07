const express = require('express');
// middleware tiers semblable à notre middleware "maison" (affiche url) mais en mieux
const favicon = require('serve-favicon');
const sequelize = require('./src/db/sequelize.js');

const app = express();
const port = process.env.PORT || 3000;

//-------------------------------------------------------------------
// ------------------------IMPORTANT---------------------------------
// permet de recuperer des données du body en Json pour travailler avec
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ------------------------------------------------------------------
// ------------------------------------------------------------------


// ---------------- MIDDLEWARES -------------------------

// fonction permettant d'utiliser les req et res pour effectuer un traitement, elle s'active lors d'une requete entrante ou sortante
// possède 3 arguments (4 pour traiter les erreures): req, res, next / next : sert a passer à l'etape d'apres
// s'active avec .use
// s'active dès qu'une requette http et lancé et peut être chainé avec d'auttre middlewares
// chaque middleware peut utiliser les resultats du middlewares executer avant lui
// L'ORDRE EST DONC TRES IMPORTANT
// => FRONT --requete http--> MIDDLEWARE --requete http--> API

// --- concept de base ---
// intercepte et affiche l'url ("maison")
// app.use((req, res, next) => {
//     console.log(`URL: ${req.url}`);
//     next(); // permet de passer à la suite vers l'api
// });

app.use(favicon(__dirname + '/favicon.ico')) // utilise le favicon


// Connexion BDD
sequelize.initDb();

// ----------------- ROUTES ---------------------------------

// 1 .const findAllPokemons = require('src/routes/findAllPokemons.js)
// 2. findAllPokemons(app)
// ce qui revien en une ligne ==> 1. + 2. ==> require('./src/routes/findAllPokemons.js')(app)
// et cela sera valable pour toutes nos routes

// AFFICHER => données de tous les pokemons
require('./src/routes/findAllPokemons')(app); // (app) => notre require appel une fonction qui à besoin de l'argument express() => app

// AFFICHER => param: id du pokemon à afficher
require('./src/routes/findPokemonByPk')(app);

// AJOUTER => body: données du pokemon ajouté
require('./src/routes/createPokemon')(app);

// MODIFIER => param: id du pokemon a update / body: nouvelles données du pokemon
require('./src/routes/updatePokemon')(app);

// SUPPRIMER => param: id du pokemon
require('./src/routes/deletePokemon')(app);

// LOGIN
require('./src/routes/login')(app)



// ERREUR 404 page demandé non trouvé (url rentré ne correspond à aucune routes de l'app)
app.use((req, res) => {
    const message = 'Impossible de trouver la ressource demandée! Vous pouvez essayer une autre URL.';
    res.status(404).json({message}); // message entre accolades pour renvoyer un objet
})


// ---------------- PORT -----------------------
app.listen(port, () => console.log(`démarré sur le port ${port}`)); 