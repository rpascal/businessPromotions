import { NavController, Platform, ViewController, IonicPage } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';

import { GoogleMapComponent } from '../../components/google-map/google-map'

import { GoogleMapPlacesProvider } from '../../providers/google-map-places/google-map-places'
import { BusinessesDataProvider } from '../../providers/businesses-data/businesses-data'

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

  constructor(public navCtrl: NavController, public zone: NgZone,
    public platform: Platform, public googleMapPlaces: GoogleMapPlacesProvider,
    public bdp: BusinessesDataProvider) {
  }


  searchPlace() {
    this.googleMapPlaces.search(this.query).then(res => {
      this.zone.run(() => {
        this.places = [];
        this.places = res;
      })
    })

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

  ionViewDidLoad(): void {

    console.log("load")

    this.mapElement.init().then(map => {
      this.googleMapPlaces.init(map);

      var randomGeoPoints = this.generateRandomPoints({ 'lat': 41.060029, 'lng': -82.0243551 }, 1000, 100);


      // randomGeoPoints.forEach(point => {
      //   let latLng = new google.maps.LatLng(point.lat, point.lng);
      //   this.mapElement.maps.addMarker(latLng)
      //   //console.log(point)
      // })

      this.bdp.getBusinessList().then(business => {
        console.log(business)

        business.forEach(element => {
          // let latLng = new google.maps.LatLng(element.lat, element.lng);
          this.mapElement.maps.addBusinessMarker(element)
        });

        // this.bdp.getBusinessList().then(business2 => {
        //   console.log(business)

        // });
      });

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


}
