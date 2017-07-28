import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the CurrentLocationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CurrentLocationProvider {


  currentLocation: { lat: number, lng: number };

  constructor(public geolocation: Geolocation) {
    console.log('Hello CurrentLocationProvider Provider');
    //this.currentLocation = { lat: 41.059481, lng: -82.023820 };
    this.geolocation.watchPosition().subscribe(data => {
      console.log("locaiton chage", data);
      this.currentLocation = { lat: data.coords.latitude, lng: data.coords.longitude };
    });


  }

  getDefault(){
    return { lat: 41.059481, lng: -82.023820 };
  }

  watchLocation() {
    return this.geolocation.watchPosition();
  }


  getCurrentocation(): Promise<{ lat: number, lng: number }> {
    //return this.currentLocation;
    if (this.currentLocation) {
      return Promise.resolve(this.currentLocation)
    }
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then(currentLocation => {
        resolve({ lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude })
        // this.initBusinessesList({ lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude });
      }).catch(err => {
        console.log(err);
        resolve({ lat: 41.059481, lng: -82.023820 })
        // this.initBusinessesList({ lat: 41.059481, lng: -82.023820 });
      });

    });

  }






}
