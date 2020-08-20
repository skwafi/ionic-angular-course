import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/Operators';

import { Place } from './place.model';
import {  API, Auth } from 'aws-amplify';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
// tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]) ;

  params = {
    headers: {},
    response: true,
    queryStringParameters: {}
  };

  constructor(private authsrv: AuthService) {}


  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return from(API.get('ApiSkwafi', '/products', this.params)).pipe(
      map(resData => {
        const places = [];
        for ( const key in resData.data) {
          if (resData.data.hasOwnProperty(key)) {
            places.push(
                new Place(
                resData.data[key].id,
                resData.data[key].title,
                resData.data[key].description,
                resData.data[key].imageUrl,
                resData.data[key].price,
                new Date(resData.data[key].availableFrom),
                new Date(resData.data[key].availableTo),
                resData.data[key].userId,
                resData.data[key].userName,
                resData.data[key].location
              )
            );
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlace(id: string) {
    // return this._places.pipe(take(1), map(places => {
    //   return {...places.find(p => p.id === id)};
    // }));

    return from(API.get('ApiSkwafi', `/products/${id}`, this.params)).pipe(
      map(resData => {
        // const places = [];
        for ( const key in resData.data) {
          if (resData.data.hasOwnProperty(key)) {
            return new Place(
              resData.data[key].id,
              resData.data[key].title,
              resData.data[key].description,
              resData.data[key].imageUrl,
              resData.data[key].price,
              new Date(resData.data[key].availableFrom),
              new Date(resData.data[key].availableTo),
              resData.data[key].userId,
              resData.data[key].userName,
              resData.data[key].location
          );
          }
        }
        // return places;
      }),
      // tap(places => {
      //   return places;
      //   // this._places.next(places);
      // })
    );

  }

  addPlace(title: string, description: string, price: number, availableFrom: Date, availableTo: Date, location: PlaceLocation) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      availableFrom,
      availableTo,
      this.authsrv.userId,
      this.authsrv.userName,
      location
      );
    const  mybody = { ...newPlace };
    return from(API.put(
      'ApiSkwafi',
      '/products',
      {body: mybody})
      ).pipe(
        switchMap(
          resData => {
            return this.places;
          }),
        take(1),
        tap(places => {
          this._places.next(places.concat(newPlace));
        }
      )
    );
  }

  updatePlace(placeID: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const  updatedPlaceIndex = places.findIndex(pl => pl.id === placeID);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.userName,
          oldPlace.location);
        const  mybody = { ... updatedPlaces[updatedPlaceIndex] };
        return from(
          API.put(
            'ApiSkwafi',
            '/products',
            {body: mybody}
          )
        );
      }),
      tap(() => this._places.next(updatedPlaces) )
    );
  }


//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'olivier'
//   ),
//   new Place(
//     'p2',
// // tslint:disable-next-line: quotemark
//     "L'Amour Toujours",
//     'A romantic place in Paris!',
//     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'toto'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'olivier'
//   )
}
