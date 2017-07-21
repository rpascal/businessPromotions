import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserDataProvider } from '../user-data/user-data'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/takeUntil';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {

  private destroy$: Subject<any> 


  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase,
    public userProvider: UserDataProvider) {
      this.destroy$ = new Subject<any>();
      console.log("created auth")
  }

  public isAuthenticated() {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.take(1).subscribe(user => {
        //console.log("user", user)
        if (user) {
          resolve(user);
        } else {
          reject("No Access from user check");
        }

      })
    });
  }


  public isBusiness() {
    return new Promise((resolve, reject) => {
      this.isAuthenticated()
        .then(user => {
          this.userProvider.getUser(user["uid"]).takeUntil(this.destroy$).subscribe(searchedUser => {
          //  console.log(searchedUser)
            if (searchedUser.userType === "business") {
              resolve(searchedUser);
            } else {
              reject("No Access from is business");
            }
          })
        }).catch(err => {
          reject(err);
        });
    });
  }


  public dispose() {
    console.log("dispose auth")
    // this.destroy$.next(true);
    // this.destroy$.unsubscribe();
  }



}
