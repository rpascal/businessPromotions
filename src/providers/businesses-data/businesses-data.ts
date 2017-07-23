import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BusinessModel } from '../../models/businessModel'

import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from "rxjs/Subscription";

/*
  Generated class for the BusinessesDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class BusinessesDataProvider {

  private root: string = "_businesses";

  private businesses = [];

  private subscriptions: Subscription[] = [];


  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public geolocation: Geolocation) {
  }


  getBusinesses() {
    return this.db.list(`${this.root}`)
  }


  createBusiness(business: BusinessModel) {
    business.dateCreated = new Date().toString();
    return this.db.list(`${this.root}`).update(business._uid, business);

  }



  getBusinessList(currentPosition): Promise<any> {

    if (this.businesses.length > 0) {
      console.log("exists")
      return Promise.resolve(this.businesses);
    } else {
      console.log("doesnt")
      return new Promise<any>((resolve, reject) => {
        this.subscriptions.push(this.db.list(`${this.root}`).subscribe(data => {

          //           alert("data")
          //resolve(data);
          // this.businesses = data;
          // let temp = data;
          //this.geolocation.getCurrentPosition().then(res => {

            this.applyHaversine(data, currentPosition).then(newData => {

              data.sort((locationA, locationB) => {
                return locationA.distance - locationB.distance;
              });
              this.businesses = data;

              resolve(this.businesses);
            }).catch(err => {
              reject(err)
            });

//          });



        }))

      });
    }

  }


  applyHaversine(locations, currentLocation) {
    return new Promise((resolve, reject) => {
     // this.geolocation.getCurrentPosition().then(res => {
     //   console.log("pos", res)
        let usersLocation = {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        };

        locations.map((location) => {

          let placeLocation = {
            lat: location.lat,
            lng: location.lng
          };

          location.distance = this.getDistanceBetweenPoints(
            usersLocation,
            placeLocation,
            'miles'
          ).toFixed(2);
        });

        resolve(locations); // As soon as this is called, the "then" in will be executed in the function below.

     // }).catch(reject);
    });
  }
  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }


  public dispose() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
    this.subscriptions.length = 0;
  }


}
