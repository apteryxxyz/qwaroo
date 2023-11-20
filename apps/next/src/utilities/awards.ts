export type Award = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

/** Resolve a game score to an award. */
export function findAward(score: number) {
  if (score >= 50) return 'Diamond';
  if (score >= 25) return 'Gold';
  if (score >= 10) return 'Silver';
  if (score >= 5) return 'Bronze';
  return undefined;
}

/** Get the image URL for an award. */
export function getAwardImage(award: Award) {
  switch (award) {
    case 'Bronze':
      return '/images/awards/bronze.png';
    case 'Silver':
      return '/images/awards/silver.png';
    case 'Gold':
      return '/images/awards/gold.png';
    case 'Diamond':
      return '/images/awards/diamond.png';
    default:
      return undefined;
  }
}

/** Get text for an award. */
export function getAwardText(award?: Award) {
  switch (award) {
    case 'Bronze':
      return 'Bronze medal, not bad, but keep trying.';
    case 'Silver':
      return 'Silver medal, well done!';
    case 'Gold':
      return 'Gold medal, impressive!';
    case 'Diamond':
      return 'Diamond trophy, you are a genius!';
    default:
      return "Don't give up! You can do it!";
  }
}
