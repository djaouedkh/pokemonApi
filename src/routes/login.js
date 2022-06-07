const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
  
module.exports = (app) => {
    app.post('/api/login', (req, res) => {
  
        User.findOne({ where: { username: req.body.username } })
        .then(user => {

            // name incorrect donc user non trouvé
            if (!user) {
                const message = `L'utilisateur n'existe pas.`
                return res.status(404).json({message})
            }

            // compare les mdp
            bcrypt.compare(req.body.password, user.password) // retourne une promesse
            .then(isPasswordValid => {
                if(!isPasswordValid) {
                    const message = `Le mdp est incorrect`;
                    return res.status(401).json({ message })
                }

                // JWT
                const token = jwt.sign( // creation du JWT qui possède 3 parametres
                    { userId: user.id},
                    privateKey,
                    { expiresIn: '24h' }
                )

                const message = `L'utilisateur a été connecté avec succès`;
                return res.json({ message, data: user, token }) // on retourne au client le msg de connexion, les données user, le token crée
            })
        })
        .catch(error => {
            const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
            return res.status(500).json({ message, data: error })
        })
    })
}