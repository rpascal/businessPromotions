import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BusinessesDataProvider} from '../../providers/businesses-data/businesses-data'
/**
 * Generated class for the ViewBusinessesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-businesses',
  templateUrl: 'view-businesses.html',
})
export class ViewBusinessesPage {

  businesses;

  constructor(public navCtrl: NavController, public navParams: NavParams, public bdp : BusinessesDataProvider) {
    this.businesses = bdp.getBusinesses();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewBusinessesPage');
  }

  selectBusiness(business){
    console.log(business)
    this.navCtrl.push("BusinessPromosPage",{key : business.$key});
  }

}
