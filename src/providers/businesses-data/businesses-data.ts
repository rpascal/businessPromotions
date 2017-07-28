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

  // private root: string = "_businesses";
  private root: string = "_businessDummt";

  private subscriptions: Subscription[] = [];


  constructor(
    public events: Events,
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


  public dispose() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
    this.subscriptions.length = 0;
  }


}
