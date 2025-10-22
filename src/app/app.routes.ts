import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Captcha } from './components/captcha/captcha';
import { Result } from './components/result/result';
import { inject } from '@angular/core';
import { StateService } from './services/state';

// Guard function to prevent direct access to results without completing challenges
const resultGuard = () => {
  const stateService = inject(StateService);
  const progress = stateService.getCurrentProgress();
  
  // Check if all challenges are completed (assuming 3 challenges total)
  // This should be dynamically determined based on actual challenge count
  return progress.completedChallenges.length >= 3;
};

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'captcha', component: Captcha },
  { 
    path: 'result', 
    component: Result,
    canActivate: [resultGuard]
  },
  { path: '**', redirectTo: '/home' } // Wildcard route for 404 pages
];
