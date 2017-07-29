import { Injectable, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../connectivity-service/connectivity-service';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { BusinessesDataProvider } from '../businesses-data/businesses-data'
declare var google;
import { CurrentLocationProvider } from '../current-location/current-location'
import 'rxjs/add/operator/take';
import { MathOperationsProvider } from '../math-operations/math-operations'

@Injectable()
export class GoogleMapsProvider {


  locationCircle;
  // searchRadius = 250;
  navCtrl: any;

  public defaultRadius = 200;

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string = "AIzaSyAxKKrdC08TkrbHw5SNmQzhW6TareXXFwI";
  private location: BehaviorSubject<{ lat: number, lng: number }> = new BehaviorSubject(this.currentLocationDataProvider.getDefault());
  private radius: BehaviorSubject<number> = new BehaviorSubject(this.defaultRadius);



  manualLocationChange = false;


  currentMarkers: any[] = [];

  constructor(public connectivityService: ConnectivityServiceProvider,
    public businessDataProvider: BusinessesDataProvider,
    public zone: NgZone,
    public currentLocationDataProvider: CurrentLocationProvider,
    public math: MathOperationsProvider) {
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
    this.locationCircle.setCenter(new google.maps.LatLng(newLocation.lat, newLocation.lng));
    this.location.next(newLocation);
  }


  getLocations() {
    return Observable.combineLatest(this.businessDataProvider.getBusinesses(), this.location, this.radius, (x, y, z) => ({ x, y, z })).map(data => {
      let temp = this.math.applyHaversine(data.x, data.y);
      temp.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });
      return temp.filter((item) => +item.distance <= data.z);
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
      this.currentMarkers.push(business);
    });
  }

  addMarker(latLon) {
    var marker = this.createMarker(latLon);
    marker.setMap(this.map);
  }


  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }

  }

  changeRadius(radius) {
    console.log('change radius : ' + radius)
    this.radius.next(radius);
  }

  enableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }

    this.locationCircle = new google.maps.Circle({
      strokeColor: '#0000ff',
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: '#0000ff',
      fillOpacity: 0.12,
      map: this.getMap(),
      // radius: this.math.mileToMeter(this.searchRadius)
    });

    this.radius.subscribe(radius => {
      this.locationCircle.setRadius(this.math.mileToMeter(radius));
      this.defaultRadius = radius
    })

    // this.location.take(1).subscribe(data=>{

    // })

    this.getLocations().subscribe(location => {
      console.log(location, "location")
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




}
