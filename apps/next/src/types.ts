export type PageProps<
  TParams extends string | undefined = undefined,
  TSearchParams extends string | undefined = undefined,
> = {
  params: TParams extends undefined ? {} : Record<TParams & string, string>;
  searchParams: TSearchParams extends undefined
    ? {}
    : Record<TSearchParams & string, string | undefined>;
} & {};

export type LayoutProps<TParams extends string | undefined = undefined> =
  React.PropsWithChildren<{
    params: TParams extends undefined ? {} : Record<TParams & string, string>;
  }>;
