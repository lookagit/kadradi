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
        favorites: {
          type: GraphQLInt,
          resolve() {
            return faker.random.number({min: 1, max: 32})
          }
        },
        checkedIn: {
          type: GraphQLInt,
          resolve() {
            return faker.random.number({min: 1, max: 32})
          }
        },
        tags: {
          type: new GraphQLList(GraphQLString),
          resolve() {
            return [faker.random.lorem.word(), faker.random.lorem.word(), faker.random.lorem.word()]
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
        },
        images: {
          type: objectImages,
          async resolve(ObjectCl) {
            return await db.models.objectFile.findAll({where: {objectClId: ObjectCl.id}})
          }
        },
        objectLocations: {
          type: new GraphQLList(objectLocation),
          async resolve (ObjectCl) {
            return await db.models.objectLocation.findAll({where: {objectClId: ObjectCl.id}})
          }
        },
        distance: {
          type: GraphQLFloat,
          resolve(ObjectCl) {
            return ObjectCl.distance
          }
        }
      }
    }
  })

  const objectImages = new GraphQLObjectType({
    name: 'objectImages',
    description: 'Images of object',
    fields() {
      return {
        profileImage: {
          type: objectImage,
          resolve(objectImages) {
            const result = objectImages.filter(obj => {
              return obj.objectFileCategoryId == 1;
            })
            if(result.length) {
              return result[0]
            } else {
              return {fileUrl: 'https://cdn.pixabay.com/photo/2016/10/18/18/19/question-mark-1750942_960_720.png',desc: 'No description'}
            }
          }
        },
        exteriorImage: {
          type: new GraphQLList(objectImage),
          resolve(objectImages) {
            const result = objectImages.filter(obj => {
              return obj.objectFileCategoryId == 2;
            })
            if(result.length) {
              return result
            } else {
              return [{fileUrl: '',desc: ''}]
            }
          }
        },
        interiorImage: {
          type: new GraphQLList(objectImage),
          resolve(objectImages) {
            const result = objectImages.filter(obj => {
              return obj.objectFileCategoryId == 3;
            })
            if(result.length) {
              return result
            } else {
              return [{fileUrl: '',desc: ''}]
            }
          }
        },
        foodImage: {
          type: new GraphQLList(objectImage),
          resolve(objectImages) {
            const result = objectImages.filter(obj => {
              return obj.objectFileCategoryId == 4;
            })
            if(result.length) {
              return result
            } else {
              return [{fileUrl: '',desc: ''}]
            }
          }
        },
      }
    }
  })

  const objectImage = new GraphQLObjectType({
    name: 'objectImage',
    description: 'object image',
    fields() {
      return {
        fileUrl: {
          type: GraphQLString,
          resolve(objectImage) {
            return objectImage.fileUrl
          }
        },
        desc: {
          type: GraphQLString,
          resole(objectImage) {
            return objectImage.fileUrl
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

  const objectLocation = new GraphQLObjectType({
    name: 'objectLocation',
    description: 'Object location info',
    fields() {
      return {
        lat: {
          type: GraphQLFloat,
          resolve(objectLocation) {
            return objectLocation.lat
          }
        },
        lng: {
          type: GraphQLFloat,
          resolve(objectLocation) {
            return objectLocation.lng
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