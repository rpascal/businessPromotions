import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {BusinessModel} from '../../models/businessModel'

/*
  Generated class for the BusinessesDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class BusinessesDataProvider {

  private root : string = "_businesses";

  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase) {
  }


  getBusinesses() {
    return this.db.list(`${this.root}`)
  }


  createBusiness(business : BusinessModel){
    business.dateCreated = new Date().toString();
    return this.db.list(`${this.root}`).update(business._uid, business);

  }



}
