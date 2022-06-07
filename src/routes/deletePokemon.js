const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth')  

module.exports = (app) => {
    app.delete('/api/pokemons/:id', auth, (req, res) => {
        // on recupere le pokemon ciblé puis j'envoie les données récup pour la suite
        Pokemon.findByPk(req.params.id)
            .then(response => {
                // erreur client
                if (response === null) {
                    const message = 'Le pokemons n\'existe pas. Réessayez dans quelques instants.';
                    return res.status(404).json({message});
                }
                // stock les dnnées du pokemon
                const pokemonDeleted = response;
                // le return retourne la promesse en cours afin de gerer de maniere factoriser le catch() sinon il aurait fallu rajouter le meme catch() apres le .then suivant
                // si destroy() ne s'execute pas cela va engendrer une erreur et donc avec le return on renvoie cette erreur et le catch() le traite
                // supprime / destroy(1)
                // 1: where id = id du pokemon recup
                return Pokemon.destroy({ // pour le return voir routes/createPokemon.js
                    where: { id: pokemonDeleted.id }
                })
                .then(() => {
                    const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
                    res.json({message, data: pokemonDeleted })
                })
            })
            // erreur serveur
            .catch(error => {
                const message = 'Le pokemons n\'a pas pu etre supprimé. Réessayez dans quelques instants.';
                res.status(500).json({message, data: error});
            })
    })
}