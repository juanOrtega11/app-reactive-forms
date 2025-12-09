import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.services';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.html',
})
export class CountryPage {
  fb = inject(FormBuilder);
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);

  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect((onCleanup) => {
    // el signo de admiracion significa que siempre va a existir un valor
    const regionSubscription = this.onRegionChanged();
    onCleanup(() => {
      regionSubscription.unsubscribe();
      // console.log('limpiado');
    });
  });

  onRegionChanged() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => {
          this.borders.set([]);
          this.countriesByRegion.set([]);
        }),
        switchMap((region) =>
          this.countryService.getCountriesByRegion(region ?? '')
        )
      )
      .subscribe((countries) => {
        // console.log({ countries });

        this.countriesByRegion.set(countries);
      });
  }
}
