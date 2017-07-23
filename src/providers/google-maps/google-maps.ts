import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../connectivity-service/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Injectable()
export class GoogleMapsProvider {


  navCtrl: any;

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string = "AIzaSyAxKKrdC08TkrbHw5SNmQzhW6TareXXFwI";

  constructor(public connectivityService: ConnectivityServiceProvider, public geolocation: Geolocation) {

  }

  init(mapElement: any, pleaseConnect: any, navCtrl): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    this.navCtrl = navCtrl;

    return this.loadGoogleMaps();

  }

  loadGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if (typeof google == "undefined" || typeof google.maps == "undefined") {

        this.disableMap();

        if (this.connectivityService.isOnline()) {

          window['mapInit'] = () => {

            this.initMap().then(() => {
              this.enableMap();
              resolve(true);
            });


          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if (this.apiKey) {
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      } else {
        if (this.connectivityService.isOnline()) {
          this.initMap().then(init => {
            this.enableMap();
            resolve(true);
          });

        }
        else {
          this.disableMap();
        }



      }

      this.addConnectivityListeners();

    });

  }

  initMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {
        let mapOptions = {
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);
    });

  }

  createMarker(latLon) {


    var contentString = '<h1>hello</h1>';

    let infoWindow = new google.maps.InfoWindow({
      content: `<p id = "myid">Click</p>`
    });
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('myid').addEventListener('click', () => {
        alert('Clicked');
      });
    });


    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });

    var marker = new google.maps.Marker({
      position: latLon,
      animation: google.maps.Animation.DROP,
      visible : true
      // title: "Hello World!"
    });

    marker.addListener('click', function () {
      infoWindow.open(this.map, marker);
    });




    return marker
  }

  addBusinessMarker(business) {
    var contentString = '<h1>hello</h1>';

    let infoWindow = new google.maps.InfoWindow({
      content: `
            <h1 id = "${business._uid}">${business.name}</h1>
      `
    });
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById(business._uid).addEventListener('click', () => {
        // alert(business.name);
        this.navCtrl.push("BusinessPromosPage", { key: business._uid });
      });
    });


    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    let latLng = new google.maps.LatLng(business.lat, business.lng);
    var marker = new google.maps.Marker({
      position: latLng,
      animation: google.maps.Animation.DROP,
      visible : true
      // title: "Hello World!"
    });

    marker.addListener('click', function () {
      infoWindow.open(this.map, marker);
    });

    marker.setMap(this.map);


  }

  addMarker(latLon) {
    var marker = this.createMarker(latLon);
    marker.setMap(this.map);
    //  console.log(this.map)


    // console.log(this.map)

  }


  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    this.connectivityService.watchOnline().subscribe(() => {

      setTimeout(() => {

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {

      this.disableMap();

    });

  }

}
