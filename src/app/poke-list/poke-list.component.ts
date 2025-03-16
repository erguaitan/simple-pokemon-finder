import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeCardComponent } from '../poke-card/poke-card.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [CommonModule, PokeCardComponent, HttpClientModule, FormsModule],
  templateUrl: './poke-list.component.html',
  styleUrls: ['./poke-list.component.css'],
})
export class PokeListComponent implements OnInit {
  pokemonInfo: any[] = [];
  pokemonNames: any[] = [];
  pokemonName: string = '';
  isPokeSearchActive: boolean = false;
  urlFilter: any = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPokemonInfo();
  }

  onPokeSearch(): void {
    this.resetValues();
    this.pokemonName = this.pokemonName.trim();
    if (this.pokemonName === '') {
      this.getPokemonInfo();
      this.isPokeSearchActive = false;
    } else {
      this.getFilteredPokemonInfo();
      this.isPokeSearchActive = true;
    }
  }

  clearPokeSearch(): void {
    this.resetValues();
    this.pokemonName = '';
    this.getPokemonInfo();
    this.isPokeSearchActive = false;
  }

  getPokemonInfo(): void {
    this.http
      .get<any>(this.urlFilter)
      .subscribe((response) => {
        const names = response.results
          .map((pokemon: { name: string }) => pokemon.name)
        this.getPokemonsDetails(names);
        this.urlFilter = response.next
      });
  }

  getFilteredPokemonInfo(): void {
    this.http
      .get<any>(this.urlFilter)
      .subscribe((response) => {
        const names = response.results
          .map((pokemon: { name: string }) => pokemon.name)
          .filter((name: string) => name.includes(this.pokemonName));
        this.pokemonNames = [...this.pokemonNames, ...names];
        this.urlFilter = response.next
        
        if (this.pokemonNames.length < 10 && response.next) {
          if (names.length > 0) {
            this.getPokemonsDetails(names);
          }
          this.getFilteredPokemonInfo();
        } else {
          this.getPokemonsDetails(names);
        }
      });
  }

  getPokemonsDetails(names: string[]): void {
    const requests = names.map((name) =>
      this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`)
    );
  
    forkJoin(requests).subscribe((pokeDataArray) => {
      pokeDataArray.forEach((pokeData) => {
        const pokemon = this.formatPokemonData(pokeData);
        this.pokemonInfo.push(pokemon);
      });
    });
  }  

  formatPokemonData(pokeData: any): any {
    return {
      nombre: pokeData.name,
      altura: pokeData.height / 10,
      peso: pokeData.weight / 10,
      tipo: pokeData.types
        .map(
          (typeInfo: { type: { name: string } }) =>
            typeInfo.type.name.charAt(0).toUpperCase() +
            typeInfo.type.name.slice(1)
        )
        .join(' · '),
      foto: pokeData.sprites.front_default,
      stats: pokeData.stats.map(
        (statInfo: { stat: { name: string } }) => statInfo.stat.name
      ),
    };
  }

  loadMorePokemon(): void {
    if (this.pokemonName === '') {
      this.getPokemonInfo();
    } else {
      this.pokemonNames = [];
      this.getFilteredPokemonInfo();
    }
  }

  trackByFn(item: any): string {
    return item.nombre;
  }

  resetValues(): void {
    this.pokemonInfo = [];
    this.pokemonNames = [];
    this.urlFilter = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"; 
  }
  
}
