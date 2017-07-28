import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPage } from './list';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps'
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service'
import { Network } from '@ionic-native/network';


@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPage),
  ],
  exports: [
    ListPage
  ],
  providers:[
    GoogleMapsProvider,
    ConnectivityServiceProvider,
    Network
  ]
})
export class ListPageModule {}
