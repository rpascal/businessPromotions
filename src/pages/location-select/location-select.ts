import { NavController, Platform, ViewController, IonicPage } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';

import { GoogleMapComponent } from '../../components/google-map/google-map'

import { GoogleMapPlacesProvider } from '../../providers/google-map-places/google-map-places'
import { BusinessesDataProvider } from '../../providers/businesses-data/businesses-data'

import { Geolocation } from '@ionic-native/geolocation';

import { ToastController } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-location-select',
  templateUrl: 'location-select.html',
})
export class LocationSelectPage {

  @ViewChild('map') mapElement: GoogleMapComponent;

  places: any = [];
  query: string;

  constructor(public navCtrl: NavController, public zone: NgZone, private toastCtrl: ToastController,
    public platform: Platform, public googleMapPlaces: GoogleMapPlacesProvider,
    public bdp: BusinessesDataProvider,
    public geolocation: Geolocation) {
  }


  searchPlace() {
    this.googleMapPlaces.search(this.query).then(res => {
      this.zone.run(() => {
        this.places = [];
        this.places = res;
      })
    })

  }



  ionViewDidLoad(): void {

    console.log("load")
    this.geolocation.getCurrentPosition().then(currentLocation => {

      //this.presentToast(currentLocation)

      this.mapElement.init().then(map => {
        this.googleMapPlaces.init(map);

        // this.mapElement.setCenter(currentLocation.coords.latitude, currentLocation.coords.longitude)
        
        //default position to where the markers will show up
        this.mapElement.setCenter(41.059481, -82.023820)
        

        this.bdp.getBusinessList(currentLocation).then(business => {
          business.forEach(element => {
            this.zone.run(() => {
              this.mapElement.maps.addBusinessMarker(element)
              // this.presentToast("done")
            })

          });




        });



      });

    }).catch(err => {
      this.presentToast(err)
    });




  }

  selectPlace(place) {

    this.googleMapPlaces.getSelectedPlaceDetails(place).then(res => {
      this.zone.run(() => {
        this.places = [];
        this.mapElement.setCenter(res.lat, res.lng)
      });

    });


  }


  ngOnDestroy() {
    console.log('destroy')
    this.bdp.dispose();

  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  generateRandomPoint(center, radius) {
    var x0 = center.lng;
    var y0 = center.lat;
    // Convert Radius from meters to degrees.
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var xp = x / Math.cos(y0);

    // Resulting point.
    return { 'lat': y + y0, 'lng': xp + x0 };
  }
  generateRandomPoints(center, radius, count) {
    var points = [];
    for (var i = 0; i < count; i++) {
      points.push(this.generateRandomPoint(center, radius));
    }
    return points;
  }


}
