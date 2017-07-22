import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserDataProvider } from '../user-data/user-data'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Subscription } from "rxjs/Subscription";

import 'rxjs/add/operator/takeUntil';

@Injectable()
export class AuthProvider {

  private subscriptions: Subscription[] = [];

  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase,
    public userProvider: UserDataProvider) {
    console.log("created auth")
  }

  public isAuthenticated() {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.take(1).subscribe(user => {
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
          this.subscriptions
            .push(this.userProvider.getUser(user["uid"]).subscribe(searchedUser => {
              if (searchedUser.userType === "business") {
                resolve(searchedUser);
              } else {
                reject("No Access from is business");
              }
            }));
        }).catch(err => {
          reject(err);
        });
    });
  }


  public dispose() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
    this.subscriptions.length = 0;
  }

}
