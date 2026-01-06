
import { RelationshipCategory, Question } from './types.ts';

export const WEIGHTS = {
  [RelationshipCategory.ROMANTIC]: {
    communication: 0.25,
    trust: 0.25,
    emotional_safety: 0.20,
    effort: 0.15,
    conflict_handling: 0.10,
    future_alignment: 0.05
  },
  [RelationshipCategory.FRIEND]: {
    communication: 0.25,
    trust: 0.30,
    emotional_safety: 0.20,
    respect: 0.15,
    conflict_handling: 0.10
  },
  [RelationshipCategory.FAMILY]: {
    respect: 0.30,
    communication: 0.20,
    emotional_safety: 0.20,
    support: 0.20,
    conflict_handling: 0.10
  }
};

export const QUESTIONS: Record<RelationshipCategory, Question[]> = {
  [RelationshipCategory.ROMANTIC]: [
    { id: 'r1', text: 'We communicate openly about our needs and desires.', category: 'communication', weight: 1 },
    { id: 'r2', text: 'I feel I can share my vulnerabilities without judgment.', category: 'emotional_safety', weight: 1 },
    { id: 'r3', text: 'There is consistent honesty between us.', category: 'trust', weight: 1 },
    { id: 'r4', text: 'Both of us put in equal effort to sustain the relationship.', category: 'effort', weight: 1 },
    { id: 'r5', text: 'We resolve disagreements constructively rather than placing blame.', category: 'conflict_handling', weight: 1 },
    { id: 'r6', text: 'Our long-term goals and values are largely compatible.', category: 'future_alignment', weight: 1 },
    { id: 'r7', text: 'I feel safe being my true self around them.', category: 'emotional_safety', weight: 1 },
    { id: 'r8', text: 'They respect my personal boundaries consistently.', category: 'trust', weight: 1 }
  ],
  [RelationshipCategory.FRIEND]: [
    { id: 'f1', text: 'I can rely on them when I am in a difficult situation.', category: 'trust', weight: 1 },
    { id: 'f2', text: 'Our conversations are meaningful and balanced.', category: 'communication', weight: 1 },
    { id: 'f3', text: 'They show respect for my time and commitments.', category: 'respect', weight: 1 },
    { id: 'f4', text: 'I feel emotionally secure and supported in this friendship.', category: 'emotional_safety', weight: 1 },
    { id: 'f5', text: 'We handle disagreements with maturity and understanding.', category: 'conflict_handling', weight: 1 },
    { id: 'f6', text: 'They celebrate my successes without envy.', category: 'respect', weight: 1 },
    { id: 'f7', text: 'I trust them with my private thoughts.', category: 'trust', weight: 1 }
  ],
  [RelationshipCategory.FAMILY]: [
    { id: 'fa1', text: 'There is a baseline of mutual respect in our interactions.', category: 'respect', weight: 1 },
    { id: 'fa2', text: 'I can talk to them about family matters without fear of retaliation.', category: 'communication', weight: 1 },
    { id: 'fa3', text: 'They provide emotional or practical support when needed.', category: 'support', weight: 1 },
    { id: 'fa4', text: 'I feel emotionally safe within the family dynamic.', category: 'emotional_safety', weight: 1 },
    { id: 'fa5', text: 'Conflicts are managed with a goal of resolution, not control.', category: 'conflict_handling', weight: 1 },
    { id: 'fa6', text: 'My individual identity is respected by them.', category: 'respect', weight: 1 },
    { id: 'fa7', text: 'We have clear and healthy boundaries.', category: 'support', weight: 1 }
  ]
};

export const SCORE_LABELS = [
  { range: [80, 100], label: "Strong and Healthy", color: "text-emerald-600" },
  { range: [60, 79], label: "Fair but Needs Work", color: "text-teal-600" },
  { range: [40, 59], label: "Strained", color: "text-amber-600" },
  { range: [0, 39], label: "Unhealthy", color: "text-rose-600" }
];
