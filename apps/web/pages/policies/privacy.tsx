import { PageSeo } from '#/components/Seo/Page';

export default () => {
    return <div
        className="flex flex-col gap-1 max-w-4xl mx-auto
        [&>section]:my-1 [&>section]:p-5"
    >
        <PageSeo
            title="Privacy Policy"
            description="A collection of fun guessing and statistics based browser games.
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/policies/privacy"
        />

        <h2 className="font-bold text-4xl text-qwaroo-gradient">
            Qwaroo Privacy Policy
        </h2>

        <div className="flex flex-col font-semibold text-lg">
            <span>Effective: 18th January 2023</span>
            <span>Last updated: 18th January 2023</span>
        </div>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Welcome!</h3>

            <p>
                The privacy of our visitors is a top priority for Apteryx
                Software ("we", "our", "us") and, by extension, Qwaroo
                ("service") and its services. The types of information that
                Qwaroo gathers and records, as well as how we utilise it, are
                detailed in this privacy policy document.
            </p>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">The information we collect</h3>

            <p>
                Logging into our service can only be done using a third-party
                login provider. When you create an account using one of those
                providers, we will only collect your account's unique ID,
                display name and avatar image. Your ID is used to identify you,
                while your display name and avatar will be displayed on your
                Qwaroo profile.
            </p>

            <p>
                For logged-in users, we will save your individual game
                statistics for the purpose of displaying on your Qwaroo profile.
                For guests, we do not collect any individually identifiable
                information. Regardless of login status, we will also record the
                total game plays, total scores and total time played for each
                game, these are used for site-wide statistics and game analysis.
            </p>

            <p>
                Please note that we will not share, sell, or distribute any of
                the personal information we collect, whether it's from logged-in
                users or guests, without your explicit consent. We have
                implemented strict security measures to ensure that your
                personal information is protected.
            </p>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Third-party cookies</h3>

            <p>
                We use <strong>Google Analytics</strong> to track and make sense
                of website traffic, to make the user experience better. This
                service uses cookies and other tracking technologies to gather
                anonymous information, like where you are, what sort of device
                you're using, and how you move around the site. We don't pass on
                any personal information to Google, and you can choose not to be
                tracked by switching off cookies or using the Google Analytics{' '}
                <a
                    className="underline text-blue-500 hover:opacity-80"
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                >
                    opt-out browser add-on
                </a>
                . For more information, check out{' '}
                <a
                    className="underline text-blue-500 hover:opacity-80"
                    href="https://policies.google.com/privacy"
                    target="_blank"
                >
                    Google's privacy policy
                </a>
                .
            </p>

            {/* <p>
                We use Google AdSense to display ads on our website. This
                service uses cookies and other tracking technologies to collect
                anonymous data such as location, device type and browsing
                behaviour. This information is used to show you ads that are
                relevant to your interests. You can opt out of the use of
                cookies for interest-based advertising by visiting{' '}
                <a
                    className="underline text-blue-500 hover:opacity-80"
                    href="https://adssettings.google.com/"
                    target="_blank"
                >
                    Ads Settings
                </a>
                . For more information about how Google AdSense uses data and
                how to opt out, please refer to{' '}
                <a
                    className="underline text-blue-500 hover:opacity-80"
                    href="https://policies.google.com/privacy"
                    target="_blank"
                >
                    Google's privacy policy
                </a>
                .
            </p> */}
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Data processing and retenion</h3>

            <p>
                Qwaroo and our servers are based in New Zealand and, as such,
                are subject to the New Zealand Privacy Act 1993. We only collect
                and process data that is necessary for the provision of our
                services or as required by law.
            </p>

            <p>
                We retain any of the submitted data for as long as is necessary
                to fulfill the purposes we collected it for, including for the
                purposes of satisfying any legal, accounting, or reporting
                requirements. You have the right to access, correct, or delete
                your personal data at any time. If you wish to exercise this
                right, please contact us.
            </p>
        </section>

        <section className="bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Acceptance of this policy</h3>

            <p>
                Continued use of our site signifies your acceptance of this
                policy. If you do not accept the policy then please do not use
                this site. When registering we will further request your
                explicit acceptance of the privacy policy.
            </p>
        </section>

        <section className="bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Changes to this policy</h3>

            <p>
                We may update this privacy policy from time to time. We
                encourage you to review this privacy policy periodically to stay
                informed about how we are helping to protect the personal
                information we collect. Your continued use of this site after
                any change in this privacy policy will constitute your
                acceptance of such change.
            </p>
        </section>
    </div>;
};
