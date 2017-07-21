import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data'
import { PromosDataProvider } from '../../providers/promos-data/promos-data'
import { AuthProvider } from '../../providers/auth/auth'

import { ToastController } from 'ionic-angular';
import { PromoModel } from '../../models/promoModel'


@IonicPage({
  
})
@Component({
  selector: 'page-add-promo',
  templateUrl: 'add-promo.html',
  
})
export class AddPromoPage implements OnDestroy {

  currentUser
  promoName: string;
  promoDesc: string;

  promo: PromoModel = new PromoModel();

  constructor(public navCtrl: NavController, public navParams: NavParams, public udp: UserDataProvider
    , private toastCtrl: ToastController
    , public pdp: PromosDataProvider, public auth: AuthProvider) {
      console.log("add-promo")
  }


  ionViewCanEnter() {

    return new Promise((resolve, reject) => {
      this.auth.isBusiness()
        .then(user => {
          this.currentUser = user;
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          this.presentToast()
          reject(false)
        });
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPromoPage');

  }

  public newPromo() {
    this.promo._businessKey = this.currentUser.$key;
    this.pdp.newPromo(this.promo).then(res => {

      let toast = this.toastCtrl.create({
        message: 'Promo Created',
        duration: 2000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();


    });
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'No Access not a business',
      duration: 1000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  ngOnDestroy() {
    console.log('destroy')
    this.auth.dispose();

  }

}
