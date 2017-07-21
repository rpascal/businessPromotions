import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PromosDataProvider } from '../../providers/promos-data/promos-data'
/**
 * Generated class for the BusinessPromosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-business-promos',
  templateUrl: 'business-promos.html',
})
export class BusinessPromosPage {

  promos;

  constructor(public navCtrl: NavController, public navParams: NavParams, public PromosDataProvider: PromosDataProvider) {
    this.promos = this.PromosDataProvider.getPromos(this.navParams.get("key"));
  }

  ionViewDidLoad() {

    //   

    // console.log('ionViewDidLoad BusinessPromosPage');
  }

  viewPromo(promo) {
    console.log(promo)

  }

}
