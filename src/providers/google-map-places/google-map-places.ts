import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class GoogleMapPlacesProvider {

  autocompleteService: any;
  placesService: any;

  constructor() {
    console.log('Hello GoogleMapPlacesProvider Provider');
  }

  init(map) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(map);
  }


  search(searchText): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (searchText.length > 0) {
        let config = {
          types: ['geocode'],
          input: searchText
        }
        this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          }
        });
      } else {
        resolve([])
      }
    })
  }

  getSelectedPlaceDetails(place) {


    return new Promise<any>((resolve, reject) => {
      let location = {
        lat: null,
        lng: null,
        name: place.name
      };

      this.placesService.getDetails({ placeId: place.place_id }, (details) => {

        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();

        resolve(location);

      });


    })

  }


}
