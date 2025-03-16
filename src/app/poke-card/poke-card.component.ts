import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poke-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poke-card.component.html',
  styleUrls: ['./poke-card.component.css'],
})
export class PokeCardComponent {
  @Input() pokemonInfo: {
    nombre: string;
    altura: number;
    peso: number;
    tipo: string;
    foto: string;
    stats: string[];
  } = {
    nombre: '',
    altura: 0,
    peso: 0,
    tipo: '',
    foto: '',
    stats: [],
  };
}
