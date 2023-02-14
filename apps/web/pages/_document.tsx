import { Head, Html, Main, NextScript } from 'next/document';
import {
    getGoogleAdSenseClient,
    getGoogleAnalyticsId,
} from '#/utilities/getEnv';

export default () => {
    return <Html lang="en">
        <Head>
            {/* Google Adsense */}
            <script
                async
                id="google-adsense"
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getGoogleAdSenseClient()}`}
                crossOrigin="anonymous"
            />

            {/* Google Analytics */}
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${getGoogleAnalyticsId()}`}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}

                    gtag('js', new Date());
                    gtag('config', '${getGoogleAnalyticsId()}', {
                        page_path: window.location.pathname
                    });
                    window.gtag = gtag;
                    `,
                }}
            />
        </Head>

        <body>
            <Main />
            <NextScript />
        </body>
    </Html>;
};
