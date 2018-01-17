import Sequelize from 'sequelize';
// const Sequelize = require('sequelize');

const db = new Sequelize('postgres://kadradiuser:jw8s0F4122Pi&&2@kadradipostgres.cjx5vc7fbujv.eu-west-1.rds.amazonaws.com/kadradidev');

import { dataArr } from './dataArrays';

const Person = db.define('person', {
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  facebook_id: {
    type: Sequelize.STRING
  },
  google_id: {
    type: Sequelize.STRING
  }
});

const PersonNonactive = db.define('personNonactive', {
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  emailHash: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  }
});

const UserType = db.define('userType', {
  userType: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
UserType.hasOne(Person);

const PersonBadges = db.define('personBadges', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  iconUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
PersonBadges.hasMany(Person);

const PersonFiles = db.define('personFiles', {
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
PersonFiles.hasMany(Person);

const Role = db.define('roles', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  priority: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
Role.hasMany(Person);


const UserProfile = db.define('userProfile', {
  profileImageUrl: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING
  },
},
{
  indexes: [
      {
          unique: true,
          fields: ['personId'],
      }
  ]
});

Person.hasOne(UserProfile);

const ObjectCl = db.define('objectCl', {
  name: {
    type: Sequelize.STRING,
    allowNull:false
  },
  shortDescription: {
    type: Sequelize.STRING,
    allowNull:false
  },
  avgRating: {
    type: Sequelize.INTEGER,
  },
  city: {
    type: Sequelize.STRING,
  },
  streetAddress: {
    type: Sequelize.STRING
  },
  postcode: {
    type: Sequelize.STRING
  }
});
Person.hasOne(ObjectCl);

const ObjectCategorie = db.define('objectCategories', {
  name: {
    type: Sequelize.STRING,
    allowNull:false
  }
});
ObjectCategorie.hasOne(ObjectCl);

const ObjectReview = db.define('objectReview', {
  textReview: {
    type: Sequelize.STRING,
  },
  rating: {
    type: Sequelize.FLOAT,
  },
});
Person.hasOne(ObjectReview);
ObjectCl.hasOne(ObjectReview);

const ObjectInfo = db.define('objectInfo', {
  websiteUrl: {
    type: Sequelize.STRING,
  },
  hasRestaurant: {
    type: Sequelize.BOOLEAN,
  },
  popularBecauseOf: {
    type: Sequelize.STRING,
  }
});

ObjectInfo.belongsTo(ObjectCl);

const ObjectPhones = db.define('objectPhones', {
  desc: {
    type: Sequelize.STRING,
  },
  number: {
    type: Sequelize.STRING,
  },
});

ObjectInfo.hasOne(ObjectPhones)

const ObjectLocation = db.define('objectLocation', {
  lat: {
    type: Sequelize.FLOAT
  },
  lng: {
    type: Sequelize.FLOAT
  },
  address: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  zipCode: {
    type: Sequelize.STRING,
  },
})
ObjectCl.hasOne(ObjectLocation)

const ObjectAdditionalInfo = db.define('objectAdditionalInfo', {
  info: {
    type: Sequelize.STRING
  }
});
ObjectAdditionalInfo.belongsTo(ObjectInfo);

const ObjectRestaurantMenu = db.define('objectRestaurantMenu', {
  menuUrl: {
    type: Sequelize.STRING
  }
});
ObjectRestaurantMenu.belongsTo(ObjectInfo);

const ObjectWorkTime = db.define('objectWorkTime', {
  isAlwaysOpened: {
    type: Sequelize.BOOLEAN
  }
});
ObjectWorkTime.belongsTo(ObjectCl);

const KitchenWorkTime = db.define('kitchenWorkTime', {})
KitchenWorkTime.belongsTo(ObjectCl);

const RestaurantWorkTime = db.define('restaurantWorkTime',{});
RestaurantWorkTime.belongsTo(ObjectCl)

const DeliveryWorkTime = db.define('deliveryWorkTime', {})
DeliveryWorkTime.belongsTo(ObjectCl)


const ObjectWtMontoFri = db.define('objectWtMontoFri', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
});
ObjectWtMontoFri.hasOne(ObjectWorkTime);
ObjectWtMontoFri.hasOne(KitchenWorkTime)
ObjectWtMontoFri.hasOne(RestaurantWorkTime)
ObjectWtMontoFri.hasOne(DeliveryWorkTime)

const ObjectWtSaturday = db.define('objectWtSaturday', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
});
ObjectWtSaturday.hasOne(ObjectWorkTime);
ObjectWtSaturday.hasOne(KitchenWorkTime)
ObjectWtSaturday.hasOne(RestaurantWorkTime)
ObjectWtSaturday.hasOne(DeliveryWorkTime)


const ObjectWtSunday = db.define('objectWtSunday', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
});
ObjectWtSunday.hasOne(ObjectWorkTime);
ObjectWtSunday.hasOne(KitchenWorkTime)
ObjectWtSunday.hasOne(RestaurantWorkTime)
ObjectWtSunday.hasOne(DeliveryWorkTime)

const ObjectWtCustom = db.define('objectWtCustom', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  },
  day: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATE
  }
});
ObjectWtCustom.hasOne(ObjectWorkTime);

const ObjectFileCategory = db.define('objectFileCategory', {
  category: {
    type: Sequelize.STRING
  },
  desc: {
    type: Sequelize.STRING
  }
});

const ObjectFile = db.define('objectFile', {
  fileUrl: {
    type: Sequelize.STRING
  },
  desc: {
    type: Sequelize.STRING
  }
});
ObjectFile.belongsTo(ObjectCl);
ObjectFileCategory.hasOne(ObjectFile);

const PersonFavoriteObjects = db.define('personFavoriteObjects', {

});
PersonFavoriteObjects.belongsTo(Person);
ObjectCl.hasOne(PersonFavoriteObjects);

const FriendStatus = db.define('friendStatus', {
  status: {
    type: Sequelize.STRING,
    allowNull:false
  }
});

const FriendsList = db.define('friendsList', {
  facebookFriend: {
    type: Sequelize.BOOLEAN
  },
  googleFriend: {
    type: Sequelize.BOOLEAN
  }
});

FriendsList.belongsTo(Person);
FriendsList.belongsTo(Person, {
  as: 'friendssPersonId',
  foreignKey: 'friendsPersonId'
});
FriendsList.hasOne(FriendStatus);

db.sync({force: false}).then(() => {

  // dataArr.PersonsArr.map(async item => {
  //   await Person.create(item);
  // });

  // dataArr.friendsRelationsArr.map(async item => {
  //   await FriendsList.create(item);
  // });

  // dataArr.FriendStatusArr.map(async item => {
  //   await FriendStatus.create(item);
  // })

  // dataArr.CategoriesArr.map(async item => {
  //   await ObjectCategorie.create(item);
  // });

  // dataArr.ObjectClArr.map(async item => {
  //   await ObjectCl.create(item);
  // });

  // dataArr.ReviewsArr.map(async item => {
  //   await ObjectReview.create(item);
  // });

  // dataArr.FileCategory.map(async item => {
  //   await ObjectFileCategory.create(item);
  // })

  // dataArr.ObjectFiles.map(async item => {
  //   await ObjectFile.create(item)
  // })
  // dataArr.ObjectLocation.map(async item => {
  //   await ObjectLocation.create(item)
  // })
  // dataArr.ObjectWTMonToFri.map(async item => {
  //   await ObjectWtMontoFri.create(item)
  // })
  // dataArr.ObjectWTSaturday.map(async item => {
  //   await ObjectWtSaturday.create(item)
  // })
  // dataArr.ObjectWorkTime.map(async item => {
  //   await ObjectWorkTime.create(item)
  // })
  // dataArr.KitchenWorkTime.map(async item => {
  //   await KitchenWorkTime.create(item)
  // }),
  // dataArr.RestaurantWorkTime.map(async item => {
  //   await RestaurantWorkTime.create(item)
  // })
  // dataArr.DeliveryWorkTime.map(async item => {
  //   await DeliveryWorkTime.create(item)
  // })
  // dataArr.ObjectInfo.map(async item => {
  //   await ObjectInfo.create(item)
  // })
  // dataArr.ObjectPhones.map(async item => {
  //   await ObjectPhones.create(item)
  // })
});


export default db;
