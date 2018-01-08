import Sequelize from 'sequelize';
import {friendsRelationsArr, FriendStatusArr, PersonsArr, ObjectClArr, ReviewsArr, CategoriesArr } from './dataArrays';

//const db = new Sequelize('postgres://kadradiuser:jw8s0F4122Pi&&2@kadradipostgres.cjx5vc7fbujv.eu-west-1.rds.amazonaws.com/kadradi');
var db = new Sequelize('mainDB', null, null, {
  dialect: "sqlite",
  storage: './test.sqlite',
});
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

//User Type
const UserType = db.define('userType', {
  userType: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
UserType.hasOne(Person);

//Person Badges
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

//Person Files
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

//ROLE
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

//USER PROFILE 
const UserProfile = db.define('userProfile', {
  profileImageUrl: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING
  },
},
{
  indexes: [{
    unique: true,
    fields: ['personId'],
  }]
});

Person.hasOne(UserProfile);

//Object CLient
const ObjectCl = db.define('objectCl', {
  name: {
    type: Sequelize.STRING,
    allowNull:false
  },
  shortDescription: {
    type: Sequelize.STRING,
    allowNull:false
  }
});
Person.hasOne(ObjectCl);

//Object Categorie
const ObjectCategorie = db.define('objectCategories', {
  name: {
    type: Sequelize.STRING,
    allowNull:false
  }
});
ObjectCategorie.hasOne(ObjectCl);


//Review
const Review = db.define('review', {
  textReview: {
    type: Sequelize.STRING,
  },
  rating: {
    type: Sequelize.STRING,
  },
});
Person.hasOne(Review);
ObjectCl.hasOne(Review);


//Object INFO
const ObjectInfo = db.define('objectInfo', {
  address: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  zipCode: {
    type: Sequelize.STRING,
  },
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

//Object PHONES
const ObjectPhones = db.define('objectPhones', {
  desc: {
    type: Sequelize.STRING,
  },
  number: {
    type: Sequelize.STRING,
  },
});

ObjectPhones.belongsTo(ObjectInfo);


//Object Additional Info
const ObjectAdditionalInfo = db.define('objectAdditionalInfo', {
  info: {
    type: Sequelize.STRING
  }
});

ObjectAdditionalInfo.belongsTo(ObjectInfo);


//Object Restaurant Menu
const ObjectRestaurantMenu = db.define('objectRestaurantMenu', {
  menuUrl: {
    type: Sequelize.STRING
  }
});

ObjectRestaurantMenu.belongsTo(ObjectInfo);


//Object Work Time
const ObjectWorkTime = db.define('objectWorkTime', {
  isAllwaysOpened: {
    type: Sequelize.BOOLEAN
  }
});

ObjectWorkTime.belongsTo(ObjectCl);


//Object Work Time Mond To Fri
const ObjectWtMontoFri = db.define('objectWtMontoFri', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
});
ObjectWtMontoFri.hasOne(ObjectWorkTime);

const ObjectWtSaturday = db.define('objectWtSaturday', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
});
ObjectWtSaturday.hasOne(ObjectWorkTime);

const ObjectWtSunday = db.define('objectWtSunday', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
});
ObjectWtSunday.hasOne(ObjectWorkTime);

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



db.sync({force: true}).then(() => {
  PersonsArr.map(async item => {
    await Person.create(item);
  });

  CategoriesArr.map(async item => {
    await ObjectCategorie.create(item);
  });

  ObjectClArr.map(async item => {
    await ObjectCl.create(item);
  });
  
  ReviewsArr.map(async item => {
    await Review.create(item);
  });
});


export default db;
