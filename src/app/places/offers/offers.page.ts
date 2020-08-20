import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit , OnDestroy {


  offers: Place[];
  isLoading = false;
  private placesSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router) { }

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe(places => {
      this.offers =  places;
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => this.isLoading = false);
  }

  ngOnDestroy() {
    if (this.placesSubscription) { this.placesSubscription.unsubscribe(); }
  }

  onEdit(offerId: string, ionitemsliding: IonItemSliding ) {
    ionitemsliding.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
