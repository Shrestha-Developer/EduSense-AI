/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentData } from '../ml';

export function generateSyntheticData(count: number = 200): StudentData[] {
  const data: StudentData[] = [];

  for (let i = 0; i < count; i++) {
    // Hidden latent variables
    const type = Math.random(); // 0-0.2 weak, 0.2-0.8 average, 0.8-1.0 top
    let prior_gpa, attendance_pct, study_hours_per_week, quiz_avg, midterm_score;

    if (type < 0.2) {
      // Weak patterns
      prior_gpa = 2.0 + Math.random() * 1.0;
      attendance_pct = 40 + Math.random() * 40;
      study_hours_per_week = 2 + Math.random() * 8;
      quiz_avg = 30 + Math.random() * 40;
      midterm_score = 30 + Math.random() * 40;
    } else if (type < 0.8) {
      // Average patterns
      prior_gpa = 2.8 + Math.random() * 0.8;
      attendance_pct = 75 + Math.random() * 20;
      study_hours_per_week = 10 + Math.random() * 10;
      quiz_avg = 65 + Math.random() * 20;
      midterm_score = 60 + Math.random() * 25;
    } else {
      // Top performers
      prior_gpa = 3.5 + Math.random() * 0.5;
      attendance_pct = 90 + Math.random() * 10;
      study_hours_per_week = 20 + Math.random() * 15;
      quiz_avg = 85 + Math.random() * 15;
      midterm_score = 85 + Math.random() * 15;
    }

    const assignment_avg = (quiz_avg + midterm_score) / 2 + (Math.random() - 0.5) * 10;
    const lms_activity = (attendance_pct / 10) + Math.random() * 5;
    const submission_consistency = (attendance_pct / 100) * (0.7 + Math.random() * 0.3);

    // Calculate pass/fail using a logistic-like function for realistic noise
    // We normalize features to a 0-100 scale roughly
    const score = (
      ((prior_gpa / 4) * 30) + 
      (attendance_pct * 0.3) + 
      (quiz_avg * 0.25) + 
      ((study_hours_per_week / 35) * 15)
    );

    // Threshold around 60 for passing
    const prob = 1 / (1 + Math.exp(-(score - 62) * 0.4)); 
    const target = Math.random() < prob ? 1 : 0;

    data.push({
      id: `STU-${1000 + i}`,
      prior_gpa: Number(prior_gpa.toFixed(2)),
      attendance_pct: Number(attendance_pct.toFixed(1)),
      quiz_avg: Number(quiz_avg.toFixed(1)),
      assignment_avg: Number(assignment_avg.toFixed(1)),
      midterm_score: Number(midterm_score.toFixed(1)),
      study_hours_per_week: Number(study_hours_per_week.toFixed(1)),
      lms_activity: Number(lms_activity.toFixed(1)),
      submission_consistency: Number(submission_consistency.toFixed(2)),
      demographic_group: (['A', 'B', 'C'][Math.floor(Math.random() * 3)]) as 'A' | 'B' | 'C',
      target: target as 0 | 1
    });
  }

  return data;
}