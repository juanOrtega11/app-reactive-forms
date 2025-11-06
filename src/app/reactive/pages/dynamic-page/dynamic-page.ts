import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.html',
})
export class DynamicPage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;
  myForm: FormGroup = this.fb.group({
    // id: [Date.now()],
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array(
      [
        this.fb.group({
          id: [Date.now()],
          name: ['Metal Gear', Validators.required],
        }),
        this.fb.group({
          id: [Date.now()],
          name: ['Death Stranding', Validators.required],
        }),
      ],
      Validators.minLength(2)
    ),
  });

  // En tu componente
  trackByItemId(index: number, item: AbstractControl): any {
    return item.get('id')?.value;
  }

  newFavorite = new FormControl('', Validators.required);

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  addToFavorites() {
    if (this.newFavorite.invalid) return;
    const newGame = this.fb.group({
      id: [Date.now()],
      name: [this.newFavorite.value, Validators.required],
    });
    this.favoriteGames.push(newGame);
    console.log({ newGame });

    this.newFavorite.reset();
  }

  deleteFavorite(id: number) {
    this.favoriteGames.removeAt(id);
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
  }
}
