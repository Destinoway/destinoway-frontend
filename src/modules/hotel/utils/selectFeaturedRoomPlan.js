export const selectFeaturedRoomPlan = (ratePlans = []) => {
  const plans = Array.isArray(ratePlans) ? ratePlans : [];
  const recommendedPlan = plans.find((plan) => plan?.isPreffered === true);

  return {
    plan: recommendedPlan || plans[0] || null,
    isRecommended: Boolean(recommendedPlan),
  };
};
