import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { LocationSelectPage } from '../../pages/location-select/location-select'
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps'
/**
 * Generated class for the MapSettingsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'map-settings',
  templateUrl: 'map-settings.html'
})
export class MapSettingsComponent {

  radius = this.GoogleMapsProvider.defaultRadius;

  public constructor(public GoogleMapsProvider: GoogleMapsProvider, public ViewController : ViewController) {
  }



  searchThisArea() {
    var center = this.GoogleMapsProvider.getMapCenter()
    this.GoogleMapsProvider.setCenter(center);//.setCenter(center.lat, center.lng);
    this.ViewController.dismiss();
    
  }


  changeRadius($event) {
    this.GoogleMapsProvider.changeRadius($event)
    this.ViewController.dismiss();
  }

}
