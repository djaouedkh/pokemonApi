// importe le model Pokemon qu'exporte sequelize.js
const { Pokemon } = require('../db/sequelize')

// exporte une fonction(param1) => param1: sera remplacé par notre app correspondant à express
// avec cet argument on pourra donc créer nos routes de manière normal (.get, .post...)
module.exports = (app) => {
    app.get('/api/pokemons/:id', (req, res) => {
        // va chercher via la colonne qui est "primary key"
        Pokemon.findByPk(req.params.id) // retourne une promesse contenant tous ce que possède notre model/table Pokemon
        .then((response) => {
            const message = 'Un pokémon a bien été trouvé.'
            res.json({ message, data: response })
        })
        .catch(error => {
            const message = 'Le pokemons n\'a pas pu etre récupérée. Réessayez dans quelques instants.';
            res.status(500).json({message, data: error});
        })
    })
}