import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {User} from '../../models/userModel'

// import { Platform } from 'ionic-angular';
// import { Facebook } from '@ionic-native/facebook';


// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/take';


@IonicPage({
  name: 'home',
  segment: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  userSub :FirebaseObjectObservable<User[]>;

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase) {
    afAuth.authState.take(1).subscribe((user: firebase.User) => {
      this.userSub = db.object('accounts/' + user.uid);
      // .map(data=>{
      //   var user : User = new User();

      //   user.email = data.email;
      //   user.img = data.img;
      //   user.name = data.name;
      //   user.dateCreated = new Date(data.dateCreated);
      //   user.description = data.description;
      //   user.userId = data.userId;
      //   user.userProvider = data.userProvider;
      //   return user;
      // });
    });
  }



  ionViewWillLeave() {
  }





}
