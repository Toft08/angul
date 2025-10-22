import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';
import { UserProgress, ChallengeResult } from '../../models/challenge.model';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.scss'
})
export class Result implements OnInit {
  public progress: UserProgress | null = null;
  public results: ChallengeResult[] = [];
  public totalTime: number = 0;
  public successRate: number = 0;

  constructor(
    private router: Router,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    this.stateService.progress$.subscribe(progress => {
      this.progress = progress;
      this.calculateTotalTime();
    });

    // Get only the successful results for display
    this.results = this.stateService.getSuccessfulResults();
    this.calculateSuccessRate();
  }

  private calculateTotalTime(): void {
    if (this.progress?.startTime && this.progress?.endTime) {
      this.totalTime = this.progress.endTime.getTime() - this.progress.startTime.getTime();
    }
  }

  private calculateSuccessRate(): void {
    if (!this.progress || this.progress.completedChallenges.length === 0) {
      this.successRate = 0;
      return;
    }

    // Success rate based on completed challenges vs total attempts
    this.successRate = (this.progress.score / this.progress.totalAttempts) * 100;
  }

  public getTotalAttempts(): number {
    return this.progress?.totalAttempts || 0;
  }

  public getCompletedChallenges(): number {
    return this.progress?.completedChallenges.length || 0;
  }

  public getChallengeAttemptCount(challengeId: string): number {
    return this.stateService.getChallengeAttempts(challengeId).length;
  }

  public formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  public getTimeGrade(): string {
    const secondsTotal = this.totalTime / 1000;
    
    if (secondsTotal < 30) return 'Lightning Fast!';
    if (secondsTotal < 60) return 'Quick Thinker';
    if (secondsTotal < 120) return 'Steady Pace';
    return 'Thorough and Careful';
  }

  public getOverallGrade(): string {
    if (this.successRate === 100) return 'Perfect Human!';
    if (this.successRate >= 80) return 'Definitely Human';
    if (this.successRate >= 60) return 'Probably Human';
    return 'Suspicious Activity';
  }

  public getGradeEmoji(): string {
    if (this.successRate === 100) return '🎉';
    if (this.successRate >= 80) return '✅';
    if (this.successRate >= 60) return '👍';
    return '🤖';
  }

  public startNewChallenge(): void {
    this.stateService.resetProgress();
    this.router.navigate(['/home']);
  }

  public goHome(): void {
    this.router.navigate(['/home']);
  }
}
