import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth } from 'aws-amplify';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingsService } from '../../../bookings/bookings.service';
import { AuthService } from '../../../auth/auth.service';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';


@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;

  private placeSub: Subscription;
  constructor(
    private navctrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlacesService,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingsService: BookingsService,
    private authservice: AuthService,
    private loadingCtrl: LoadingController,
    private alertctrl: AlertController) {}

    ngOnInit() {

      // Auth.currentAuthenticatedUser({ bypassCache: false}).then(
      //   user => {
      //  this.userName = user.username;
      //  this.userId = user.attributes.sub;
      //  // begin
       this.route.paramMap.subscribe(
        paramMap => {
          if (!paramMap.has('placeId')) {
            this.navctrl.navigateBack('/places/tabs/discover');
            return;
          }
          this.isLoading = true;
          this.placeSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe(
            place => {
              if (!place) {
                this.alertctrl.create(
                  {
                    header: 'warning',
                    message: 'problem',
                    buttons: [{text: 'Okay', handler: () => {
                      this.router.navigate(['/places/tabs/offers']);
                    }}]
                  }
                ).then(
                  alertEl => { alertEl.present(); }
                );
              } else {
                this.place = place;
                this.isBookable = place.userId !== this.authservice.userId;
                this.isLoading = false;
              }
            });
        }
      );
    //    // end
    //  })
    //  .catch(err => console.log(err));
    }

    ngOnDestroy() {
      if (this.placeSub) {
        this.placeSub.unsubscribe();
      }
    }

  onShowFullMap() {
    this.modalController
    .create({
      component: MapModalComponent,
      componentProps: {
        center: {
          lat: this.place.location.lat,
          lng: this.place.location.lng
        },
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address
      }
      })
      .then(modaEl => {
        modaEl.present();
      }) ;
    }

  onBookPlace() {
    // this.navctrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode},
    }).then(
        modaEl => {
          modaEl.present();
          return modaEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          this.loadingCtrl.create({message: 'creting bookings..., '}).then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
            this.bookingsService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.firstName,
              data.lastName,
              data.guestNumber,
              data.dateFrom,
              data.dateTo
            ).subscribe( ()  => {
              loadingEl.dismiss();
              });
          });
        }
      });

  }
}
