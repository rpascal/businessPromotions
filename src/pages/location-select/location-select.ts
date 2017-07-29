import { NavController, Platform, ViewController, IonicPage, Events, LoadingController, Loading } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';

import { GoogleMapComponent } from '../../components/google-map/google-map'

import { GoogleMapPlacesProvider } from '../../providers/google-map-places/google-map-places'
import { BusinessesDataProvider } from '../../providers/businesses-data/businesses-data'
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps'
// import { Geolocation } from '@ionic-native/geolocation';

import { CurrentLocationProvider } from '../../providers/current-location/current-location';


import { ToastController } from 'ionic-angular';


import { MapSettingsComponent } from '../../components/map-settings/map-settings'



import { PopoverController } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-location-select',
  templateUrl: 'location-select.html',
})
export class LocationSelectPage {

  @ViewChild('map') mapElement: GoogleMapComponent;

  places: any = [];
  query: string;

  loader: Loading;

  constructor(public events: Events, public navCtrl: NavController, public zone: NgZone, private toastCtrl: ToastController,
    public platform: Platform, public googleMapPlaces: GoogleMapPlacesProvider,
    public bdp: BusinessesDataProvider, public curLoc: CurrentLocationProvider,
    public loadingCtrl: LoadingController, public popover: PopoverController,
    public maps: GoogleMapsProvider) {
  }



  ionViewDidLoad(): void {
    this.curLoc.getCurrentocation().then(res => {
      this.initializeMap(res);
    })
  }

  initializeMap(currentPosition: { lat: number, lng: number }) {
    this.mapElement.init().then(map => {
      this.googleMapPlaces.init(map);
      // this.loader.dismiss();
      this.mapElement.setCenter(currentPosition.lat, currentPosition.lng)
      //default position to where the markers will show up
      // this.mapElement.setCenter(41.059481, -82.023820)

      // this.bdp.getBusinessData().subscribe(businesses => {
      //   console.log("business subscript")
      //   const loader = this.loadingCtrl.create({
      //     content: 'Please wait...'
      //   });
      //   loader.present()
      //   this.zone.run(() => {
      //     this.mapElement.maps.addBusinessMarkers(businesses)
      //     loader.dismiss();
      //     if (this.loader) {
      //       console.log("dismiss")
      //       this.loader.dismiss();
      //       this.loader = null;
      //     }
      //   });
      // });
    })


  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    //loading.present();
    return loading;
  }





  searchPlace() {
    this.googleMapPlaces.search(this.query).then(res => {
      this.zone.run(() => {
        this.places = [];
        this.places = res;
      })
    })

  }


  selectPlace(place) {

    this.googleMapPlaces.getSelectedPlaceDetails(place).then(res => {
      this.maps.changeLocation({ lat: res.lat, lng: res.lng });
      this.zone.run(() => {
        this.places = [];
        this.mapElement.setCenter(res.lat, res.lng)
      });
    });


  }


  ngOnDestroy() {
    console.log('destroy')
    this.bdp.dispose();

  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  openSettings(ev) {
    let popover = this.popover.create(MapSettingsComponent, {
      page: this,
    });

    popover.present({
      ev: ev
    });


  }

}
