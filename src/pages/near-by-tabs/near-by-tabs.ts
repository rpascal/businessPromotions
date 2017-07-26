import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NearByTabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-near-by-tabs',
  templateUrl: 'near-by-tabs.html',
})
export class NearByTabsPage {


  map = "LocationSelectPage";
  list = "ListPage";
  // tab3Root = Page3;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearByTabsPage');
  }

}
