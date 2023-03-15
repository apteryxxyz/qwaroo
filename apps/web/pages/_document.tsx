import { Head, Html, Main, NextScript } from 'next/document';
import { getGoogleAdSenseClient, getGoogleAnalyticsId } from '#/utilities/env';

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

            {/* Donation */}
            <script
                defer
                data-name="BMC-Widget"
                data-cfasync="false"
                src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
                data-id="apteryx"
                data-description="Support me on Buy me a coffee!"
                data-message="Thanks for visiting Qwaroo! Support development by buying us a coffee!"
                data-color="#5F7FFF"
                data-position="left"
                data-x_margin="10"
                data-y_margin="10"
            ></script>
        </Head>

        <body>
            <Main />
            <NextScript />
        </body>
    </Html>;
};
