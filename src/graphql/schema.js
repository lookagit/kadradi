// Schema for sample GraphQL server.

// ----------------------
// IMPORTS

// GraphQL schema library, for building our GraphQL schema
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList
  } from 'graphql';

  import db from '../../db/db';

  // ----------------------

  // GraphQL can handle Promises from its `resolve()` calls, so we'll create a
  // simple async function that returns a simple message.  In practice, `resolve()`
  // will generally pull from a 'real' data source such as a database
  async function getMessage() {
    return {
      text: `Hello from the GraphQL server @ ${new Date()}`,
    };
  }

  // Message type.  Imagine this like static type hinting on the 'message'
  // object we're going to throw back to the user
  const Message = new GraphQLObjectType({
    name: 'Message',
    description: 'GraphQL server message',
    fields() {
      return {
        text: {
          type: GraphQLString,
          resolve(msg) {
            return msg.text;
          },
        },
      };
    },
  });

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
        friendsList: {
            type: new GraphQLList(FriendsList),
            resolve(person) {
              //console.log("evo ovde ce to:");
                return db.models.friendsList.findAll({
                    where: {
                      // personId: person.id
                      [db.Op.or]: [{personId: person.id}, {friendsPersonId: person.id}]
                    }
                  });
                // return db.models.friendsList.findAll({
                //     where: {
                //         personId: person.id,
                //         $or: [
                //             {
                //                 friendsPersonId: {
                //                     $eq: person.id
                //                 }
                //             }

                //         ]
                //     }
                // })
            }
        }
      };
    },
  });


  // const ListaPrijatelja = new GraphQLObjectType({
  //   name: 'ListaPrijatelja',
  //   description: 'Lista Prijatelja',
  //   fields() {
  //     return {
  //       people: {
  //         type: new GraphQLList(Person),
  //         resolve(list) {

  //         }
  //       }
  //     }
  //   }
  // });

  const FriendsList = new GraphQLObjectType({
    name: 'FriendsList',
    description: 'Friends List',
    fields() {
        return{
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



  // Root query.  This is our 'public API'.
  const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields() {
      return {
        message: {
          type: Message,
          resolve() {
            return getMessage();
          },
        },
        people: {
          type: new GraphQLList(Person),
          args: {
            id: {
              type: GraphQLInt
            },
            email: {
              type: GraphQLString
            }
          },
          resolve(root, args) {
            return db.models.person.findAll({where: args});
          },
        },
        friendsList: {
            type: new GraphQLList(FriendsList),
            args: {
                personId: {
                    type: GraphQLInt
                },
                friendsPersonId: {
                    type: GraphQLInt
                }
            },
            resolve(root, args) {
                return db.models.friendsList.findAll({where: args});
            }
        }
      };
    },
  });

  // The resulting schema.  We insert our 'root' `Query` object, to tell our
  // GraphQL server what to respond to.  We could also add a root `mutation`
  // if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
  export default new GraphQLSchema({
    query: Query,
  });
