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

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  
  private challengeSets: Challenge[][] = [
    this.generateChallengeSet1(),
    this.generateChallengeSet2(),
    this.generateChallengeSet3()
  ];

  constructor() { }

  public getChallenges(): Observable<Challenge[]> {
    // Randomly select a challenge set for each session
    const randomIndex = Math.floor(Math.random() * this.challengeSets.length);
    return of(this.challengeSets[randomIndex]);
  }

  public validateAnswer(challenge: Challenge, userAnswer: any): boolean {
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

  private generateChallengeSet1(): Challenge[] {
    return [
      {
        id: 'img-1',
        type: ChallengeType.IMAGE_SELECTION,
        title: 'Select all images with darts',
        description: 'Click on all squares that contain darts',
        data: {
          images: this.generateImageGrid('darts', 9),
          target: 'darts',
          gridSize: 3
        } as ImageSelectionData,
        answer: null,
        completed: false
      },
      {
        id: 'math-1',
        type: ChallengeType.MATH_PROBLEM,
        title: 'Solve this math problem',
        description: 'Enter the correct answer',
        data: {
          question: '15 + 7 × 3 = ?',
          answer: 36
        } as MathProblemData,
        answer: null,
        completed: false
      },
      {
        id: 'text-1',
        type: ChallengeType.TEXT_INPUT,
        title: 'Type the text you see',
        description: 'Enter the text exactly as shown',
        data: {
          prompt: 'HUMAN2025',
          expectedText: 'HUMAN2025',
          caseSensitive: true
        } as TextInputData,
        answer: null,
        completed: false
      }
    ];
  }

  private generateChallengeSet2(): Challenge[] {
    return [
      {
        id: 'img-2',
        type: ChallengeType.IMAGE_SELECTION,
        title: 'Select all images with targets',
        description: 'Click on all squares that contain targets',
        data: {
          images: this.generateImageGrid('targets', 9),
          target: 'targets',
          gridSize: 3
        } as ImageSelectionData,
        answer: null,
        completed: false
      },
      {
        id: 'math-2',
        type: ChallengeType.MATH_PROBLEM,
        title: 'Solve this math problem',
        description: 'Enter the correct answer',
        data: {
          question: '24 ÷ 4 + 8 = ?',
          answer: 14
        } as MathProblemData,
        answer: null,
        completed: false
      },
      {
        id: 'text-2',
        type: ChallengeType.TEXT_INPUT,
        title: 'Type the text you see',
        description: 'Enter the text exactly as shown',
        data: {
          prompt: 'VERIFY123',
          expectedText: 'VERIFY123',
          caseSensitive: true
        } as TextInputData,
        answer: null,
        completed: false
      }
    ];
  }

  private generateChallengeSet3(): Challenge[] {
    return [
      {
        id: 'img-3',
        type: ChallengeType.IMAGE_SELECTION,
        title: 'Select all images with discs',
        description: 'Click on all squares that contain discs',
        data: {
          images: this.generateImageGrid('discs', 9),
          target: 'discs',
          gridSize: 3
        } as ImageSelectionData,
        answer: null,
        completed: false
      },
      {
        id: 'math-3',
        type: ChallengeType.MATH_PROBLEM,
        title: 'Solve this math problem',
        description: 'Enter the correct answer',
        data: {
          question: '12 × 3 - 9 = ?',
          answer: 27
        } as MathProblemData,
        answer: null,
        completed: false
      },
      {
        id: 'text-3',
        type: ChallengeType.TEXT_INPUT,
        title: 'Type the text you see',
        description: 'Enter the text exactly as shown',
        data: {
          prompt: 'SECURE456',
          expectedText: 'SECURE456',
          caseSensitive: true
        } as TextInputData,
        answer: null,
        completed: false
      }
    ];
  }

  private generateImageGrid(target: string, count: number): ImageItem[] {
    const images: ImageItem[] = [];
    const targetCount = Math.floor(Math.random() * 3) + 2; // 2-4 target images
    
    for (let i = 0; i < count; i++) {
      const isTarget = i < targetCount;
      images.push({
        id: `img-${i}`,
        url: `assets/images/${isTarget ? target : 'other'}/image-${i}.jpg`,
        alt: `Image ${i + 1}`, // Generic alt text that doesn't give away the answer
        isTarget: isTarget
      });
    }
    
    // Shuffle the array to randomize positions
    return this.shuffleArray(images);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
