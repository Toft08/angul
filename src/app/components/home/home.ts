import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  constructor(
    private router: Router,
    private stateService: StateService
  ) { }

  public startChallenge(): void {
    // Reset any previous progress
    this.stateService.resetProgress();
    
    // Navigate to the first challenge
    this.router.navigate(['/captcha']);
  }
}
