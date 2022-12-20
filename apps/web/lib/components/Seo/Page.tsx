import { Seo } from './Seo';
import { resolveHref } from '#/utilities/resolveHref';

export namespace PageSeo {
    export interface Props extends Seo.Props {
        description: string;
        url: string;
        keywords?: string[];

        banner?: {
            source: string;
            width: number;
            height: number;
        };
    }
}

export function PageSeo({
    description,
    url,
    keywords,
    banner,
    ...props
}: PageSeo.Props) {
    return <Seo {...props}>
        <meta name="description" content={description} />
        <meta name="keywords" content={(keywords ?? []).join(', ')} />

        {/* Open Graph */}
        <meta property="og:url" content={resolveHref(url)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="More or Less" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={description} />
        {banner && <>
            <meta property="og:image" content={resolveHref(banner.source)} />
            <meta property="og:image:width" content={banner.width.toString()} />
            <meta
                property="og:image:height"
                content={banner.height.toString()}
            />
        </>}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@apteryxxyz" />
        <meta name="twitter:creator" content="@apteryxxyz" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={description} />
        {banner && <>
            <meta name="twitter:image" content={resolveHref(banner.source)} />
            <meta
                name="twitter:image:src"
                content={resolveHref(banner.source)}
            />
            <meta
                name="twitter:image:width"
                content={banner.width.toString()}
            />
            <meta
                name="twitter:image:height"
                content={banner.width.toString()}
            />
        </>}
    </Seo>;
}
