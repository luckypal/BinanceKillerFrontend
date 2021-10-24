import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'binkiller-frontend';

  constructor(private notificationService: NotificationService) {
    this.notificationService.requestPermission();
  }
}
