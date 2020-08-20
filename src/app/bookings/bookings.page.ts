import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { API } from 'aws-amplify';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  constructor(
    private bookingsService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }
  loadedBookings: Booking[];
  private bookingSub: Subscription;
  private toto: string;

  params = {
    headers: {},
    response: true,
    queryStringParameters: {}
  };
  myResponse: any;

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }
  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingitem: IonItemSliding, event: MouseEvent) {
    slidingitem.close();
    this.loadingCtrl.create({message: 'deleting...'}).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancellBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  getProducts() {
    // API.get('ApiSkwafi', '/bookings/object/1002/CD', this.params)
    // API.get('ApiSkwafi', '/bookings/scan', this.params)
    API.get('ApiSkwafi', '/bookings/filter/1001/alex', this.params)
    // API.get('ApiSkwafi', '/bookings/1001', this.params)
      .then(response => {
        // Add your code here
        this.myResponse = response.data;
        console.log(this.myResponse);
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  postProducts() {
   const  test = { id: '545', name: 'aaargh', jkji: 'njdksjndk', type: 'ddd', yop: 'titi' };


   API.put('ApiSkwafi', '/products/', {body: test})
     .then(response => {
       console.log (response);
     })
     .catch(error => {
       console.log(error.response);
     });
  }

  deleteProducts() {
    const  test = { id: '545' };
  //   API.del('ApiSkwafi', '/products', { queryStringParameters: {id: '545'}})
  //     .then(response => {
  //       console.log (response);
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //       });
  //  }
    // this.authService.authUser.subscribe(toto => { this.toto = toto.username; console.log(this.toto); });
  }

}
