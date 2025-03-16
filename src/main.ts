import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PokeListComponent } from './app/poke-list/poke-list.component';

@Component({
  selector: 'app-root',
  imports: [PokeListComponent],
  template: `
    <app-poke-list></app-poke-list>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
