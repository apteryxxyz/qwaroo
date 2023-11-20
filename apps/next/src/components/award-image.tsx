import { Award, getAwardImage } from '@/utilities/awards';

export function AwardImage(p: { award?: Award; className?: string }) {
  if (!p.award) return null;

  return (
    <picture>
      <img
        alt={`${p.award} award`}
        title={`You earned a ${p.award} award!`}
        src={getAwardImage(p.award)}
        className={p.className}
      />
    </picture>
  );
}
