const { Pokemon } = require('../db/sequelize');
const {ValidationError, UniqueConstraintError} = require('sequelize');
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', auth, (req, res) => {
    const id = req.params.id;
    // on modifie le pokemon update(1,2)
    // 1: données / 2: (colonne, ligne)
    Pokemon.update(req.body, {
      where: { id: id }
    })
    // optionnel
    // puis on renvoie le pokemon modifier pour avoir une api complete
    .then(() => {
      // then(): c'est une promesse, donc si on return à chaque .then() on peut gerer les cas d'erreur dans le 1er catch (cela factorisera et evitera de coder plusieurs fois la meme erreures si elle est identique)
      // en faite nous pouvons utiliser ce procéder car ce sont les mm types d'erreures récurentes pour toutes les requetes a la bdd (erreur 500)
      // si Pokemon.update ne marche pas => catch s'active
      // pour récup l'erreur de Pokemon.findByPk alors on es obligé de le return comme sa on recup l'erreur si elle existe et donc pas besoin de le traiter dans findByPk car elle return dans le block juste avant et es donc traité dans le 1er catch()
      // on récup le pokemon que l'on a modifié grace à l'id.param tjr dispo
      return Pokemon.findByPk(id)
      .then((response) => {
        // erreur client
        if (response === null) {
          const message = 'Le pokemons n\'existe pas. Réessayez dans quelques instants.';
          return res.status(404).json({message});
        }
        const message = `Le pokémon ${response.name} a bien été modifié.`
        res.json({message, data: response })
      })
    })
    // erreur serveur
    .catch(error => {
      // on test dabord avec le "validation" des propriété model si il y a une erreur au niveau des données rentré par l'utilisateur
      // si c'est le cas alors sequelize renvoie une erreur qui est une instance de ValidationError
      if (error instanceof ValidationError) {
        return res.status(400).json({message: error.message, data: error});
      }
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json( {meesage: error.message, data: error})
      }
      const message = 'Le pokemons n\'a pas pu etre modifié. Réessayez dans quelques instants.';
      res.status(500).json({message, data: error});
    })
  })
}