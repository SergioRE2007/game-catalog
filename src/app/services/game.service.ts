import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/games';

  getGame(id: string) {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  getGames(
    page: number,
    limit: number,
    genre: string,
    platform: string,
    title: string,
    minPrice: string,
    maxPrice: string
  ) {
    let params = new HttpParams()
      .set('_page', page)
      .set('_limit', limit);
    if (genre) {
      params = params.set('genre', genre);
    }
    if (platform) {
      params = params.set('platform', platform);
    }
    if (title) {
      params = params.set('title_like', title);
    }
    if (minPrice) {
      params = params.set('price_gte', minPrice);
    }
    if (maxPrice) {
      params = params.set('price_lte', maxPrice);
    }
    return this.http.get<Game[]>(this.apiUrl, {
      params,
      observe: 'response',
    });
  }
}
