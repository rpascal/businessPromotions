import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearByTabsPage } from './near-by-tabs';
// import { GoogleMapPlacesProvider } from '../../providers/google-map-places/google-map-places'
// import { MapSettingsComponent } from '../../components/map-settings/map-settings'


@NgModule({
  declarations: [
    NearByTabsPage,
    // MapSettingsComponent
  ],
  imports: [
    IonicPageModule.forChild(NearByTabsPage),
  ],
  exports: [
    NearByTabsPage
  ],
  providers: [

  ]
})
export class NearByTabsPageModule { }
