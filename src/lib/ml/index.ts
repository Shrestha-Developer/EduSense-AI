/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentData {
  id: string;
  prior_gpa: number;
  attendance_pct: number;
  quiz_avg: number;
  assignment_avg: number;
  midterm_score: number;
  study_hours_per_week: number;
  lms_activity: number;
  submission_consistency: number;
  demographic_group: 'A' | 'B' | 'C';
  target: 0 | 1; // 1 = Pass, 0 = Fail
}

export type FeatureKey = keyof Omit<StudentData, 'id' | 'target' | 'demographic_group'>;

export class DecisionTree {
  private root: TreeNode | null = null;
  private maxDepth: number;

  constructor(maxDepth: number = 5) {
    this.maxDepth = maxDepth;
  }

  train(data: StudentData[]) {
    this.root = this.buildTree(data, 0);
  }

  predict(student: StudentData): number {
    if (!this.root) return 0.5;
    return this.walk(this.root, student);
  }

  private walk(node: TreeNode, student: StudentData): number {
    if (node.isLeaf) return node.value!;
    
    const val = student[node.feature as FeatureKey];
    if (val <= node.threshold!) {
      return this.walk(node.left!, student);
    } else {
      return this.walk(node.right!, student);
    }
  }

  private buildTree(data: StudentData[], depth: number): TreeNode {
    const labels = data.map(d => d.target);
    const passCount = labels.filter(l => l === 1).length;
    const failCount = labels.length - passCount;

    // Base cases
    if (depth >= this.maxDepth || passCount === data.length || failCount === data.length || data.length < 5) {
      return { isLeaf: true, value: passCount / data.length };
    }

    const { feature, threshold, gain } = this.findBestSplit(data);

    if (gain <= 0) {
      return { isLeaf: true, value: passCount / data.length };
    }

    const leftData = data.filter(d => d[feature as FeatureKey] <= threshold);
    const rightData = data.filter(d => d[feature as FeatureKey] > threshold);

    return {
      isLeaf: false,
      feature,
      threshold,
      left: this.buildTree(leftData, depth + 1),
      right: this.buildTree(rightData, depth + 1)
    };
  }

  private findBestSplit(data: StudentData[]) {
    let bestGain = -1;
    let bestSplit = { feature: '', threshold: 0, gain: 0 };
    const features: FeatureKey[] = [
      'prior_gpa', 'attendance_pct', 'quiz_avg', 'assignment_avg', 
      'midterm_score', 'study_hours_per_week', 'lms_activity', 'submission_consistency'
    ];

    const currentEntropy = this.entropy(data.map(d => d.target));

    for (const f of features) {
      const values = data.map(d => d[f]).sort((a, b) => a - b);
      const uniqueValues = Array.from(new Set(values));
      
      // Sample thresholds to speed up
      const sampleThresholds = uniqueValues.length > 10 
        ? Array.from({length: 10}, (_, i) => uniqueValues[Math.floor(i * uniqueValues.length / 10)])
        : uniqueValues;

      for (const t of sampleThresholds) {
        const left = data.filter(d => d[f] <= t).map(d => d.target);
        const right = data.filter(d => d[f] > t).map(d => d.target);

        if (left.length === 0 || right.length === 0) continue;

        const gain = currentEntropy - (
          (left.length / data.length) * this.entropy(left) +
          (right.length / data.length) * this.entropy(right)
        );

        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { feature: f, threshold: t, gain };
        }
      }
    }

    return bestSplit;
  }

  private entropy(labels: number[]): number {
    const p1 = labels.filter(l => l === 1).length / labels.length;
    const p0 = 1 - p1;
    if (p1 === 0 || p0 === 0) return 0;
    return -p1 * Math.log2(p1) - p0 * Math.log2(p0);
  }

  getFeatureImportance(data: StudentData[]): Record<string, number> {
    const importance: Record<string, number> = {};
    const features: FeatureKey[] = [
      'prior_gpa', 'attendance_pct', 'quiz_avg', 'assignment_avg', 
      'midterm_score', 'study_hours_per_week', 'lms_activity', 'submission_consistency'
    ];
    features.forEach(f => importance[f] = 0);

    const traverse = (node: TreeNode, weight: number) => {
      if (node.isLeaf || !node.feature) return;
      importance[node.feature] += weight;
      traverse(node.left!, weight / 2);
      traverse(node.right!, weight / 2);
    };

    if (this.root) traverse(this.root, 1);
    return importance;
  }
}

interface TreeNode {
  isLeaf: boolean;
  value?: number;
  feature?: string;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

export class RandomForest {
  private trees: DecisionTree[] = [];
  private numTrees: number;

  constructor(numTrees: number = 10, maxDepth: number = 5) {
    this.numTrees = numTrees;
    for (let i = 0; i < numTrees; i++) {
      this.trees.push(new DecisionTree(maxDepth));
    }
  }

  train(data: StudentData[]) {
    for (const tree of this.trees) {
      // Bootstrap sampling
      const sample = Array.from({ length: data.length }, () => data[Math.floor(Math.random() * data.length)]);
      tree.train(sample);
    }
  }

  predict(student: StudentData): number {
    const predictions = this.trees.map(t => t.predict(student));
    return predictions.reduce((a, b) => a + b, 0) / this.numTrees;
  }

  getFeatureImportance(data: StudentData[]): Record<string, number> {
    const totalImportance: Record<string, number> = {};
    for (const tree of this.trees) {
      const imp = tree.getFeatureImportance(data);
      for (const f in imp) {
        totalImportance[f] = (totalImportance[f] || 0) + imp[f];
      }
    }
    const n = Object.keys(totalImportance).length;
    for (const f in totalImportance) {
      totalImportance[f] /= this.numTrees;
    }
    return totalImportance;
  }
}