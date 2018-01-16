import faker from 'faker';

export const dataArr = {
    ObjectClArr: Array(32).fill().map(item => {
        return {
          name: faker.company.companyName(),
          shortDescription: faker.lorem.sentence(),
          personId: faker.random.number({min:1, max:3}),
          objectCategoryId: faker.random.number({min:1, max:5}),
          avgRating: faker.random.number({min:0, max:5}),
          address: faker.address.street_name + ' ' + faker.random.number({min: 1, max: 20}).toString(),
          postCode: faker.random.number({min: 1080, max: 12080}),
          city: faker.address.city()
        }
      }),
      ReviewsArr: Array(40).fill().map(item => {
        return {
          textReview: faker.lorem.sentence(),
          rating: faker.random.number({min:0, max:5}),
          personId: faker.random.number({min:1, max:3}),
          objectClId: faker.random.number({min:1, max:5}),
        }
      }),
      friendsRelationsArr: [
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
      ],
      CategoriesArr: [
        {
          name: 'Apoteke',
        },
        {
          name: 'Klinike',
        },
        {
          name: 'Banke',
        },
        {
          name: 'Menjačnice',
        },
        {
          name: 'Bankomati',
        },
        {
          name: 'Restorani',
        },
        {
          name: 'Kafići',
        },
        {
          name: 'Brza hrana',
        },
        {
          name: 'Marketi',
        },
        {
          name: 'Hoteli',
        },
        {
          name: 'Operateri',
        },
      ],
      FriendStatusArr: [
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
      ],
      PersonsArr: [
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
      ],

      FileCategory: [
        {
          type: 'profile',
          desc: 'Profile picture for Object'
        },
        {
          type: 'exterior',
          desc: 'Exterior picture for Object'
        },
        {
          type: 'interior',
          desc: 'Interior picture for Object'
        },
        {
          type: 'food',
          desc: 'Food picture for Object'
        }
      ],
      ObjectFiles: [
        {
          fileUrl: 'http://cdn.idesignow.com/public_html/img/2015/06/cafe-bar-restaurant-logo-17.jpg',
          desc: 'This is a very nice restaurant',
          objectClId: 1,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'http://diylogodesigns.com/blog/wp-content/uploads/2015/09/restaurant-logos.jpg',
          desc: 'Lukas favorite restaurant!',
          objectClId: 2,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://marketplace.canva.com/MACP0zWxJzE/1/0/thumbnail_large/canva-colorful-burger-icon-restaurant-logo-MACP0zWxJzE.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 3,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://image.freepik.com/free-vector/restaurant-logo-template_1236-155.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 4,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://www.brandcrowd.com/gallery/brands/pictures/picture12681208825244.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 5,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://i.pinimg.com/564x/0d/82/f9/0d82f9cff5bb23a5fdba81dbf76ac8f9--chase-bank-logo-s.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 6,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://static.mts.rs/vesti/MTS-Tvoj-Svet-1920x1080.jpg?d=False&h=635827483175600000',
          desc: 'Veoma lep restorancic',
          objectClId: 7,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://exquisiteconcierge.co.uk/wp-content/uploads/2016/05/timberland-logo-wallpaper.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 8,
          objectFileCategoryId: 1
        },
        {
          fileUrl: 'https://i.pinimg.com/736x/d7/da/ed/d7daed5a4cd14de571360cb09c2c89be--restaurant-exterior-design-ara.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 3
        },
        {
          fileUrl: 'https://secondandseven.co/imgs/amazing-beach-house-coffee-tables-best-25-restaurant-exterior-design-ideas-on-pinterest-exterior-outdoor-cafe-and-20171230081254.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 3
        },
        {
          fileUrl: 'http://www.coolenevada.com/images/Modern-Italian-Restaurant-Exterior-Design-Ferraros-Las-Vegas.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 3
        },
        {
          fileUrl: 'https://static.dezeen.com/uploads/2017/06/salon-sociedad-communal-interiors-restaurants-and-bars_dezeen_hero-1.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 2
        },
        {
          fileUrl: 'https://static.dezeen.com/uploads/2017/06/salon-sociedad-communal-interiors-restaurants-and-bars_dezeen_hero-1.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 2
        },
        {
          fileUrl: 'https://static.dezeen.com/uploads/2017/06/salon-sociedad-communal-interiors-restaurants-and-bars_dezeen_hero-1.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 2
        },
        {
          fileUrl: 'https://drop.ndtv.com/albums/COOKS/pasta-vegetarian/pastaveg_640x480.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 4
        },
        {
          fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 4
        },
        {
          fileUrl: 'https://drop.ndtv.com/albums/COOKS/chicken-dinner/chickendinner_640x480.jpg',
          desc: 'Veoma lep restorancic',
          objectClId: 1,
          objectFileCategoryId: 4
        },
      ],
      ObjectLocation: [
        {
          lat: 44.766313,
          lng: 20.368652,
          objectClId: 1,
          address: 'Kneza Mihaila 6',
          city: 'Beograd',
          zipCode: '11000'
        },
        {
          lat: 44.789652,
          lng: 20.433025,
          objectClId: 2,
          address: 'Bubanjska 1a',
          city: 'Beograd',
          zipCode: '11130'
        },
        {
          lat: 44.814377,
          lng: 20.495167,
          objectClId: 3
        },
        {
          lat: 44.826675,
          lng: 20.410194,
          objectClId: 4
        },
        {
          lat: 44.851507,
          lng: 20.375519,
          objectClId: 5
        },
        {
          lat: 44.820569,
          lng: 20.291576,
          objectClId: 6
        },
        {
          lat: 44.760406,
          lng: 20.412941,
          objectClId: 7
        },
        {
          lat: 44.737486,
          lng: 20.380497,
          objectClId: 8
        },
        {
          lat: 44.784535,
          lng: 20.486240,
          objectClId: 9
        },
        {
          lat: 44.806949,
          lng: 20.554905,
          objectClId: 10
        },
      ],
      ObjectWTMonToFri: [
        {
          opening: '0000',
          closing: '2400'
        },
        {
          opening: '0800',
          closing: '1600'
        },
        {
          opening: '0900',
          closing: '1700'
        },
        {
          opening: '0645',
          closing: '2030'
        },
      ],
      ObjectWTSaturday: [
        {
          opening: '0000',
          closing: '2400'
        },
        {
          opening: '1000',
          closing: '1400'
        },
        {
          opening: '0900',
          closing: '1500'
        }
      ],
      ObjectWorkTime: [
        {
          objectClId: 1,
          isAlwaysOpened: true,
          objectWtMontoFriId: 1,
          objectWtSaturdayId: 1,
        },
        {
          objectClId: 2,
          isAlwaysOpened: false,
          objectWtMontoFriId: 2,
          objectWtSaturdayId: 2
        },
        {
          objectClId: 3,
          isAlwaysOpened: false,
          objectWtMontoFriId: 3,
          objectWtSaturdayId: 3
        },
        {
          objectClId: 4,
          isAlwaysOpened: false,
          objectWtMontoFriId: 4
        },
      ],
      KitchenWorkTime: [
        {
          objectClId: 1,
          objectWtMontoFriId: 3,
          objectWtSaturdayId: 2
        }
      ],
      RestaurantWorkTime: [
        {
          objectClId: 1,
          objectWtMontoFriId: 3,
          objectWtSaturdayId: 2
        }
      ],
      DeliveryWorkTime: [
        {
          objectClId: 1,
          objectWtMontoFriId: 3,
          objectWtSaturdayId: 2
        }
      ]
}


  




