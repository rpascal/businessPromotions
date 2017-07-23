import { NavController, Platform, ViewController, IonicPage } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
// import { PredictiveSearchComponent } from '../../components/predictive-search/predictive-search'
declare var google;

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, public maps: GoogleMapsProvider) {
  }


  init(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement, this.navCtrl).then(() => {

        // let latLng = new google.maps.LatLng(41.060029, -82.0243551);
        // this.maps.addMarker(latLng)

        resolve(this.maps.map)
        // this.geolocation.getCurrentPosition().then((position) => {
        //   console.log("position")
        //   let latLng = new google.maps.LatLng(41.060029, -82.0243551);
        //   this.maps.addMarker(latLng)
        // });
      }).catch(err=>{
        reject(err);
      });


    })

  }

  setCenter(lat, lng) {

    this.maps.map.setCenter({ lat: lat, lng: lng });
  }


}
