import React from 'react';
import FacebookLogin from 'react-facebook-login';



const responseFacebook = (response) => {
  console.log(response);
}

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: []
    }
  }

    render(){
        return(
            <div>
              <FacebookLogin
                appId="350084062068574"
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook} />
            </div>
        )
    }
}
export default Login;