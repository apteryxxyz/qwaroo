/* eslint-disable @next/next/next-script-for-ga */
import { Head, Html, Main, NextScript } from 'next/document';
import { useGoogleAdsenseClient, useGoogleAnalyticsId } from '#/hooks/useEnv';

export default () => {
    return <Html>
        <Head>
            {/* Google Adsense */}
            <script
                async
                id="google-adsense"
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${useGoogleAdsenseClient()}`}
                crossOrigin="anonymous"
            />

            {/* Google Analytics */}
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${useGoogleAnalyticsId()}`}
            />

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}

                    gtag('js', new Date());
                    gtag('config', '${useGoogleAnalyticsId()}', {
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
