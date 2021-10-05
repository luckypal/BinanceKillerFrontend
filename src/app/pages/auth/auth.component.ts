import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  secretKey = '';

  constructor(
    private router: Router,
    private readonly apiService: ApiService,
    private readonly storageService: LocalStorageService
  ) { }

  async ngOnInit() {
    const secretKey = this.storageService.getSecretKey();
    const result = await this.apiService.auth(secretKey);
    if (!result) return;

    this.router.navigate(['/train']);
  }

  async onStart() {
    const result = await this.apiService.auth(this.secretKey);
    if (result) {
      this.storageService.saveSecretKey(this.secretKey);
      this.router.navigate(['/train']);
    } else {
      this.secretKey = '';
    }
  }
}
