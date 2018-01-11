import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
} from 'graphql';
import db from '../../../db/db';
import faker from 'faker'

import PersonSchema from './person'

const Person = PersonSchema.Person;
const UserProfile = PersonSchema.UserProfile;

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
        isWorking: {
          type: GraphQLBoolean,
          resolve() {
            return faker.random.boolean();
          }
        },
        objectCategoryId: {
          type: GraphQLInt,
          resolve(ObjectCl) {
            return ObjectCl.objectCategoryId
          }
        },
        avgRating: {
          type: GraphQLFloat,
          async resolve(ObjectCl) {
            let sum = 0.0;
            let throwback;
            const reviews = await db.models.objectReview.findAll({
              where: {objectClId: ObjectCl.id}
            })
            reviews.map(item => {
              sum += item.rating
            })
            let avg = sum/reviews.length;
            if(reviews.length == 0) {
              throwback = 0;
            } else {
              throwback = Math.round(avg*2)/2;
            } 
            return throwback;
          }
        },
        ratingCount: {
          type: GraphQLInt,
          async resolve(ObjectCl) {
            const ratingCount = await db.models.objectReview.findAndCountAll({
              where: {objectClId: ObjectCl.id}
            })
            return ratingCount.count;
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
        rating: {
          type: GraphQLFloat,
          resolve(ObjectReview) {
            return ObjectReview.rating
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

  export default {
      ObjectCl,
      ObjectCategorie,
      ObjectReview
  }