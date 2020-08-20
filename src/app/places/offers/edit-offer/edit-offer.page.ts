import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private placeSub: Subscription;
  isLoading = false;
  placeId: string;

  constructor(
    private route: ActivatedRoute,
    private navctlr: NavController,
    private placeService: PlacesService,
    private router: Router,
    private loadingctrl: LoadingController,
    private alertctrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('placeId')) {
          this.navctlr.navigateBack('/places/tab/offers');
          return;
        }
        this.placeId = paramMap.get('placeId');
        this.isLoading = true;
        this.placeSub =  this.placeService.getPlace(paramMap.get('placeId')).subscribe(
          place => {
            console.log('toto', place);
            if (!place ) {
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
              console.log('titi', place);
              this.place = place;
              this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              })
              });
              this.isLoading = false;
            }
          },
          // error => {
          //   this.alertctrl.create(
          //     {
          //       header: 'warning',
          //       message: 'problem',
          //       buttons: [{text: 'Okay', handler: () => {
          //         this.router.navigate(['/places/tabs/offers']);
          //       }}]
          //     }
          //   ).then(
          //     alertEl => { alertEl.present(); }
          //   );
          // }
        );
      }
    );
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingctrl.create({
      message: 'Updating ...'
    }
    ).then(loadingEl => {
      loadingEl.present();
      this.placeService.updatePlace(
        this.place.id, this.form.value.title, this.form.value.description).subscribe(
          () => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          }
        );
    }

    );

  }

}
