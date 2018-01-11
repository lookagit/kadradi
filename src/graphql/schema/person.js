import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} from 'graphql';
import db from '../../../db/db';

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Person Object',
    fields() {
        return {
            id: {
                type: GraphQLInt,
                resolve(person) {
                    return person.id;
                },
            },
            email: {
                type: GraphQLString,
                resolve(person) {
                    return person.email;
                },
            },
            firstName: {
                type: GraphQLString,
                resolve(person) {
                    return person.firstName;
                }
            },
            lastName: {
                type: GraphQLString,
                resolve(person) {
                    return person.lastName;
                }
            },
            facebook_id: {
                type: GraphQLString,
                resolve(person) {
                    return person.facebook_id;
                }
            },
            google_id: {
                type: GraphQLString,
                resolve(person) {
                    return person.google_id;
                }
            },
            token: {
                type: GraphQLString,
                resolve(person) {
                    return person.token;
                }
            },
            emailHash: {
                type: GraphQLString,
                resolve(personinactive) {
                    return personinactive.emailHash
                },
            },
            error: {
                type: GraphQLString,
                resolve(person) {
                    return person.error
                }
            },
            profileInfo: {
                type: UserProfile,
                async resolve(person) {
                    let userProf = await db.models.userProfile.findAll({
                        where: {
                            personId: person.id,
                        }
                    });
                    if (userProf.length) {
                        let [{ dataValues }] = userProf;
                        return dataValues;
                    } else {
                        return {}
                    }
                }
            }
        };
    },
})
const UserProfile = new GraphQLObjectType({
    name: 'UserProfile',
    description: 'User profile info. Image url and location',
    fields() {
        return {
            profileImageUrl: {
                type: GraphQLString,
                resolve(profile) {
                    return profile.profileImageUrl;
                }
            },
            location: {
                type: GraphQLString,
                resolve(profile) {
                    return profile.location;
                }
            }
        }
    }
})

const FriendsList = new GraphQLObjectType({
    name: 'FriendsList',
    description: 'Friends List',
    fields() {
      return {
        persona: {
          type: Person,
          resolve(fl) {
            return fl.getPerson();
          }
        },
        personaDruga: {
          type: Person,
          resolve(fl) {
            return fl.getFriendssPersonId();
          }
        }
      };
    }
  });

export default {
    Person,
    UserProfile,
    FriendsList
}
