const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
  
module.exports = (req, res, next) => {
    // Le JWT se stocke dans le hearders dans authorization
    // authorization: Bearer <codeDujwt>

    const authorizationHeader = req.headers.authorization // on recup tous le authorization du headers
    
    // authori.. n'existe pas donc jwt n'existe pas
    if(!authorizationHeader) {
        const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
        return res.status(401).json({ message })
    }
       
    const token = authorizationHeader.split(' ')[1] // on coupe à l'espace après Bearer et on recup le 2 morceaux donc le JWT
    // on compare la clé secrete du token avec notre clé secrète
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
        // bloque l'acces si l'utilisateur n'a pas de jwt ou qu'il est invalide
        if(error) {
            const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
            return res.status(401).json({ message, data: error })
        }

        const userId = decodedToken.userId // recup id user se trouvant dans le token
        // le jeton n'est pas celui de l'utilisateur
        if (req.body.userId && req.body.userId !== userId) {
            const message = `L'identifiant de l'utilisateur est invalide.`
            res.status(401).json({ message })
        } 
        else {
            next() // si tout est réussi on peut passer à la suite et donc acceder aux pages
        }
    })
}