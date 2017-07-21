import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { AlertProvider } from '../alert/alert'
import { LoadingProvider } from '../loading/loading'
import { UserDataProvider } from '../user-data/user-data'
import { BusinessesDataProvider } from '../businesses-data/businesses-data'

import 'rxjs/add/operator/take';
import { User } from '../../models/userModel';
import { BusinessModel } from '../../models/businessModel';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(private afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    private fb: Facebook, private platform: Platform,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public udp: UserDataProvider,
    public bdp: BusinessesDataProvider) {
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  facebookLogin() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
  }





  googleLogin() {
    if (this.platform.is('cordova')) {
      // return this.fb.login(['email', 'public_profile']).then(res => {
      //   const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
      //   return firebase.auth().signInWithCredential(facebookCredential);
      // })
    }
    else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

  }


  emailLogin(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.loadingProvider.show();
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((success) => {



          this.loadingProvider.hide();
          resolve();
        })
        .catch((error) => {
          this.loadingProvider.hide();
          let code = error["code"];
          this.alertProvider.showErrorMessage(code);
          reject(error)
        });
    });
  }

  // Register user on Firebase given the email and password.
  register(email, password, userType) {
    this.loadingProvider.show();
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((success) => {
          console.log(success)
          let user: User = new User();
          user._uid = success.uid;
          user.name = email;
          user.userType = userType;
          user.email = email;



          this.udp.createUser(user)
          if (userType === "business") {
            let business: BusinessModel = new BusinessModel();
            business.name = email;
            business._uid = success.uid;

            this.bdp.createBusiness(business);

          }

          // const uid = success.uid;
          // const items = this.db.list('_users');
          // items.update(uid, {
          //   name: email,
          //   dateAdded: new Date().toString(),
          //   userType: userType

          // });
          // console.log(key)
          // if (userType === "business") {

          //   const businesses = this.db.list('_businesses');
          //   businesses.update
          //   businesses.update(uid, {
          //     name: email,
          //     dateAdded: new Date().toString()

          //   });
          // }

          this.loadingProvider.hide();
          resolve("Good to go");
        })
        .catch((error) => {
          this.loadingProvider.hide();
          let code = error["code"];
          this.alertProvider.showErrorMessage(code);
          reject(error)
        });

    });
  }

  // Send Password Reset Email to the user.
  sendPasswordReset(email) {
    this.loadingProvider.show();
    firebase.auth().sendPasswordResetEmail(email)
      .then((success) => {
        this.loadingProvider.hide();
        this.alertProvider.showPasswordResetMessage(email);
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }



}
