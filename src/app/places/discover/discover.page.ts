import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AmplifyService } from 'aws-amplify-angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  // userCreated: boolean;

  loadedPlaces: Place[];
  listedLoadedPlace: Place[];
  relevantPlaces: Place[];
  detail: string;
  private placesSub: Subscription;
  isLoading = false;


  constructor(
    private placesService: PlacesService,
    private amplifyService: AmplifyService,
    private authsrv: AuthService
    ) { }

   ngOnInit() {

      this.placesSub = this.placesService.places.subscribe(places => {
        this.loadedPlaces = places;
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlace = this.relevantPlaces.slice(1);
        if (this.detail === 'bookable') {
          this.relevantPlaces = this.listedLoadedPlace.filter(place => place.userId !== this.authsrv.userId);
          this.listedLoadedPlace = this.relevantPlaces.slice(1);
        }
      });

  }
  ionViewWillEnter() {
  this.isLoading = true;
  this.placesService.fetchPlaces().subscribe(() => {
    this.isLoading = false;
  });

}

  ngOnDestroy() {
    if (this.placesSub) { this.placesSub.unsubscribe(); }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.detail = event.detail.value;
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlace = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.listedLoadedPlace.filter(place => place.userId !== this.authsrv.userId);
      this.listedLoadedPlace = this.relevantPlaces.slice(1);
    }
  }
}
