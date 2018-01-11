export default {
    async  checkSocialToken(network, token) {
        let a = {
          id: null,
          success: false
        };
        if (network == 'facebook') {
          await fetch('https://graph.facebook.com/me?access_token=' + token)
            .then((response) => response.text())
            .then((responseText) => {
              const data = JSON.parse(responseText);
              if (data.id) {
                a.id = data.id;
                a.success = true
              } else {
                a.id = 'Invalid token',
                  a.success = false
              }
      
            })
        } else if (network == 'google') {
          await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
            .then((response) => response.text())
            .then((responseText) => {
              const data = JSON.parse(responseText);
              if (data.id) {
                a.id = data.id;
                a.success = true
              } else {
                a.id = 'Invalid token',
                  a.success = false
              }
            })
        } else {
          a.id = "Social network invalid!";
          a.success = false
        }
        return a;
      },
      async fbGetInfo(id, token) {
        let a;
        await fetch('https://graph.facebook.com/' + id + '/?fields=first_name,last_name,email&access_token=' + token)
          .then((response) => response.text())
          .then((responseText) => {
            const data = JSON.parse(responseText);
            a = data;
          })
        return a;
      },
      async fbGetProfileImage(id) {
        let a;
        await fetch('https://graph.facebook.com/'+id+'/picture/?redirect=0&width=150')
        .then((response)=> response.text())
        .then((responseText) => {
          const data = JSON.parse(responseText)
          a = data;
        })
        return a
      },
      async  googleGetInfo(token) {
        let a = {
          id: null,
          firstName: null,
          lastName: null,
          email: null,
      
        };
        await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
          .then((response) => response.text())
          .then((responseText) => {
            const data = JSON.parse(responseText);
            if (data.id) {
              a.id = data.id;
              a.firstName = data.given_name;
              a.lastName = data.family_name;
              a.email = data.email;
              a.picture = data.picture;
              a.success = true
            } else {
              a.id = 'Invalid token',
                a.success = false
            }
          })
        return a;
      },

      async gGetProfileImage(id, token) {
        let a;
        await fetch ('https://www.googleapis.com/plus/v1/people/'+id+'?fields=image&key='+token)
        .then((response) => response.text())
        .then((responseText) => {
          const data = JSON.parse(responseText);
          a = data
        })
        return a;
      }
}