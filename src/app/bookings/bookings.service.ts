import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { take, tap, delay, switchMap } from 'rxjs/Operators';
import { Booking } from './booking.model';
import {  API } from 'aws-amplify';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})

export class BookingsService {
// tslint:disable-next-line: variable-name
    private _bookings = new BehaviorSubject<Booking[]>([]);

    params = {
        headers: {},
        response: true,
        queryStringParameters: {}
      };

    get bookings() {
        return this._bookings.asObservable();
    }
    constructor( private authsrv: AuthService) {}

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date) {

        const newBooking = new Booking(
            Math.random().toString(), placeId, this.authsrv.userName , placeTitle,
            placeImage, firstName, lastName, guestNumber, dateFrom, dateTo
        );
        const  mybody = { ...newBooking };
        return from(API.put(
            'ApiSkwafi',
            '/products',
            {body: mybody})
        ).pipe(
            switchMap(
                resData => {
                    return this.bookings;
                }),
            take(1),
            tap(bookings => {
                this._bookings.next(bookings.concat(newBooking));
            }
        )
        );
        }

    cancellBooking(bookingId: string) {
        return this.bookings.pipe(
            take(1),
            delay(1000),
            tap(bookings => {
                this._bookings.next(bookings.filter(b => b.id !== bookingId));
            })
        );
    }
    fetchBookings() {
            // return await API.get(apiName, path, myInit);
            // }
    }
}