import React from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class GoogleMap extends React.Component{
  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };
    render(){
        return(
            <div style={{height:"400px",width:"600px"}}>
              <GoogleMapReact
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                bootstrapURLKeys={{
                  key: 'AIzaSyBK1c1s8Z_sqqZ8VoUYNeP7tR2Z6IVOweg',
                  language: 'en'
                }}
              >
                <AnyReactComponent
                  lat={59.955413}
                  lng={30.337844}
                  text={'Kreyser Avrora'}
                />
              </GoogleMapReact>
            </div>
        )
    }
}
export default GoogleMap;
