import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
} from 'graphql';
import db from '../../../db/db';

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
            const reviews = await db.models.objectReview.findAll({
              where: {objectClId: ObjectCl.id}
            })
            reviews.map(item => {
              sum += item.rating
            })
            let avg = sum/reviews.length;

            return Math.round(avg*2)/2;
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