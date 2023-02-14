import { Seo } from './Seo';
import { resolveHref } from '#/utilities/urlHelpers';

export function PageSeo({ keywords = [], banner, ...props }: PageSeo.Props) {
    keywords = [...keywords, 'qwaroo', 'guessing', 'game', 'quiz', 'apteryx'];

    return <Seo {...props}>
        {/* Basic */}
        <meta name="description" content={props.description} />
        <meta name="keywords" content={keywords.join(', ')} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Qwaroo" />
        <meta property="og:url" content={resolveHref(props.url)} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        {banner && <>
            <meta property="og:image" content={resolveHref(banner.source)} />
            <meta property="og:image:width" content={banner.width.toString()} />
            <meta
                property="og:image:height"
                content={banner.height.toString()}
            />
        </>}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large" />
        <meta name="twitter:site" content="@apteryxxyz" />
        <meta name="twitter:creator" content="@apteryxxyz" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
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

export namespace PageSeo {
    export interface Props extends Seo.Props {
        url: string;
        description: string;
        keywords?: string[];

        banner?: {
            source: string;
            width: number;
            height: number;
        };
    }
}
