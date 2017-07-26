import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import 'rxjs/add/observable/merge';

// import 'rxjs/add/operator/combine';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BusinessModel } from '../../models/businessModel'

import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subject, SubjectSubscriber } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


// import { Observable } from "rxjs/Observable/";

/*
  Generated class for the BusinessesDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class BusinessesDataProvider {

  private root: string = "_businesses";
  private location: BehaviorSubject<{ lat: number, lng: number }> = new BehaviorSubject({ lat: 41.059481, lng: -82.023820 });
  private businesses = [];

  private subscriptions: Subscription[] = [];


  constructor(
    public events: Events,
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public geolocation: Geolocation) {
  }


  changeLocation(newLocation: { lat: number, lng: number }) {
    console.log("chaneg locarion")
    this.location.next(newLocation)
  }


  getBusinesses() {
    return this.db.list(`${this.root}`)
  }


  createBusiness(business: BusinessModel) {
    business.dateCreated = new Date().toString();
    return this.db.list(`${this.root}`).update(business._uid, business);

  }

  getBusinessData() {
    return Observable.combineLatest(this.db.list(`${this.root}`), this.location, (x, y) => ({ x, y })).map(data => {
      let temp = this.applyHaversine(data.x, data.y);
      temp.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });
      return temp.filter((item) => item.distance <= 50);
      // return temp;
    });
  }

  applyHaversine(locations, currentPosition: { lat: number, lng: number }) {
    //return new Promise((resolve, reject) => {

    let usersLocation = {
      lat: currentPosition.lat,
      lng: currentPosition.lng
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

    return locations;

    // resolve(locations); // As soon as this is called, the "then" in will be executed in the function below.


    // });
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
