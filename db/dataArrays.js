import faker from 'faker';

export const dataArr = {
    ObjectClArr: Array(5).fill().map(item => {
        return {
          name: faker.company.companyName(),
          shortDescription: faker.lorem.sentence(),
          personId: faker.random.number({min:1, max:3}),
          objectCategoryId: faker.random.number({min:1, max:5}),
          avgRating: faker.random.number({min:0, max:5})
        }
      }),
      ReviewsArr: Array(10).fill().map(item => {
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
      ]
}


  




