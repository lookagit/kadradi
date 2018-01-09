import React from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

const responseFacebook = (response) => {
  console.log(response);
}

const responseGoogle = (response) => {
  console.log(response);
}

export default () => (
  <div>
    <FacebookLogin
      appId="151650115563827"
      autoLoad={false}
      fields="name,email,id"
      textButton='login'
      callback={responseFacebook}
      icon="fa-facebook"
    />
    <GoogleLogin
      clientId="5801340474-dk0f6tgpebl853sinfbb3sjpa8ndiq08.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
    />
  </div>
);