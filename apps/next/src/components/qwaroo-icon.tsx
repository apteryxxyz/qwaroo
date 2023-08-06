import Image from 'next/image';

export function QwarooIcon({ width = 32 }: { width?: number }) {
  return (
    <div className="mr-1 inline">
      <Image
        src="/images/qwaroo.svg"
        height={width}
        width={width}
        alt=""
        className="block dark:hidden"
      />
      <Image
        src="/images/qwaroo-white.svg"
        height={width}
        width={width}
        alt=""
        className="hidden dark:block"
      />
    </div>
  );
}
