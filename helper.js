// VERSION RACCOURCIE
exports.success = (message, data) => {
    return { message, data } // quand le nom de l'objet est le meme que la valeur qu'il possède alors on peut en ecrire que 1
}

exports.getUniqueId = (pokemons) => {
    const pokemonsIds = pokemons.map(pokemon => pokemon.id)
    const maxId = pokemonsIds.reduce((a,b) => Math.max(a, b))
    const uniqueId = maxId + 1
    
    return uniqueId
}

// VERSION DETAILLE
// exports.success = (message, data) => {
    // return {
    //     message: message,
    //     data: data
    // }
// }