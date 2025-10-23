import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { Home } from './components/home/home';
import { Captcha } from './components/captcha/captcha';
import { Result } from './components/result/result';
import { inject } from '@angular/core';
import { StateService } from './services/state';

const resultGuard = () => {
  const router = inject(Router);
  const stateService = inject(StateService);
  const progress = stateService.getCurrentProgress();
  
  // Check if all challenges are completed (assuming 3 challenges total)
  // This should be dynamically determined based on actual challenge count
  if (progress.completedChallenges.length !== 3) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};

const captchaGuard = () => {
  const router = inject(Router);
  const stateService = inject(StateService);
  const progress = stateService.getCurrentProgress();
  
  // If user has completed more than 3 challenges (shouldn't happen in normal flow), redirect to home
  if (progress.completedChallenges.length > 2) {
    router.navigate(['/home']);
    return false;
  }
  
  return true; // Allow access if challenges not exceeded
};

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'captcha', component: Captcha, canActivate: [captchaGuard] },
  { path: 'result', component: Result, canActivate: [resultGuard]},
  { path: '**', redirectTo: '/home' } // Wildcard route for 404 pages
];
