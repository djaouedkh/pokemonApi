// importe le model Pokemon qu'exporte sequelize.js
const { Pokemon } = require('../db/sequelize')

// exporte une fonction(param1) => param1: sera remplacé par notre app correspondant à express
// avec cet argument on pourra donc créer nos routes de manière normal (.get, .post...)
module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        Pokemon.findAll() // retourne une promesse contenant tous ce que possède notre model/table Pokemon
        .then(response => {
            const message = 'La liste des pokémons a bien été récupérée.' // message que l'on renverra au front
            res.json({ message, data: response }) // ce que l'on renvoie en reponse
        })
        .catch(error => {
            const message = 'La liste des pokemons n\'a pas pu etre récupérée. Réessayez dans quelques instants.';
            res.status(500).json({message, data: error});
        })
    })
}