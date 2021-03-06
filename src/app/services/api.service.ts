import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from '../message/hero';
import { LogService } from '../message/log.service';
import { entries } from './app';


@Injectable({ providedIn: 'root' })
export class ApiService {

  private heroesUrl = 'http://localhost:8000/api';  // URL to web api

  token = 'OGM3OTFlOTRkYjczZWUwYzdkMzI2M2Y4NjZkNzE1ZWMwYjQ4ZTBlZWE1MGY2ZTE4MmZlYjAyZTFhZjkyYzkxMQ'
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':`Bearer ${this.token}` })
  };

  constructor(
    private http: HttpClient,
    private messageService: LogService
    ) { }

  /** GET heroes from the server */
  getHeroes(): any {
    return this.http.get(`${this.heroesUrl}/entries.json`,this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getEntry(id: number): Observable<entries> {
    const url = `${this.heroesUrl}/entries/${id}`;
    return this.http.get<entries>(url,this.httpOptions).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<entries>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}