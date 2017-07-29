import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationSelectPage } from './location-select';

// import {GoogleMapComponent} from '../../components/google-map/google-map'

// import {PredictiveSearchComponent} from '../../components/predictive-search/predictive-search'
import { GoogleMapComponent } from '../../components/google-map/google-map'
// import { GoogleMapPlacesProvider } from '../../providers/google-map-places/google-map-places';

import { GoogleMapPlacesProvider } from '../../providers/google-map-places/google-map-places'
// import { GoogleMapsProvider } from '../../providers/google-maps/google-maps'
// import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service'
// import { Network } from '@ionic-native/network';
// import { Geolocation } from '@ionic-native/geolocation';
// import {MapSettingsComponent} from '../../components/map-settings/map-settings'

@NgModule({
  declarations: [
    LocationSelectPage,
    // PredictiveSearchComponent,
    GoogleMapComponent,
    // MapSettingsComponent
  ],
  imports: [
    IonicPageModule.forChild(LocationSelectPage),

  ],
  exports: [
    LocationSelectPage
  ],
    // entryComponents: [MapSettingsComponent],

  providers: [
    // Network,
    // Geolocation,
    GoogleMapPlacesProvider,
    // GoogleMapsProvider,
    // ConnectivityServiceProvider
  ]
})
export class LocationsSelectPageModule { }
