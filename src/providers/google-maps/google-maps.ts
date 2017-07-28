import { Injectable, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../connectivity-service/connectivity-service';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { BusinessesDataProvider } from '../businesses-data/businesses-data'
declare var google;
import { CurrentLocationProvider } from '../current-location/current-location'


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
  private location: BehaviorSubject<{ lat: number, lng: number }> = new BehaviorSubject(this.currentLocationDataProvider.getDefault());

  manualLocationChange = false;


  currentMarkers: any[] = [];

  constructor(public connectivityService: ConnectivityServiceProvider,
    public businessDataProvider: BusinessesDataProvider,
    public zone: NgZone,
    public currentLocationDataProvider: CurrentLocationProvider) {
    this.currentLocationDataProvider.getCurrentocation().then(data => {
      this.location.next(data)
    })
    currentLocationDataProvider.watchLocation().subscribe(data => {
      if (!this.manualLocationChange)
        this.location.next({ lat: data.coords.latitude, lng: data.coords.longitude })
    })
    // this.location.subscribe(location => {
    //   this.setCenter(location);
    // })
  }


  setCenter(newCenter) {
    this.changeLocation(newCenter);
    this.getMap().setCenter(newCenter);
  }

  changeLocation(newLocation) {
    this.manualLocationChange = true;
    this.location.next(newLocation);
  }


  getLocations() {
    return Observable.combineLatest(this.businessDataProvider.getBusinesses(), this.location, (x, y) => ({ x, y })).map(data => {
      let temp = this.applyHaversine(data.x, data.y);
      temp.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });
      //return temp;
      return temp.filter((item) => item.distance <= 250);
      // return temp;
    });
  }

  getMap() {
    return this.map;
  }
  getMapCenter() {
    var center = this.getMap().getCenter();
    return { lat: center.lat(), lng: center.lng() };
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
      visible: true
      // title: "Hello World!"
    });

    marker.addListener('click', function () {
      infoWindow.open(this.map, marker);
    });




    return marker
  }

  addBusinessMarkers(businesss) {

    this.currentMarkers = this.currentMarkers.filter(item => {

      var match = businesss.findIndex(i => {
        return i.lat === item.lat && i.lng === item.lng;
      });
      if (match >= 0) {
        return true
      }
      item.marker.setMap(null);
      return false;
    });


    let me = this;
    let needToAdd = businesss.filter(function (el) {
      var match = me.currentMarkers.findIndex(i => {
        return i.lat === el.lat && i.lng === el.lng;
      });
      // console.log(match);
      return match < 0;
    });

    needToAdd.forEach(business => {
      // console.log("add")
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
        visible: true
        // title: "Hello World!"
      });

      marker.addListener('click', function () {
        infoWindow.open(this.map, marker);
      });

      marker.setMap(this.map);
      business.marker = marker;
      // business.latString = business.lat.toString();
      // business.lngString = business.lng.toString();

      this.currentMarkers.push(business);
    });


    //console.log(this.currentMarkers);


    // return marker;

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

    this.getLocations().subscribe(location => {
      console.log("business subscript")
      this.zone.run(() => {
        this.addBusinessMarkers(location)
      });
    });

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

  applyHaversine(locations, currentPosition: { lat: number, lng: number }) {
    //return new Promise((resolve, reject) => {

    let usersLocation = {
      lat: currentPosition.lat,
      lng: currentPosition.lng
    };

    locations.map((location) => {

      let placeLocation = {
        lat: location.lat,
        lng: location.lng
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'miles'
      ).toFixed(2);
    });

    return locations;

    // resolve(locations); // As soon as this is called, the "then" in will be executed in the function below.


    // });
  }
  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }


}
