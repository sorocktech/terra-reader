import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../services/data.service';
import { MessageService } from './message.service';
import { Hero } from './hero';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  heroes: Hero[] = [];
  constructor(
   private messageService:MessageService
  ) { }

  ngOnInit() {
    this.getHeroes()
  }

  getHeroes(): void {
    this.messageService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }
  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
