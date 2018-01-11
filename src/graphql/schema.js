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
import PersonSchema from './schema/person'
import ObjectSchema from './schema/object'

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

const Person = PersonSchema.Person
const UserProfile = PersonSchema.UserProfile
const FriendsList = PersonSchema.FriendsList
const ObjectCl = ObjectSchema.ObjectCl
const ObjectCategorie = ObjectSchema.ObjectCategorie
const ObjectReview = ObjectSchema.ObjectReview


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
          },
          page: {
            type: GraphQLInt
          }
        },
        async resolve(root, args) {
          if(args.page){
            let a;
            let limit = 8;
            let offset = 0;
            await db.models.objectCl.findAndCountAll()
            .then(async(data)=>{
              let page = args.page;
              let pages = Math.ceil(data.count / limit);
              offset = limit * (page - 1);
              await db.models.objectCl.findAll({
                limit: limit,
                offset: offset,
                $sort: { id: 1 }
              })
              .then((objectCls) => {
                a = objectCls
              })
            })
            return a;
          } else {
            return db.models.objectCl.findAll({ where: args });
          }
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
            personNonactive.dataValues.role_id = 1
            personNonactive.dataValues.user_type_id = 1;
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
                console.log(await socialApi.fbGetProfileImage(fbId.id));
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
                  let person = await db.models.person.create({ facebook_id: fbId.id, email: fbInfo.email, firstName: fbInfo.first_name, lastName: fbInfo.last_name, role_id: 1, user_type_id: 1 })
                  if (person) {
                    const payload = {
                      id: person.id,
                      email: person.email
                    }
                    const token = jwt.sign(payload, 'nasasifra');
                    person.token = token;
                    console.log(await socialApi.fbGetProfileImage(fbId.id));
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
                let person = await db.models.person.create({ google_id: gInfo.id, email: gInfo.email, firstName: gInfo.firstName, lastName: gInfo.lastName, role_id: 1, user_type_id: 1 });
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
      },
      createReview: {
        type: ObjectReview,
        args: {
          textReview: {
            type: GraphQLString
          },
          objectClId: {
            type: GraphQLInt
          },
          token: {
            type: GraphQLString
          }
        },
        async resolve(parrentValue, args) {
          const user = jwt.verify(args.token, 'nasasifra');
          return db.models.objectReview.create({
            textReview: args.textReview,
            personId: user.id,
            objectClId: args.objectClId
          })
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