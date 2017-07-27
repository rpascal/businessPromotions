import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { firebase } from '../_configs/firebase'
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DataproviderProvider } from '../providers/dataprovider/dataprovider';
import { LoginProvider } from '../providers/login/login';
import {AlertProvider  } from '../providers/alert/alert';
import { LoadingProvider } from '../providers/loading/loading';
import { Facebook } from '@ionic-native/facebook';
import { UserDataProvider } from '../providers/user-data/user-data';
import { PromosDataProvider } from '../providers/promos-data/promos-data';
import { BusinessesDataProvider } from '../providers/businesses-data/businesses-data';
import { Geolocation } from '@ionic-native/geolocation';
import { CurrentLocationProvider } from '../providers/current-location/current-location';



@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataproviderProvider,
    LoginProvider,
    Facebook,
    AlertProvider,
    LoadingProvider,
    UserDataProvider,
    PromosDataProvider,
    BusinessesDataProvider,
    Geolocation,
    CurrentLocationProvider
  ]
})
export class AppModule { }
