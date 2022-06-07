// importe le model Pokemon qu'exporte sequelize.js
const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

// exporte une fonction(param1) => param1: sera remplacé par notre app correspondant à express
// avec cet argument on pourra donc créer nos routes de manière normal (.get, .post...)
module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        // recup tous les pokemon correspondant à un paramètre de requete name
        if (req.query.name) {
            const name = req.query.name;
            const limitNbr = parseInt(req.query.limit) || 5; // valeur du parametre de limit si existe OU 5 par défaut

            // empeche les requetes si la recherche contient moins de 2 caractères 
            if (name.length < 2) {
                const message = 'Le terme de recherche doit contenir au moins 2 caractères';
                return res.status(400).json({message});
            }

            // on return pour que si il y a une erreur catch de requete dans la bdd elle return dans le 1er catch
            // findAndCountAll recup 2 infos : le nbr total de résultat / résultat demandé
            // name: = propriétée du model
            // ${name} = critere de recherche / [Op.like]: `%${name}%` == appliquer l'opérateur like à la recherche
            // tous les opérateur sequelize s'utilise avec des crochets
            // %name% = le terme se trouvent dans / %name = le terme fini par / name% = le terme commencent par
            return Pokemon.findAndCountAll({ where: { name: { [Op.like]: `%${name}%` }}, order: [['name', 'ASC']], limit: limitNbr })
            .then(({count, rows}) => { 
                // count = nbr total de résultat (si il y des critere supplémentaire comme limit etc alors cela n'est pas pris en compte pour count)
                // rows = les résultats obtenue  (si il y des critere supplémentaire comme limit etc alors cela est pris en compte pour rows)
                const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}.`
                res.json({message, data: rows});
            })
        }
        // recup tous les pokemons
        else{
            // order: ['name'] = ordre croissant / [['name', 'ASC']] = ordre croissant / [['name', 'DESC']] = ordre décroissant
            Pokemon.findAll({order: [['name', 'ASC']]}) // retourne une promesse contenant tous ce que possède notre model/table Pokemon
            .then(response => {
                const message = 'La liste des pokémons a bien été récupérée.' // message que l'on renverra au front
                res.json({ message, data: response }) // ce que l'on renvoie en reponse
            })
            .catch(error => {
                const message = 'La liste des pokemons n\'a pas pu etre récupérée. Réessayez dans quelques instants.';
                res.status(500).json({message, data: error});
            })
        }

    })
}