import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Challenge,
  ChallengeType,
  ImageSelectionData,
  MathProblemData,
  TextInputData,
  ImageItem
} from '../models/challenge.model';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { IMAGE_CATEGORIES, ImageCategory, getImagesForCategory, getCategoryFromFilename } from '../constants/image.constants';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  constructor() { }

  public getChallenges(): Observable<Challenge[]> {
    // Try to load existing challenges from storage first
    const existingChallenges = this.loadChallengesFromStorage();
    if (existingChallenges && existingChallenges.length > 0) {
      return of(existingChallenges);
    }

    // Generate new challenges if none exist
    const newChallenges = this.generateRandomChallengeSet();
    this.saveChallengiesToStorage(newChallenges);
    return of(newChallenges);
  }

  public resetChallengeSet(): void {
    // Clear stored challenges to generate fresh ones next time
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
  } public validateAnswer(challenge: Challenge, userAnswer: any): boolean {
    switch (challenge.type) {
      case ChallengeType.IMAGE_SELECTION:
        return this.validateImageSelection(challenge, userAnswer);
      case ChallengeType.MATH_PROBLEM:
        return this.validateMathProblem(challenge, userAnswer);
      case ChallengeType.TEXT_INPUT:
        return this.validateTextInput(challenge, userAnswer);
      default:
        return false;
    }
  }

  private validateImageSelection(challenge: Challenge, selectedIds: string[]): boolean {
    const data = challenge.data as ImageSelectionData;
    const correctIds = data.images.filter(img => img.isTarget).map(img => img.id);

    if (selectedIds.length !== correctIds.length) return false;

    return correctIds.every(id => selectedIds.includes(id)) &&
      selectedIds.every(id => correctIds.includes(id));
  }

  private validateMathProblem(challenge: Challenge, answer: number): boolean {
    const data = challenge.data as MathProblemData;
    return data.answer === answer;
  }

  private validateTextInput(challenge: Challenge, text: string): boolean {
    const data = challenge.data as TextInputData;
    return data.caseSensitive ?
      data.expectedText === text :
      data.expectedText.toLowerCase() === text.toLowerCase();
  }

  private generateRandomChallengeSet(): Challenge[] {
    return [
      this.generateImageChallenge(),
      this.generateRandomMathChallenge(),
      this.generateRandomTextChallenge()
    ];
  }

  private generateImageChallenge(): Challenge {
    const targets = Object.keys(IMAGE_CATEGORIES) as ImageCategory[];
    const target = targets[Math.floor(Math.random() * targets.length)];

    return {
      id: 'img-' + Date.now(),
      type: ChallengeType.IMAGE_SELECTION,
      title: 'Image recognition',
      description: `Click on all squares that contain ${target}`,
      data: {
        images: this.generateImageGrid(target, 9),
        target: target,
        gridSize: 3
      } as ImageSelectionData,
      answer: null,
      completed: false
    };
  }

  private generateRandomMathChallenge(): Challenge {
    const operations = [
      () => this.generateAddition(),
      () => this.generateSubtraction(),
      () => this.generateMultiplication(),
      () => this.generateOrderOfOperations()
    ];

    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const mathData = randomOp();

    return {
      id: 'math-' + Date.now(),
      type: ChallengeType.MATH_PROBLEM,
      title: 'Solve this math problem',
      description: 'Enter the correct answer',
      data: mathData,
      answer: null,
      completed: false
    };
  }

  private generateAddition(): MathProblemData {
    const a = Math.floor(Math.random() * 20) + 5; // 5-24
    const b = Math.floor(Math.random() * 20) + 5; // 5-24
    return {
      question: `${a} + ${b} = ?`,
      answer: a + b
    };
  }

  private generateSubtraction(): MathProblemData {
    const a = Math.floor(Math.random() * 30) + 20; // 20-49
    const b = Math.floor(Math.random() * 15) + 5; // 5-19
    return {
      question: `${a} - ${b} = ?`,
      answer: a - b
    };
  }

  private generateMultiplication(): MathProblemData {
    const a = Math.floor(Math.random() * 9) + 2; // 2-10
    const b = Math.floor(Math.random() * 9) + 2; // 2-10
    return {
      question: `${a} × ${b} = ?`,
      answer: a * b
    };
  }

  private generateOrderOfOperations(): MathProblemData {
    const a = Math.floor(Math.random() * 10) + 5; // 5-14
    const b = Math.floor(Math.random() * 5) + 2; // 2-6
    const c = Math.floor(Math.random() * 8) + 2; // 2-9
    const answer = a + (b * c); // Addition and multiplication
    return {
      question: `${a} + ${b} × ${c} = ?`,
      answer: answer
    };
  }

  private generateRandomTextChallenge(): Challenge {
    const words = ['HUMAN', 'VERIFY', 'SECURE', 'CAPTCHA', 'VALID', 'CHECK', 'PROOF', 'REAL'];
    const numbers = Math.floor(Math.random() * 900) + 100; // 100-999
    const word = words[Math.floor(Math.random() * words.length)];
    const text = word + numbers;

    return {
      id: 'text-' + Date.now(),
      type: ChallengeType.TEXT_INPUT,
      title: 'Type the text you see',
      description: 'Enter the text exactly as shown',
      data: {
        prompt: text,
        expectedText: text,
        caseSensitive: true
      } as TextInputData,
      answer: null,
      completed: false
    };
  }

  private generateImageGrid(target: string, count: number): ImageItem[] {
    const images: ImageItem[] = [];
    const targetCount = Math.floor(Math.random() * 3) + 2; // 2-4 target images

    const targetImages = this.getImagesForCategory(target);

    const otherCategories = Object.keys(IMAGE_CATEGORIES).filter(cat => cat !== target);
    const distractorImages = otherCategories.flatMap(cat => this.getImagesForCategory(cat));

    // Add target images
    for (let i = 0; i < targetCount && i < targetImages.length; i++) {
      images.push({
        id: `img-${i}`,
        url: `assets/images/${target}/${targetImages[i]}`,
        alt: `Image ${i + 1}`, // Generic alt text that doesn't give away the answer
        isTarget: true
      });
    }

    // Fill remaining slots with distractor images
    for (let i = targetCount; i < count; i++) {
      const randomDistractor = distractorImages[Math.floor(Math.random() * distractorImages.length)];
      const category = this.getCategoryFromImage(randomDistractor);
      images.push({
        id: `img-${i}`,
        url: `assets/images/${category}/${randomDistractor}`,
        alt: `Image ${i + 1}`,
        isTarget: false
      });
    }

    return this.shuffleArray(images);
  }

  private getImagesForCategory(category: string): string[] {
    return getImagesForCategory(category as ImageCategory);
  }

  private getCategoryFromImage(imageName: string): string {
    const result = getCategoryFromFilename(imageName);
    return result === 'unknown' ? 'other' : result;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private loadChallengesFromStorage(): Challenge[] | null {
    try {
      const savedChallenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (savedChallenges) {
        return JSON.parse(savedChallenges) as Challenge[];
      }
    } catch (error) {
      console.warn('Failed to load challenges from localStorage:', error);
    }
    return null;
  }

  private saveChallengiesToStorage(challenges: Challenge[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (error) {
      console.warn('Failed to save challenges to localStorage:', error);
    }
  }
}
