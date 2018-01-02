import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import db from '../../db/db';
async function getMessage() {
  return {
    text: `Hello from the GraphQL server @ ${new Date()}`,
  };
}
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
      facebookId: {
        type: GraphQLString,
        resolve(person) {
          return person.facebook_id;
        }
      },
      googleId: {
        type: GraphQLString,
        resolve(person) {
          return person.google_id;
        }
      },
      profileInfo: {
        type: UserProfile,
        async resolve(person) {
          console.log(person.id);
          let userProf = await db.models.userProfile.findAll({
            where: {
              personId: person.id,
            }
          });
          if(userProf.length) {
            let [{dataValues}] = userProf;
            return dataValues;
          } else {
            return {}
          }
        }
      }
    };
  },
});

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
});

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
    };
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutation for kadradi.com',
  fields() {
    return {
      updateOrCreateUser: {
        type: Person,
        args: {
          email: {
            type: GraphQLString,
          },
          FBID: {
            type: GraphQLString,
          },
          GID: {
            type: GraphQLString,
          },
          firstName: {
            type: GraphQLString,
          },
          lastName: {
            type: GraphQLString,
          }
        },
        async resolve(root,{ email, FBID: facebook_id="", GID: google_id="", firstName, lastName, }) {
          let create = await db.models.person.findOrCreate({
            where: {
              email,
            }
          })
          if(create) {
            let [user, isCreated] = create;
            let {dataValues} = user;
            if(isCreated) {
              let update = await db.models.person.update({
                email,
                firstName,
                lastName,
                facebook_id,
                google_id,
              }, {
               where: {
                 id: dataValues.id,
               } 
              })
              if(update) {
                return {id: dataValues.id};
              } 
            } 
            return {id: dataValues.id};
          }
          
        }
      },
      createProfile: {
        type: UserProfile,
        args: {
          id: {
            type: GraphQLInt,
          },
          imageUrl: {
            type: GraphQLString,
          },
        },
        async resolve(root, {id, imageUrl}) {
          console.log("JA SAM ARGS ", id, imageUrl);
          let image = await db.models.userProfile.findOne({
            where: {
              personId: id
            }
          });
          console.log("JEL IMA IMAGE ", image);
          if(image) {
            return image;
          } else {
            console.log("NEMAMO IMAGE BRT ");
            let createImgProfile = await db.models.userProfile.create({
              profileImageUrl: imageUrl,
              location: "",
              personId: id,
            });
            console.log("JEL IMAMO SAD ?!!? ", createImgProfile);
            if(createImgProfile) {
              return {
                profileImageUrl: imageUrl,
                location: "",
              }
            } 
          }
        }
      },
    }
  }
});
// The resulting schema.  We insert our 'root' `Query` object, to tell our
// GraphQL server what to respond to.  We could also add a root `mutation`
// if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});