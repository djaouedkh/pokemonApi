const { Pokemon } = require('../db/sequelize')
const {ValidationError, UniqueConstraintError} = require('sequelize');
  
module.exports = (app) => {
  app.post('/api/pokemons', (req, res) => {
    // on ajoute avec les données du pokemon dans le body
    Pokemon.create(req.body)
      // on passe à la suite avec les données du pokemon
      .then((response) => {
        const message = `Le pokémon ${req.body.name} a bien été crée.`
        res.json({ message, data: response })
      })
      .catch(error => {
        // on test dabord avec le "validation" des propriété model si il y a une erreur au niveau des données rentré par l'utilisateur
        // si c'est le cas alors sequelize renvoie une erreur qui est une instance de ValidationError
        if (error instanceof ValidationError) {
          return res.status(400).json({message: error.message, data: error});
        }
        if (error instanceof UniqueConstraintError) {
          return res.status(400).json({message: msg, data: error});
        }
        const message = 'Le pokemons n\'a pas pu etre ajouté. Réessayez dans quelques instants.';
        res.status(500).json({message, data: error});
      })
  })
}