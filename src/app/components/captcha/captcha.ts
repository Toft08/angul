import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { StateService } from '../../services/state';
import { ChallengeService } from '../../services/challenge';
import {
  Challenge,
  ChallengeType,
  UserProgress,
  ChallengeResult,
  ImageSelectionData,
  MathProblemData,
  TextInputData
} from '../../models/challenge.model';

@Component({
  selector: 'app-captcha',
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss'
})
export class Captcha implements OnInit, OnDestroy {
  public challenges: Challenge[] = [];
  public currentChallenge: Challenge | null = null;
  public currentChallengeIndex: number = 0;
  public progress: UserProgress | null = null;

  // Form data
  public selectedImageIds: string[] = [];
  public mathAnswer: number | null = null;
  public textInput: string = '';

  // UI state
  public isLoading: boolean = true;
  public showValidation: boolean = false;
  public validationMessage: string = '';

  // Enum reference for template
  public ChallengeType = ChallengeType;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private stateService: StateService,
    private challengeService: ChallengeService
  ) { }

  public startNewSession(): void {
    this.stateService.resetProgress();
    this.challengeService.resetChallengeSet();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.subscribeToProgress();
    this.loadChallenges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadChallenges(): void {
    this.subscriptions.add(
      this.challengeService.getChallenges().subscribe(challenges => {
        this.challenges = challenges;
        this.loadCurrentChallenge();
        this.isLoading = false;
      })
    );
  }

  private subscribeToProgress(): void {
    this.subscriptions.add(
      this.stateService.progress$.subscribe(progress => {
        this.progress = progress;
        this.currentChallengeIndex = progress.currentChallengeIndex;
        // Load current challenge when progress updates
        if (this.challenges && this.challenges.length > 0) {
          this.loadCurrentChallenge();
        }
      })
    );
  }

  private loadCurrentChallenge(): void {
    if (this.challenges && this.challenges.length > this.currentChallengeIndex) {
      this.currentChallenge = this.challenges[this.currentChallengeIndex];
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.selectedImageIds = [];
    this.mathAnswer = null;
    this.textInput = '';
    this.showValidation = false;
    this.validationMessage = '';
  }

  public onImageSelect(imageId: string): void {
    const index = this.selectedImageIds.indexOf(imageId);
    if (index > -1) {
      this.selectedImageIds.splice(index, 1);
    } else {
      this.selectedImageIds.push(imageId);
    }
  }

  public isImageSelected(imageId: string): boolean {
    return this.selectedImageIds.includes(imageId);
  }

  public isFormValid(): boolean {
    if (!this.currentChallenge) return false;

    switch (this.currentChallenge.type) {
      case ChallengeType.IMAGE_SELECTION:
        return this.selectedImageIds.length > 0;
      case ChallengeType.MATH_PROBLEM:
        return this.mathAnswer !== null && !isNaN(this.mathAnswer);
      case ChallengeType.TEXT_INPUT:
        return this.textInput.trim().length > 0;
      default:
        return false;
    }
  }

  public submitAnswer(): void {
    if (!this.currentChallenge || !this.isFormValid()) {
      this.showValidationMessage('Please complete the challenge before proceeding.');
      return;
    }

    const startTime = Date.now();
    let userAnswer: any;

    switch (this.currentChallenge.type) {
      case ChallengeType.IMAGE_SELECTION:
        userAnswer = [...this.selectedImageIds];
        break;
      case ChallengeType.MATH_PROBLEM:
        userAnswer = this.mathAnswer;
        break;
      case ChallengeType.TEXT_INPUT:
        userAnswer = this.textInput;
        break;
    }

    const isCorrect = this.challengeService.validateAnswer(this.currentChallenge, userAnswer);
    const endTime = Date.now();

    // Get current attempt number for this challenge
    const previousAttempts = this.stateService.getChallengeAttempts(this.currentChallenge.id);
    const attemptNumber = previousAttempts.length + 1;

    const result: ChallengeResult = {
      challengeId: this.currentChallenge.id,
      userAnswer: userAnswer,
      isCorrect: isCorrect,
      timeSpent: endTime - startTime,
      attemptNumber: attemptNumber
    };

    this.stateService.addChallengeResult(result);

    if (isCorrect) {
      this.nextChallenge();
    } else {
      this.showValidationMessage('Incorrect answer. Please try again.');
    }
  }

  private showValidationMessage(message: string): void {
    this.validationMessage = message;
    this.showValidation = true;
    setTimeout(() => {
      this.showValidation = false;
    }, 3000);
  }

  public nextChallenge(): void {
    const nextIndex = this.currentChallengeIndex + 1;

    if (nextIndex >= this.challenges.length) {
      // All challenges completed
      this.stateService.updateProgress({
        endTime: new Date(),
        currentChallengeIndex: nextIndex
      });
      this.router.navigate(['/result']);
    } else {
      // Move to next challenge
      this.stateService.updateProgress({ currentChallengeIndex: nextIndex });
      this.currentChallengeIndex = nextIndex;
      this.loadCurrentChallenge();
    }
  }

  public previousChallenge(): void {
    const prevIndex = this.currentChallengeIndex - 1;
    if (prevIndex >= 0) {
      this.stateService.updateProgress({ currentChallengeIndex: prevIndex });
      this.currentChallengeIndex = prevIndex;
      this.loadCurrentChallenge();
    }
  }

  public canGoPrevious(): boolean {
    return this.currentChallengeIndex > 0;
  }

  public getProgressPercentage(): number {
    if (!this.progress || this.challenges.length === 0) return 0;
    return (this.progress.completedChallenges.length / this.challenges.length) * 100;
  }

  public getImageSelectionData(): ImageSelectionData | null {
    return this.currentChallenge?.type === ChallengeType.IMAGE_SELECTION
      ? this.currentChallenge.data as ImageSelectionData
      : null;
  }

  public getMathProblemData(): MathProblemData | null {
    return this.currentChallenge?.type === ChallengeType.MATH_PROBLEM
      ? this.currentChallenge.data as MathProblemData
      : null;
  }

  public getTextInputData(): TextInputData | null {
    return this.currentChallenge?.type === ChallengeType.TEXT_INPUT
      ? this.currentChallenge.data as TextInputData
      : null;
  }

  public getImageCategory(image: any): string {
    const urlParts = image.url.split('/');
    if (urlParts.length >= 3) {
      return urlParts[urlParts.length - 2];
    }
    return 'other';
  }

  public onImageError(event: any): void {
    console.error('Failed to load image:', event.target.src);
    event.target.src = 'assets/images/placeholder.svg';
  }
}
