import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DataService, Message } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  heroes: any = [];
  constructor(
    private data: DataService,
    private messageService:ApiService
    ) {}

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }


  ngOnInit() {
    this.getHeroes()
  }
  getHeroes(): void {
    this.messageService.getHeroes()
    .subscribe(heroes => this.heroes = heroes._embedded.items);
  }
}
