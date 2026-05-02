/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RandomForest, StudentData, FeatureKey } from '../lib/ml';
import { generateSyntheticData } from '../lib/data/gen';

export type RiskLevel = 'High Risk' | 'Medium Risk' | 'Low Risk';

export interface PredictionResult {
  studentId: string;
  probability: number;
  prediction: 'Pass' | 'Fail';
  riskLevel: RiskLevel;
  shaps: Record<string, number>;
  interventions: string[];
}

export class PredictionService {
  private model: RandomForest;
  private trainingData: StudentData[];

  constructor() {
    this.model = new RandomForest(20, 7);
    this.trainingData = generateSyntheticData(800);
    this.model.train(this.trainingData);
  }

  getTrainingData() {
    return this.trainingData;
  }

  predict(student: StudentData): PredictionResult {
    const prob = this.model.predict(student);
    const prediction = prob > 0.5 ? 'Pass' : 'Fail';
    
    let riskLevel: RiskLevel = 'Low Risk';
    if (prob < 0.3) riskLevel = 'High Risk';
    else if (prob < 0.6) riskLevel = 'Medium Risk';

    // Simplified SHAP / Feature impact calculation
    // We compare student features against training averages
    const shaps: Record<string, number> = {};
    const features: FeatureKey[] = [
      'prior_gpa', 'attendance_pct', 'quiz_avg', 'assignment_avg', 
      'midterm_score', 'study_hours_per_week', 'lms_activity', 'submission_consistency'
    ];

    const averages = this.getAverages();
    
    features.forEach(f => {
      const diff = student[f] - averages[f];
      // Weighted impact based on differences (mocking SHAP)
      shaps[f] = diff / (averages[f] || 1);
    });

    const interventions = this.getInterventions(student, shaps);

    return {
      studentId: student.id,
      probability: Number(prob.toFixed(3)),
      prediction,
      riskLevel,
      shaps,
      interventions
    };
  }

  private getAverages(): Record<string, number> {
    const sum: Record<string, number> = {};
    const features: FeatureKey[] = [
      'prior_gpa', 'attendance_pct', 'quiz_avg', 'assignment_avg', 
      'midterm_score', 'study_hours_per_week', 'lms_activity', 'submission_consistency'
    ];
    features.forEach(f => sum[f] = 0);

    this.trainingData.forEach(d => {
      features.forEach(f => sum[f] += d[f]);
    });

    const avgs: Record<string, number> = {};
    features.forEach(f => avgs[f] = sum[f] / this.trainingData.length);
    return avgs;
  }

  private getInterventions(student: StudentData, shaps: Record<string, number>): string[] {
    const suggestions: string[] = [];

    if (student.attendance_pct < 75) {
      suggestions.push("Low Attendance: Recommend mandatory mentorship sessions and counseling.");
    }
    if (student.quiz_avg < 60) {
      suggestions.push("Low Quiz Scores: Suggest remedial practice tests and peer tutoring.");
    }
    if (student.study_hours_per_week < 10) {
      suggestions.push("Low Study Hours: Propose time-management workshop and structured study halls.");
    }
    if (student.submission_consistency < 0.6) {
      suggestions.push("Inconsistent Submissions: Assign a student success coach for accountability.");
    }
    if (student.lms_activity < 5) {
      suggestions.push("Low LMS Engagement: Encourage digital learning resources and platform walkthroughs.");
    }

    if (suggestions.length === 0) {
      suggestions.push("Keep up the good work! Maintain current study habits.");
    }

    return suggestions;
  }

  getFeatureImportance() {
    return this.model.getFeatureImportance(this.trainingData);
  }
}

export const predictionService = new PredictionService();