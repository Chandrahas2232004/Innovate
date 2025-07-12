// This is a simplified ML predictor using basic linear regression
// In a real-world scenario, you would use a more sophisticated model
// and train it with actual data

// Dummy weights for our simple linear regression model
const weights = {
  agriculture: 0.8,
  education: 0.75,
  healthcare: 0.85,
  technology: 0.9,
  infrastructure: 0.7,
  other: 0.6,
  fundingFactor: 0.0001, // Weight for required funding
  planFactor: 0.15, // Weight for having an implementation plan
  impactFactor: 0.2, // Weight for having expected impact
  targetAudienceFactor: 0.1 // Weight for having a defined target audience
};

export const predictSuccessRate = async (idea) => {
  let successRate = 0;

  // Categorize the idea based on its category
  successRate += weights[idea.category] || weights.other;

  // Consider the required funding
  successRate -= idea.requiredFunding * weights.fundingFactor;

  // Consider the presence of an implementation plan
  successRate += idea.implementationPlan ? weights.planFactor : 0;

  // Consider the expected impact
  successRate += idea.expectedImpact ? weights.impactFactor : 0;
  
  // Consider the target audience
  successRate += idea.targetAudience ? weights.targetAudienceFactor : 0;

  // Ensure the success rate is within [0, 1]
  successRate = Math.min(Math.max(successRate, 0), 1);

  return successRate;
};

export const getSuccessRateExplanation = (idea) => {
  const factors = [];
  
  // Category factor
  const categoryWeight = weights[idea.category] || weights.other;
  factors.push({
    factor: 'Category',
    impact: 'positive',
    weight: categoryWeight,
    explanation: `Projects in ${idea.category} category have a base success rate of ${Math.round(categoryWeight * 100)}%`
  });
  
  // Funding factor
  const fundingImpact = idea.requiredFunding * weights.fundingFactor;
  factors.push({
    factor: 'Required Funding',
    impact: 'negative',
    weight: fundingImpact,
    explanation: `Higher funding requirement (${idea.requiredFunding}) reduces success rate by ${Math.round(fundingImpact * 100)}%`
  });
  
  // Implementation plan factor
  if (idea.implementationPlan) {
    factors.push({
      factor: 'Implementation Plan',
      impact: 'positive',
      weight: weights.planFactor,
      explanation: `Having an implementation plan increases success rate by ${Math.round(weights.planFactor * 100)}%`
    });
  }
  
  // Expected impact factor
  if (idea.expectedImpact) {
    factors.push({
      factor: 'Expected Impact',
      impact: 'positive',
      weight: weights.impactFactor,
      explanation: `Defining expected impact increases success rate by ${Math.round(weights.impactFactor * 100)}%`
    });
  }
  
  // Target audience factor
  if (idea.targetAudience) {
    factors.push({
      factor: 'Target Audience',
      impact: 'positive',
      weight: weights.targetAudienceFactor,
      explanation: `Defining target audience increases success rate by ${Math.round(weights.targetAudienceFactor * 100)}%`
    });
  }
  
  return factors;
};

// module.exports = { predictSuccessRate, getSuccessRateExplanation };
// It's already exported using the export statements above



