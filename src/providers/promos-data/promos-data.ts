import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { PromoModel } from '../../models/promoModel'

/*
  Generated class for the PromosDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PromosDataProvider {

  private root: string = "_promos";


  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase) {
  }


  newPromo(newPromo: PromoModel) {
    newPromo.dateCreated = new Date().toString();
    return this.db.list(`${this.root}/${newPromo._businessKey}`).push(newPromo);
  }

  getPromos(_businessKey) {
    return this.db.list(`${this.root}/${_businessKey}`)
  }




}
