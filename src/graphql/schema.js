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
import md5 from 'md5';
import socialApi from '../api/socialApi'

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

const ObjectCl = new GraphQLObjectType({
  name: 'ObjectCl',
  description: 'Objects and etc',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(ObjectCl) {
          return ObjectCl.id
        }
      },
      name: {
        type: GraphQLString,
        resolve(ObjectCl) {
          return ObjectCl.name
        }
      },
      shortDescription: {
        type: GraphQLString,
        resolve(ObjectCl) {
          return ObjectCl.shortDescription
        }
      },
      personId: {
        type: GraphQLInt,
        resolve(ObjectCl) {
          return ObjectCl.personId
        }
      },
      objectCategoryId: {
        type: GraphQLInt,
        resolve(ObjectCl) {
          return ObjectCl.objectCategoryId
        }
      },
      avgRating: {
        type: GraphQLInt,
        resolve(ObjectCl) {
          return ObjectCl.avgRating
        }
      },
      person: {
        type: Person,
        async resolve(ObjectCl) {
          return await db.models.person.find({where: ObjectCl.personId})
        }
      },
      objectCategory: {
        type: ObjectCategorie,
        async resolve(ObjectCl) {
          return await db.models.objectCategories.find({where: ObjectCl.objectCategoryId})
        }
      },
      ObjectReview: {
        type: new GraphQLList(ObjectReview),
        args: {
          page: {
            type: GraphQLInt
          }
        },
        async resolve(ObjectCl, args) {
          if(args.page) {
            let a;
            let limit = 3;
            let offset = 0;
            await db.models.objectReview.findAndCountAll()
            .then(async(data) => {
              let page = args.page;
              let pages = Math.ceil(data.count / limit);
              offset = limit * (page - 1);
              await db.models.objectReview.findAll({
                where: {objectClId: ObjectCl.id},
                limit: limit,
                offset: offset,
                $sort: { id: 1 }
              })
              .then((objectReviews) => {
                a = objectReviews 
              })
            })
            return a
          } else {
            return await db.models.objectReview.findAll({ where: {objectClId: ObjectCl.id}} )
          }
        }
      }
    }
  }
})

const ObjectCategorie = new GraphQLObjectType({
  name: 'ObjectCategorie',
  description: 'Object Categories',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(ObjectCategorie) {
          return ObjectCategorie.id
        }
      },
      name: {
        type: GraphQLString,
        resolve(ObjectCategorie) {
          return ObjectCategorie.name
        }
      }
    }
  }
})

const ObjectReview = new GraphQLObjectType({
  name: 'ObjectReview',
  description: 'Object reviews',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(ObjectReview) {
          return ObjectReview.id
        }
      },
      textReview: {
        type: GraphQLString,
        resolve(ObjectReview) {
          return ObjectReview.textReview
        }
      },
      personId: {
        type: GraphQLInt,
        resolve(ObjectReview) {
          return ObjectReview.personId
        }
      },
      person: {
        type: Person,
        async resolve(ObjectReview) {
          return await db.models.person.find({where: ObjectReview.personId})
        }
      },
      objectClId: {
        type: GraphQLInt,
        resolve(ObjectReview) {
          return ObjectReview.objectClId
        }
      },
      objectCl: {
        type: ObjectCl,
        async resolve(ObjectReview) {
          return await db.models.objectCl.find({where: ObjectReview.objectClId})
        }
      }
    }
  }
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
      objectCl: {
        type: new GraphQLList(ObjectCl),
        args: {
          id: {
            type: GraphQLInt
          },
          personId: {
            type: GraphQLInt
          },
          objectCategoryId: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return db.models.objectCl.findAll({ where: args });
        },
      },
      ObjectCategorie: {
        type: new GraphQLList(ObjectCategorie),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return db.models.objectCategories.findAll({ where: args })
        }
      },
      ObjectReview: {
        type: new GraphQLList(ObjectReview),
        args: {
          id: {
            type: GraphQLInt
          },
          personId: {
            type: GraphQLInt
          },
          objectClId: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return db.models.objectReview.findAll({ where: args })
        }
      }
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
              args.emailHash = md5(args.email);
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
            const fbId = await socialApi.checkSocialToken('facebook', args.fbToken);
            if (fbId.success) {
              const fbInfo = await socialApi.fbGetInfo(fbId.id, args.fbToken);
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
            const gId = await socialApi.checkSocialToken('google', args.gToken);
            if (gId.success) {
              const gInfo = await socialApi.googleGetInfo(args.gToken);
              let user = await db.models.person.findOne({ where: { email: gInfo.email } })
              if (user) {
                const payload = {
                  id: user.id,
                  email: user.email
                }
                const token = jwt.sign(payload, 'nasasifra');
                user.token = token;
                return user;
              } else {
                let person = await db.models.person.create({ google_id: gInfo.id, email: gInfo.email, firstName: gInfo.firstName, lastName: gInfo.lastName });
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