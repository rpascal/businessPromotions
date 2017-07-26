import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BusinessesDataProvider } from '../../providers/businesses-data/businesses-data'
import { Geolocation } from '@ionic-native/geolocation';



/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  businesses;

  constructor(public bdp: BusinessesDataProvider, public navCtrl: NavController,
    public zone: NgZone, public navParams: NavParams, public geolocation: Geolocation,
    public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
    this.geolocation.getCurrentPosition().then(currentLocation => {
      this.initBusinessesList({ lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude });
    }).catch(err => {
      console.log(err);
      this.initBusinessesList({ lat: 41.059481, lng: -82.023820 });
    });

  }


  selectBusiness(business) {
    this.navCtrl.push("BusinessPromosPage", { key: business._uid });
  }

  initBusinessesList(currentPosition: { lat: number, lng: number }) {
    this.bdp.changeLocation({ lat: 41.059481, lng: -82.023820 });
    this.businesses = this.bdp.getBusinessData()
  }


}
