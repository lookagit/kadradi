import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import db from '../../db/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
async function getMessage() {
  return {
    text: `Hello from the GraphQL server @ ${new Date()}`,
  };
}

async function checkSocialToken(network, token) {
  let a={
    id: null,
    success: false
  };
  if (network == 'facebook') {
    await fetch('https://graph.facebook.com/me?access_token=' + token)
      .then((response) => response.text())
      .then((responseText) => {
        const data = JSON.parse(responseText);
        if (data.id) {
          a.id = data.id;
          a.success = true
        } else {
          a.id = 'Invalid token',
          a.success = false
        }

      })
  } else if (network == 'google') {
    await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+token)
      .then((response) => response.text())
      .then((responseText) => {
        const data = JSON.parse(responseText);
        if(data.id){
          a.id = data.id;
          a.success = true
        } else {
          a.id = 'Invalid token',
          a.success = false
        }
      })
  } else {
    a.id = "Social network invalid!";
    a.success = false
  }
  return a;
}

async function fbGetInfo(id, token) {
  let a;
  await fetch('https://graph.facebook.com/' + id + '/?fields=first_name,last_name,email&access_token=' + token)
    .then((response) => response.text())
    .then((responseText) => {
      const data = JSON.parse(responseText);
      a = data;
    })
  return a;
}

async function googleGetInfo(token) {
  let a = {
    id:  null,
    firstName: null,
    lastName: null,
    email: null,

  };
  await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+token)
      .then((response) => response.text())
      .then((responseText) => {
        const data = JSON.parse(responseText);
        if(data.id){
          a.id = data.id;
          a.firstName = data.given_name;
          a.lastName = data.family_name;
          a.email = data.email;
          a.success = true
        } else {
          a.id = 'Invalid token',
          a.success = false
        }
      })
      return a;
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
          return db.models.person.findAll({ where: args });
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
        async resolve(root, { email, FBID: facebook_id = "", GID: google_id = "", firstName, lastName, }) {
          let create = await db.models.person.findOrCreate({
            where: {
              email,
            }
          })
          if (create) {
            let [user, isCreated] = create;
            let { dataValues } = user;
            if (isCreated) {
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
              if (update) {
                return { id: dataValues.id };
              }
            }
            return { id: dataValues.id };
          }

        }
      },
      registerUser: {
        type: Person,
        args: {
          email: {
            type: GraphQLString,
          },
          password: {
            type: GraphQLString,
          },
          firstName: {
            type: GraphQLString,
          },
          lastName: {
            type: GraphQLString
          }
        },
        async resolve(parrentValue, args) {
          if (args.email && args.password && args.firstName && args.lastName) {
            const dbperson = await db.models.person.findAll({ where: { email: args.email } })
            const dbpersonNonactive = await db.models.personNonactive.findAll({ where: { email: args.email } })
            if (dbperson.length > 0 || dbpersonNonactive.length > 0) {
              return { error: "User exists" }
            } else {
              args.emailHash = await bcrypt.hash(args.email, 10);
              return await db.models.personNonactive.create(args);
            }
          } else {
            return { error: "Have not found all parameters!" }
          }

        }
      },
      verifyUser: {
        type: Person,
        args: {
          emailHash: {
            type: GraphQLString,
          }
        },
        async resolve(parrentValue, args) {
          if (args.emailHash) {
            const personNonactive = await db.models.personNonactive.find({ where: { emailHash: args.emailHash } });
            await db.models.personNonactive.destroy({ where: personNonactive.dataValues });
            const person = await db.models.person.create(personNonactive.dataValues);
            return person;
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
        async resolve(root, { id, imageUrl }) {
          let image = await db.models.userProfile.findOne({ personId: parseInt(id) });
          if (image) {
            return image;
          } else {
            let createImgProfile = await db.models.userProfile.create({
              profileImageUrl: imageUrl,
              location: "",
              personId: id,
            });
            if (createImgProfile) {
              return {
                profileImageUrl: imageUrl,
                location: "",
              }
            }
          }
        }
      },
      userLogin: {
        type: Person,
        args: {
          email: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          },
          fbToken: {
            type: GraphQLString
          },
          gToken: {
            type: GraphQLString
          }
        },
        async resolve(parrentValue, args) {
          if (args.fbToken) {
            const fbId = await checkSocialToken('facebook', args.fbToken);
            if (fbId.success) {
              const fbInfo = await fbGetInfo(fbId.id, args.fbToken);
              let user = await db.models.person.findOne({ where: { email: fbInfo.email } });
              if (user) {
                const payload = {
                  id: user.id,
                  email: user.email,
                }
                const token = jwt.sign(payload, 'nasasifra');
                user.token = token;
                return user;
              } else {
                let userId = await db.models.person.findOne({ where: { facebook_id: fbId.id } })
                if (userId) {
                  const payload = {
                    id: userId.id,
                    email: userId.email
                  }
                  const token = jwt.sign(payload, 'nasasifra');
                  userId.token = token;
                  return userId;
                } else {
                  let person = await db.models.person.create({ facebook_id: fbId.id, email: fbInfo.email, firstName: fbInfo.first_name, lastName: fbInfo.last_name })
                  if (person) {
                    const payload = {
                      id: person.id,
                      email: person.email
                    }
                    const token = jwt.sign(payload, 'nasasifra');
                    person.token = token;
                    return person;
                  }
                }
              }
            } else {
              return { error: fbId.id }
            }
          } else if (args.gToken) {
            const gId = await checkSocialToken('google', args.gToken);
            if(gId.success) {
              const gInfo = await googleGetInfo(args.gToken); 
              let user = await db.models.person.findOne({where: { email: gInfo.email }})
              if(user) {
                const payload = {
                  id: user.id,
                  email: user.email
                }
                const token = jwt.sign(payload, 'nasasifra');
                user.token = token;
                return user;
              } else {
                let person = await db.models.person.create( {google_id: gInfo.id, email: gInfo.email, firstName: gInfo.firstName, lastName: gInfo.lastName} );
                if(person) {
                  const payload = {
                    id: person.id,
                    email: person.email
                  }
                  const token = jwt.sign(payload, 'nasasifra');
                  person.token = token;
                  return person;
                }
              }
            }
          } else {
            let user = await db.models.person.findOne({ where: { email: args.email, password: args.password } })
            if (user) {
              const payload = {
                id: user.id,
                email: user.email,
              }
              const token = jwt.sign(payload, 'nasasifra');
              user.token = token;
              return user
            } else {
              return { error: 'Invalid access' }
            }
          }
        }
      }
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