import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { User } from '../../models/userModel';

/*
  Generated class for the UserDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserDataProvider {

  private root: string = "_users";

  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase) {
  }

  public getUser(uid) {
    return this.db.object(`${this.root}/${uid}`);
  }

  public getUserAuth() {
    return this.afAuth.authState.take(1);
  }

  public getCurrentUser(callback) {
    this.getUserAuth().subscribe(data => {
      this.db.object(`${this.root}/${data.uid}`).subscribe(callback);
    })

  }


  public createUser(user: User) {
    user.dateCreated = new Date().toString();
    return this.db.list(`${this.root}`).update(user._uid, user);
  }

}
