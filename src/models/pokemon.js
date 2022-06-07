// CREATION D'UN MODEL/TABLE AUPRES DE SEQUELIZE

// utile pour tester les type entré, on l'utilisera dans le Validator de la prop types
const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée'];

// VALIDATEUR
// fonctionnnalité de sequelize qui permet d'ajouter des contraintes et validateurs pour nos differents champs de notre model
// validateurs : permet de voir si les données rentrées correspondent à ce que l'on souhaite et auquel cas, on bloque la requete sql
// contraintes : recoit les données rentrées et interroge sql si nos données passe la contrainte d'un champs sans pour autant envoyer des requetes sql
// -> on utilise svt cela avec les contraintes d'unicité => quand on rentre le nom d'un pokemon on veut qu'il soit unique
//          - donc sequelize regarde la contrainte et interroge sql afin de savoir si on peut passer cette contrainte et tt cela sans faire de requete

// fonction(1,2)
// 1param: objet de sequelize (la connexion de sequelize)
// 2param: objet DataTypes native à sequelize (formate les types de donnée de chaque prop du model/table (STRING ...)
module.exports = (sequelize, DataTypes) => {
    // define(1,2,3) 
    // 1: nom de la table/model qu'on créera / 2: toutes les propriétées et leurs infos / 3: optionnel
    return sequelize.define('Pokemon', { 
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // clé primaire
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false, // ne doit pas etre vide
            // contrainte d'unicité
            unique: {
                msg: 'Le nom est déjà pris.'
            },
            // validation: permet grace a des mot clé natives de verifier que les données rentré sont bonnes
            validate: {
                notEmpty: {msg: 'le champs doit etre remplis'},
                notNull: {msg: 'le nom est une propriété requise'}
            }
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // validation: permet grace a des mot clé natives de verifier que les données rentré sont bonnes
            validate: {
                isInt: {msg: 'Utilisez des nombres entiers pour les points de vie.'},
                notNull: {msg: 'Les points de vie sont une propriété requise.'},
                max: {
                    args: [999],
                    msg: 'Les pt de vies doivent etre inferieur à 999'
                },
                min: {
                    args: [0],
                    msg: 'Les pt de vies doivent etre superieur à 0'
                }
            }
        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // validation: permet grace a des mot clé natives de verifier que les données rentré sont bonnes
            validate: {
                isInt: {msg: 'Utilisez des nombres entiers pour les cp.'},
                notNull: {msg: 'Les cp sont une propriété requise.'},
                max: {
                    args: [99],
                    msg: 'Les cp doivent etre inferieur à 99'
                },
                min: {
                    args: [0],
                    msg: 'Les cp doivent etre superieur à 0'
                }
            }
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            // validation: permet grace a des mot clé natives de verifier que les données rentré sont bonnes
            validate: {
                isUrl: {msg: 'votre Url n\'est pas valide'},
                notNull: {msg: 'l\'image est une propriété requise'}
            }
        },
        types: {
            type: DataTypes.STRING,
            allowNull: false,
            get(){
                // renvoie la string de la BDD en tableau pour qu'on l'exploite avec l'API
                return this.getDataValue('types').split(',')
            },
            set(types){
                // créer une string pour l'inserer en type string dans la BDD
                // join() explose un array et crée une seule string avce des virgules entre les elements
                this.setDataValue('types', types.join())
            },
            // Validator personnalisé => on crée une fonction qui test différents cas et renvoi des erreurs
            validate: {
                isTypesValid(value){ // value => correspond à la valeur de notre propriété "types"
                    if (!value) { // aucun type entré
                        throw new Error('Un pokemon doit avoir au moins 1 type.')
                    }
                    if (value.split(',').length > 3) { // 4 types ou plus entré
                        throw new Error('Un pokemon ne peux pas avoir plus de 3 types.')
                    }
                    value.split(',').forEach(element => {
                        if (!validTypes.includes(element)) {
                            throw new Error(`Le type d'un pokemon doit appartenir à la liste suivante: ${validTypes}`);
                        }
                    });
                }
            }
        }
    }, 
    {
        timestamps: true, // desactive le comportement par défaut => true car on modifie le 2 options suivantes
        createdAt: 'created', // a chaque création on renvoie une string
        updatedAt: false // pas d'infos lors d'une modif
    })
}