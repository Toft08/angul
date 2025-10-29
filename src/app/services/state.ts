import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProgress, ChallengeResult } from '../models/challenge.model';
import { STORAGE_KEYS } from '../constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private progressSubject = new BehaviorSubject<UserProgress>(this.getInitialProgress());
  public progress$ = this.progressSubject.asObservable();

  private resultsSubject = new BehaviorSubject<ChallengeResult[]>([]);
  public results$ = this.resultsSubject.asObservable();

  constructor() {
    this.loadProgressFromStorage();
  }

  private getInitialProgress(): UserProgress {
    return {
      currentChallengeIndex: 0,
      completedChallenges: [],
      startTime: new Date(),
      score: 0,
      totalAttempts: 0,
      sessionId: this.generateSessionId()
    };
  }

  private generateSessionId(): string {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  public getCurrentProgress(): UserProgress {
    return this.progressSubject.value;
  }

  public updateProgress(progress: Partial<UserProgress>): void {
    const currentProgress = this.progressSubject.value;
    const updatedProgress = { ...currentProgress, ...progress };
    this.progressSubject.next(updatedProgress);
    this.saveProgressToStorage(updatedProgress);
  }

  public addChallengeResult(result: ChallengeResult): void {
    const currentResults = this.resultsSubject.value;
    const updatedResults = [...currentResults, result];
    this.resultsSubject.next(updatedResults);

    // Update progress
    const progress = this.getCurrentProgress();
    const updatedProgress: Partial<UserProgress> = {
      totalAttempts: progress.totalAttempts + 1
    };

    // Only add to completed challenges if this is the first time completing this challenge
    if (result.isCorrect && !progress.completedChallenges.includes(result.challengeId)) {
      updatedProgress.completedChallenges = [...progress.completedChallenges, result.challengeId];
      updatedProgress.score = progress.score + 1;
    }

    this.updateProgress(updatedProgress);
  }

  public getChallengeAttempts(challengeId: string): ChallengeResult[] {
    return this.resultsSubject.value.filter(result => result.challengeId === challengeId);
  }

  public getSuccessfulResults(): ChallengeResult[] {
    const allResults = this.resultsSubject.value;
    const completedChallenges = this.getCurrentProgress().completedChallenges;

    // Return only the first successful attempt for each completed challenge
    return completedChallenges.map(challengeId => {
      return allResults.find(result =>
        result.challengeId === challengeId && result.isCorrect
      );
    }).filter(result => result !== undefined) as ChallengeResult[];
  }

  public getAllAttempts(): ChallengeResult[] {
    return this.resultsSubject.value;
  }

  public isAllChallengesCompleted(totalChallenges: number): boolean {
    return this.getCurrentProgress().completedChallenges.length >= totalChallenges;
  }

  public resetProgress(): void {
    const initialProgress = this.getInitialProgress();
    this.progressSubject.next(initialProgress);
    this.resultsSubject.next([]);
    this.saveProgressToStorage(initialProgress);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
  }

  private saveProgressToStorage(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(this.resultsSubject.value));
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error);
    }
  }

  private loadProgressFromStorage(): void {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const savedResults = localStorage.getItem(STORAGE_KEYS.RESULTS);

      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        progress.startTime = new Date(progress.startTime);
        if (progress.endTime) {
          progress.endTime = new Date(progress.endTime);
        }
        this.progressSubject.next(progress);
      }

      if (savedResults) {
        this.resultsSubject.next(JSON.parse(savedResults));
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error);
    }
  }
}
