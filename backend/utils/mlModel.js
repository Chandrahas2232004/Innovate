// Simple ML model simulation for predicting success rate

// Predict success rate based on idea attributes
export const predictSuccessRate = async (idea) => {
  // This is a placeholder for a real ML model
  // In a real application, you would use a trained model
  
  let score = 0;
  
  // Category weights
  const categoryWeights = {
    'technology': 0.8,
    'healthcare': 0.75,
    'education': 0.7,
    'agriculture': 0.65,
    'infrastructure': 0.7,
    'other': 0.6
  };
  
  // Add category score
  score += categoryWeights[idea.category] || categoryWeights.other;
  
  // Adjust for funding requirements (higher funding = lower success rate)
  const fundingFactor = 0.0001;
  score -= idea.requiredFunding * fundingFactor;
  
  // Bonus for having implementation plan
  if (idea.implementationPlan && idea.implementationPlan.length > 10) {
    score += 0.15;
  }
  
  // Bonus for having expected impact
  if (idea.expectedImpact && idea.expectedImpact.length > 10) {
    score += 0.2;
  }
  
  // Bonus for having target audience
  if (idea.targetAudience && idea.targetAudience.length > 5) {
    score += 0.1;
  }
  
  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score));
  
  return score;
};

// Get explanation for success rate prediction
export const getSuccessRateExplanation = (idea) => {
  const factors = [];
  
  // Category factor
  const categoryWeights = {
    'technology': 0.8,
    'healthcare': 0.75,
    'education': 0.7,
    'agriculture': 0.65,
    'infrastructure': 0.7,
    'other': 0.6
  };
  
  const categoryWeight = categoryWeights[idea.category] || categoryWeights.other;
  factors.push({
    factor: 'Category',
    impact: 'positive',
    weight: categoryWeight,
    explanation: `Projects in ${idea.category} category have a base success rate of ${Math.round(categoryWeight * 100)}%`
  });
  
  // Funding factor
  const fundingFactor = 0.0001;
  const fundingImpact = idea.requiredFunding * fundingFactor;
  factors.push({
    factor: 'Required Funding',
    impact: 'negative',
    weight: fundingImpact,
    explanation: `Higher funding requirement (${idea.requiredFunding}) reduces success rate by ${Math.round(fundingImpact * 100)}%`
  });
  
  // Implementation plan factor
  if (idea.implementationPlan && idea.implementationPlan.length > 10) {
    factors.push({
      factor: 'Implementation Plan',
      impact: 'positive',
      weight: 0.15,
      explanation: 'Having a detailed implementation plan increases success rate by 15%'
    });
  }
  
  // Expected impact factor
  if (idea.expectedImpact && idea.expectedImpact.length > 10) {
    factors.push({
      factor: 'Expected Impact',
      impact: 'positive',
      weight: 0.2,
      explanation: 'Defining expected impact increases success rate by 20%'
    });
  }
  
  // Target audience factor
  if (idea.targetAudience && idea.targetAudience.length > 5) {
    factors.push({
      factor: 'Target Audience',
      impact: 'positive',
      weight: 0.1,
      explanation: 'Defining target audience increases success rate by 10%'
    });
  }
  
  return factors;
};
