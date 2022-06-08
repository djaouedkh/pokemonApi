// on importe : Sequelize: pour créer une connexion / DataTypes: pour formater le typage de nos model/table
const { Sequelize, DataTypes } = require('sequelize')
// on importe notre model/table pokemon
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')

let sequelize

// bdd en ligne, changer les infos
if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(
        'pokedex', // 1: nom de la BDD
        'root', // 2: identifiant
        '', // 3: mdp
        { // 4
        host: 'serveur',  // nom du serveur local
        dialect: 'mariadb', // type de BDD
        dialectOptions: { // optionnel
            timezone: 'Etc/GMT-2',
        },
        logging: true // optionnel
    })
}
// bdd locale
else{
    // creation de la connexion à la BDD
    // on utilise l'objet Sequelize pour l'instancier et créer la connexion
    // new Sequelize(1,2,3,4)
    sequelize = new Sequelize(
        'pokedex', // 1: nom de la BDD
        'root', // 2: identifiant
        '', // 3: mdp
        { // 4
        host: 'localhost',  // nom du serveur local
        dialect: 'mariadb', // type de BDD
        dialectOptions: { // optionnel
            timezone: 'Etc/GMT-2',
        },
        logging: false // optionnel
    })
}


// on "instancie" notre model "PokemonModel" grace à notre import
// ce qui veut dire: sequelize je veut que tu crée la table correspondant à PokemonModel dans la BDD
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
  
const initDb = () => {
    // Créer nos tables/model dans notre BDD
    return sequelize.sync({force: true}).then(() => { // permet de supprimer la table et de recrée la table, à termes ce n'est plus utile
    // return sequelize.sync().then(() => { // si on met l'app en production on mettra cela
        // je parcours mon array et pour chaque element je recupere ses infos et je le crée dans ma BDD
        pokemons.map(currentElement => {
            // créér à chaque synchronisation
            Pokemon.create({ // creat() = "INSERT into...
                name: currentElement.name,
                hp: currentElement.hp,
                cp: currentElement.cp,
                picture: currentElement.picture,
                types: currentElement.types
            }).then((res) => console.log(res.toJSON())) // affiche le réponse + toJSON (permet d'afficher que les infos importantes)
        })

        // Creer table user en bdd
        bcrypt.hash('pikachu', 10) // hash : 2 param => 1. le mdp / 2. ce chiffre détermine le niveau d'encryptage (+ il est élevé + le délai augmente)
        .then(hash => {
            User.create({ 
                username: 'pikachu', 
                password: hash 
            })
            .then(user => console.log(user.toJSON()))
        })

        console.log('La base de donnée a bien été initialisée !')
    })
}

// on exporte initDb: créer notre bdd / Pokemon: notre model Pokemon
module.exports = { 
  initDb, Pokemon, User
}