import React from 'react';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log(response);
  }

export default () => (
  <div>
    <FacebookLogin
            appId="151650115563827"
            autoLoad={false}
            fields="name,email,id"
            textButton= 'login'
            callback={responseFacebook}
            icon="fa-facebook"
    />
  </div>
);