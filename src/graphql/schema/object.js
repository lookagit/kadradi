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
          return faker.random.number({ min: 1, max: 32 })
        }
      },
      checkedIn: {
        type: GraphQLInt,
        resolve() {
          return faker.random.number({ min: 1, max: 32 })
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
            where: { objectClId: ObjectCl.id }
          })
          reviews.map(item => {
            sum += item.rating
          })
          let avg = sum / reviews.length;
          if (reviews.length == 0) {
            throwback = 0;
          } else {
            throwback = Math.round(avg * 2) / 2;
          }
          return throwback;
        }
      },
      ratingCount: {
        type: GraphQLInt,
        async resolve(ObjectCl) {
          const ratingCount = await db.models.objectReview.findAndCountAll({
            where: { objectClId: ObjectCl.id }
          })
          return ratingCount.count;
        }
      },
      person: {
        type: Person,
        async resolve(ObjectCl) {
          return await db.models.person.find({ where: ObjectCl.personId })
        }
      },
      objectCategory: {
        type: ObjectCategorie,
        async resolve(ObjectCl) {
          return await db.models.objectCategories.find({ where: ObjectCl.objectCategoryId })
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
          if (args.page) {
            let a;
            let limit = 3;
            let offset = 0;
            await db.models.objectReview.findAndCountAll()
              .then(async (data) => {
                let page = args.page;
                let pages = Math.ceil(data.count / limit);
                offset = limit * (page - 1);
                await db.models.objectReview.findAll({
                  where: { objectClId: ObjectCl.id },
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
            return await db.models.objectReview.findAll({ where: { objectClId: ObjectCl.id } })
          }
        }
      },
      images: {
        type: objectImages,
        async resolve(ObjectCl) {
          return await db.models.objectFile.findAll({ where: { objectClId: ObjectCl.id } })
        }
      },
      objectLocations: {
        type: objectLocation,
        async resolve(ObjectCl) {
          const objectLocation = await db.models.objectLocation.findAll({ where: { objectClId: ObjectCl.id } })
          return objectLocation[0]
        }
      },
      distance: {
        type: GraphQLFloat,
        resolve(ObjectCl) {
          return ObjectCl.distance
        }
      },
      workingTimeInfo: {
        type: workingTimeInfo,
        async resolve(ObjectCl) {
          let vreme = await db.models.objectWorkTime.find({ where: { objectClId: ObjectCl.id } });
          const monToFri = await db.models.objectWtMontoFri.find({ where: { id: vreme.objectWtMontoFriId } });
          const saturday = await db.models.objectWtSaturday.find({ where: { id: vreme.objectWtSaturdayId } });
          const sunday = await db.models.objectWtSunday.find({ where: { id: vreme.objectWtSundayId } })
          let danas = new Date();
          vreme.danas = danas;
          vreme.monToFri = monToFri;
          vreme.saturday = saturday;
          vreme.sunday = sunday;
          return vreme
        }
      },
      kitchenTimeInfo: {
        type: kitchenTimeInfo,
        async resolve(ObjectCl) {
          const kitchenTime = await db.models.kitchenWorkTime.find({ where: { objectClId: ObjectCl.id } })
          const monToFri = await db.models.objectWtMontoFri.find({ where: { id: kitchenTime.objectWtMontoFriId } })
          const saturday = await db.models.objectWtSaturday.find({ where: { id: kitchenTime.objectWtSaturdayId } })
          const sunday = await db.models.objectWtSunday.find({ where: { id: kitchenTime.objectWtSundayId } })
          return { monToFri, saturday, sunday }
        }
      },
      restaurantTimeInfo: {
        type: restaurantTimeInfo,
        async resolve(ObjectCl) {
          const restaurantTime = await db.models.restaurantWorkTime.find({ where: { objectClId: ObjectCl.id } })
          const monToFri = await db.models.objectWtMontoFri.find({ where: { id: restaurantTime.objectWtMontoFriId } })
          const saturday = await db.models.objectWtSaturday.find({ where: { id: restaurantTime.objectWtSaturdayId } })
          const sunday = await db.models.objectWtSunday.find({ where: { id: restaurantTime.objectWtSundayId } })
          return { monToFri, saturday, sunday }
        }
      },
      deliveryTimeInfo: {
        type: deliveryTimeInfo,
        async resolve(ObjectCl) {
          const deliveryTime = await db.models.deliveryWorkTime.find({ where: { objectClId: ObjectCl.id } })
          const monToFri = await db.models.objectWtMontoFri.find({ where: { id: deliveryTime.objectWtMontoFriId } })
          const saturday = await db.models.objectWtSaturday.find({ where: { id: deliveryTime.objectWtSaturdayId } })
          const sunday = await db.models.objectWtSunday.find({ where: { id: deliveryTime.objectWtSundayId } })
          return { monToFri, saturday, sunday }
        }
      },
      objectInfo: {
        type: objectInfo,
        async resolve(ObjectCl) {
          const objectInfo = await db.models.objectInfo.find({where: {objectClId: ObjectCl.id}});
          const objectPhones = await db.models.objectPhones.findAll({where: {objectInfoId: objectInfo.id}})
          let vrati = objectInfo
          vrati.ObjectPhones = objectPhones;
          console.log(vrati.ObjectPhones, "OBJECT PHONEs")
          return vrati
        }
      }
    }
  }
})

const phone = new GraphQLObjectType({
  name: 'phone',
  description: 'Phone number of object',
  fields() {
    return {
      desc: {
        type: GraphQLString,
        resolve(phone) {
          return phone.desc
        }
      },
      number: {
        type: GraphQLString,
        resolve(phone) {
          return phone.number
        }
      }
    }
  }
})

const objectInfo = new GraphQLObjectType({
  name: 'objectInfo',
  description: 'Informations for ObjectCl',
  fields() {
    return {
      websiteUrl: {
        type: GraphQLString,
        resolve(objectInfo) {
          return objectInfo.websiteUrl
        }
      },
      hasRestaurant: {
        type: GraphQLBoolean, 
        resolve(objectInfo) {
          return objectInfo.hasRestaurant
        }
      },
      popularBecauseOf: {
        type: GraphQLString,
        resolve(objectInfo) {
          return objectInfo.popularBecauseOf
        }
      },
      phone: {
        type: new GraphQLList(phone),
        resolve(objectInfo) {
          return objectInfo.ObjectPhones
        }
      }
    }
  }
})

const monToFri = new GraphQLObjectType({
  name: 'monToFri',
  fields() {
    return {
      opening: {
        type: GraphQLString,
        resolve(monToFri) {
          return monToFri.opening;
        }
      },
      closing: {
        type: GraphQLString,
        resolve(monToFri) {
          return monToFri.closing;
        }
      }
    }
  }
})

const saturday = new GraphQLObjectType({
  name: 'saturday',
  fields() {
    return {
      opening: {
        type: GraphQLString,
        resolve(saturday) {
          return saturday.opening;
        }
      },
      closing: {
        type: GraphQLString,
        resolve(saturday) {
          return saturday.closing;
        }
      }
    }
  }
})

const sunday = new GraphQLObjectType({
  name: 'sunday',
  fields() {
    return {
      opening: {
        type: GraphQLString,
        resolve(sunday) {
          return sunday.opening;
        }
      },
      closing: {
        type: GraphQLString,
        resolve(sunday) {
          return sunday.closing;
        }
      }
    }
  }
})

const kitchenTimeInfo = new GraphQLObjectType({
  name: 'kitchenTimeInfo',
  description: 'Diz kitchen is GAII',
  fields() {
    return {
      monToFri: {
        type: monToFri,
        resolve(kitchenTimeInfo) {
          return kitchenTimeInfo.monToFri
        }
      },
      saturday: {
        type: saturday,
        resolve(kitchenTimeInfo) {
          return kitchenTimeInfo.saturday
        }
      },
      sunday: {
        type: sunday,
        resolve(kitchenTimeInfo) {
          return kitchenTimeInfo.sunday
        }
      }
    }
  }
})



const restaurantTimeInfo = new GraphQLObjectType({
  name: 'restaurantTimeInfo',
  description: 'Diz restaurant is GAIIIIII',
  fields() {
    return {
      monToFri: {
        type: monToFri,
        resolve(restaurantTimeInfo) {
          return restaurantTimeInfo.monToFri
        }
      },
      saturday: {
        type: saturday,
        resolve(restaurantTimeInfo) {
          return restaurantTimeInfo.saturday
        }
      },
      sunday: {
        type: sunday,
        resolve(restaurantTimeInfo) {
          return restaurantTimeInfo.sunday
        }
      }
    }
  }
})

const deliveryTimeInfo = new GraphQLObjectType({
  name: 'deliveryTimeInfo',
  description: 'Diz delivery boy is cute',
  fields() {
    return {
      monToFri: {
        type: monToFri,
        resolve(deliveryTimeInfo) {
          return deliveryTimeInfo.monToFri
        }
      },
      saturday: {
        type: saturday,
        resolve(deliveryTimeInfo) {
          return deliveryTimeInfo.saturday
        }
      },
      sunday: {
        type: sunday,
        resolve(deliveryTimeInfo) {
          return deliveryTimeInfo.sunday
        }
      }
    }
  }
})

const workingTimeInfo = new GraphQLObjectType({
  name: 'workingTimeInfo',
  description: 'Segzz',
  fields() {
    return {
      isWorking: {
        type: GraphQLBoolean,
        resolve(workingTimeInfo) {
          const dan = workingTimeInfo.danas.getDay();
          const vreme = Number(workingTimeInfo.danas.getHours().toString() + workingTimeInfo.danas.getMinutes().toString());
          let vremeRada;
          console.log("Vreme sada: " + vreme)
          if (dan > 0 && dan < 6) {
            vremeRada = workingTimeInfo.monToFri;
            console.log('Ponedeljak-Petak: ' + vremeRada.opening, vremeRada.closing)
          } else if (dan == 6) {
            vremeRada = workingTimeInfo.saturday;
            console.log('Subota: ' + vremeRada.opening)
          } else if (dan == 0) {
            vremeRada = workingTimeInfo.sunday;
            console.log('Nedelja: ' + vremeRada.opening)
          }
          if (vremeRada.opening > vremeRada.closing) {
            if (vremeRada.closing > vreme) {
              vreme += 2400;
            }
            vremeRada.closing += 2400;
          }
          if (vreme > vremeRada.opening && vreme < vremeRada.closing) {
            return true;
          } else {
            return false
          }

        }
      },
      alwaysOpen: {
        type: GraphQLBoolean,
        resolve(workingTimeInfo) {
          return workingTimeInfo.isAlwaysOpened
        }
      },
      monToFri: {
        type: monToFri,
        resolve(workingTimeInfo) {
          return workingTimeInfo.monToFri
        }
      },
      saturday: {
        type: saturday,
        resolve(workingTimeInfo) {
          return workingTimeInfo.saturday
        }
      },
      sunday: {
        type: sunday,
        resolve(workingTimeInfo) {
          return workingTimeInfo.sunday
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
          if (result.length) {
            return result[0]
          } else {
            return { fileUrl: 'https://cdn.pixabay.com/photo/2016/10/18/18/19/question-mark-1750942_960_720.png', desc: 'No description' }
          }
        }
      },
      exteriorImage: {
        type: new GraphQLList(objectImage),
        resolve(objectImages) {
          const result = objectImages.filter(obj => {
            return obj.objectFileCategoryId == 2;
          })
          if (result.length) {
            return result
          } else {
            return [{ fileUrl: '', desc: '' }]
          }
        }
      },
      interiorImage: {
        type: new GraphQLList(objectImage),
        resolve(objectImages) {
          const result = objectImages.filter(obj => {
            return obj.objectFileCategoryId == 3;
          })
          if (result.length) {
            return result
          } else {
            return [{ fileUrl: '', desc: '' }]
          }
        }
      },
      foodImage: {
        type: new GraphQLList(objectImage),
        resolve(objectImages) {
          const result = objectImages.filter(obj => {
            return obj.objectFileCategoryId == 4;
          })
          if (result.length) {
            return result
          } else {
            return [{ fileUrl: '', desc: '' }]
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
          return await db.models.person.find({ where: ObjectReview.personId })
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
          return await db.models.objectCl.find({ where: ObjectReview.objectClId })
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
      },
      city: {
        type: GraphQLString,
        resolve(objectLocation) {
          return objectLocation.city
        }
      },
      address: {
        type: GraphQLString,
        resolve(objectLocation) {
          return objectLocation.address
        }
      },
      zipCode: {
        type: GraphQLString,
        resolve(objectLocation) {
          return objectLocation.zipCode
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