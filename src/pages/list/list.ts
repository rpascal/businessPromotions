import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, Loading } from 'ionic-angular';
import { BusinessesDataProvider } from '../../providers/businesses-data/businesses-data'
// import { Geolocation } from '@ionic-native/geolocation';

import { CurrentLocationProvider } from '../../providers/current-location/current-location';
import {GoogleMapsProvider} from '../../providers/google-maps/google-maps'


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

  businesses = [];

  constructor(public bdp: BusinessesDataProvider, public navCtrl: NavController,
    public zone: NgZone, public navParams: NavParams, public loadingCtrl: LoadingController,
    public events: Events, public curLoc: CurrentLocationProvider,public maps : GoogleMapsProvider) {
  }

  ionViewDidLoad() {
    this.initBusinessesList();

    // this.curLoc.getCurrentocation().then(res => {
    //   this.initBusinessesList(res);

    // })
  }


  selectBusiness(business) {
    this.navCtrl.push("BusinessPromosPage", { key: business._uid });
  }
  initBusinessesList() {

    // initBusinessesList(currentPosition: { lat: number, lng: number }) {
    // this.bdp.changeLocation({ lat: 41.059481, lng: -82.023820 });
    // this.bdp.changeLocation(currentPosition);





    //this.businesses = this.bdp.getBusinessData()
    this.maps.getLocations().subscribe(data => {

      const loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present()
      this.zone.run(() => {
        this.businesses = data;
        loader.dismiss();
      });
    })

  }


}
