import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginProvider } from '../providers/login/login'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "home";

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    private afAuth: AngularFireAuth, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public loginProvider: LoginProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "home" },
      // { title: 'List', component: "ListPage" },
      { title: 'Log Off', component: "LogOff" },
      { title: 'Add Promo', component: "AddPromoPage" },
      { title: 'View Businesses', component: "ViewBusinessesPage" },
      { title: 'View Map', component: "LocationSelectPage" },
    ];

  }

  initializeApp() {

    this.afAuth.authState.take(1).subscribe(auth => {
      if (!auth) {
        this.rootPage = "LoginPage";
      }
      // if (auth)
      //   this.rootPage = "home";
      // else
      //   this.rootPage = "LoginPage";
    });


    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.component == "LogOff") {

      this.nav.popToRoot().then(() => {
        this.loginProvider.signOut().then(res => {
          document.location.href = 'index.html';
        });
        // document.location.href = 'index.html';
      });

      //   this.nav.setRoot("LoginPage");

      // this.loginProvider.signOut().then(res => {
      //   this.nav.setRoot("LoginPage");
      //   // this.nav.popToRoot().then(() => {
      //   //   document.location.href = 'index.html';
      //   // });
      // });

    } else
      this.nav.setRoot(page.component);
  }
}
