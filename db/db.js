import Sequelize from 'sequelize';
// const Sequelize = require('sequelize');

const db = new Sequelize('postgres://kadradiuser:jw8s0F4122Pi&&2@kadradipostgres.cjx5vc7fbujv.eu-west-1.rds.amazonaws.com/kadradi');


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

const UserType = db.define('userType', {
  userType: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
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

const Person = db.define('person', {
  username: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
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
Person.hasOne(Role);
Person.hasOne(UserType);
Person.hasMany(PersonBadges);
Person.hasMany(PersonFiles);

const UserProfile = db.define('userProfile', {
  profileImageUrl: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING
  }
});

UserProfile.belongsTo(Person);


const ObjectCategorie = db.define('objectCategories', {
  name: {
    type: Sequelize.STRING,
    allowNull:false
  }
});

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
ObjectCl.hasOne(ObjectCategorie);
// ObjectCl.hasOne(Person);

const ObjectPhones = db.define('objectPhones', {
  desc: {
    type: Sequelize.STRING,
  },
  number: {
    type: Sequelize.STRING,
  },
});

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
  address: {
    type: Sequelize.STRING,
  }
});
ObjectInfo.belongsTo(ObjectCl);
ObjectInfo.hasMany(ObjectPhones);


const PersonFavoriteObjects = db.define('personFavoriteObjects', {

});
PersonFavoriteObjects.belongsTo(Person);
PersonFavoriteObjects.hasOne(ObjectCl)

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



const FriendStatusArr = [
  {
    status: "Requested"
  },
  {
    status: "Request sent"
  },
  {
    status: "Friends"
  },
  {
    status: "Blocked"
  }
];
const PersonsArr = [
  {
    username: "steva",
    password: "asddd",
    email: "steva@gmai.com",
    firstName: "Steva",
    lastName: "Stevic",
    facebook_id: "asdhasiu1h2suih12iuhiu",
    google_id: "asdhasiu1h2uihasd12iuhiu",
    role_id: 1,
    user_type_id: 1,
  },
  {
    username: "luka",
    password: "asddsdffd",
    email: "luka@gmaai.com",
    firstName: "Luka",
    lastName: "Lukic",
    facebook_id: "asdhasaiu1h2suih12iuhiu",
    google_id: "asdhasius1h2uihasd12iuhiu",
    role_id: 1,
    user_type_id: 1,
  },
  {
    username: "baki",
    password: "asddsfrrffrdffd",
    email: "baki@gmaai.com",
    firstName: "Baki",
    lastName: "Bakic",
    facebook_id: "asdhasaisssu1h2suih12iuhiu",
    google_id: "asdhasiusssss1h2uihasd12iuhiu",
    role_id: 1,
    user_type_id: 1,
  },
];
const friendsRelationsArr = [
  {
    facebookFriend: false,
    googleFriend: false,
    personId: 1,
    friendsPersonId: 2
  },
  {
    facebookFriend: false,
    googleFriend: false,
    personId: 1,
    friendsPersonId: 3
  },
  {
    facebookFriend: false,
    googleFriend: false,
    personId: 2,
    friendsPersonId: 3
  },
]
// db.sync().then(() => {
//   PersonsArr.map(item => {
//     return Person.create(item);
//   });
//   FriendStatusArr.map(item => {
//     return FriendStatus.create(item);
//   });
//   return friendsRelationsArr.map(item => {
//     return FriendsList.create(item);
//   });
// });


export default db;
