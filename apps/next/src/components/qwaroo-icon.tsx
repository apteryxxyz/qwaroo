/* eslint-disable @next/next/no-img-element */

export function QwarooIcon({ width = 32 }: { width?: number }) {
  return (
    <div className="mr-1 inline">
      <img
        src="/images/qwaroo.svg"
        height={width}
        width={width}
        alt=""
        className="block dark:hidden"
      />
      <img
        src="/images/qwaroo-white.svg"
        height={width}
        width={width}
        alt=""
        className="hidden dark:block"
      />
    </div>
  );
}
