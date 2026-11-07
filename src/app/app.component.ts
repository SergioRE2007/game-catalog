import { Component, inject, OnInit } from '@angular/core';
import { Game } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private gameService = inject(GameService);

  games: Game[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  selectedGenre = '';
  selectedPlatform = '';
  searchText = '';
  minPrice = '';
  maxPrice = '';

  foundGame: Game | null = null;
  errorMessage = '';

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService
      .getGames(
        this.currentPage,
        this.pageSize,
        this.selectedGenre,
        this.selectedPlatform,
        this.searchText,
        this.minPrice,
        this.maxPrice
      )
      .subscribe(response => {
        this.games = response.body ?? [];
        this.totalItems = Number(response.headers.get('X-Total-Count') ?? 0);
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      });
  }

  searchById(id: string): void {
    this.foundGame = null;
    this.errorMessage = '';
    if (!id) {
      return;
    }
    this.gameService.getGame(id).subscribe({
      next: game => (this.foundGame = game),
      error: () => (this.errorMessage = 'No existe ningún videojuego con ese id')
    });
  }

  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadGames();
  }

  onPlatformChange(platform: string): void {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.loadGames();
  }

  searchGames(text: string): void {
    this.searchText = text;
    this.currentPage = 1;
    this.loadGames();
  }

  filterByPrice(min: string, max: string): void {
    this.minPrice = min;
    this.maxPrice = max;
    this.currentPage = 1;
    this.loadGames();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGames();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGames();
    }
  }
}
