import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../services/data.service';
import { ApiService } from '../services/api.service';
import { Hero } from './hero';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  constructor(
   private messageService:ApiService
  ) { }

  ngOnInit() {
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
