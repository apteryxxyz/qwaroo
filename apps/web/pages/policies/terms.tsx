import { PageSeo } from '#/components/Seo/Page';

export default () => {
    return <div
        className="flex flex-col gap-1 max-w-4xl mx-auto
        [&>section]:my-1 [&>section]:p-5"
    >
        <PageSeo
            title="Terms of Use"
            description="A collection of fun guessing and statistics based browser games.
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/policies/terms"
        />

        <h2 className="font-bold text-4xl text-qwaroo-gradient">
            Qwaroo Terms of Use
        </h2>

        <div className="flex flex-col font-semibold text-lg">
            <span>Effective: 18th January 2023</span>
            <span>Last updated: 18th January 2023</span>
        </div>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Welcome!</h3>

            <p>
                Welcome to Qwaroo ("service"), a collection of guessing and
                statistics based games, provided by Apteryx Software ("we",
                "our", "us"). Our service allows users to create and play games,
                create profiles, and interact with other users. By accessing or
                using our services, including visiting our website and creating
                an account, you are agreeing to be bound by the following terms
                and conditions. If you do not agree to these terms, you may not
                access or use our services.
            </p>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Use of the service</h3>

            <span>By using our services, you agree to the following:</span>

            <ul className="space-y-1 list-decimal pl-[1rem]">
                <li>
                    You will use our services only for lawful purposes and in
                    compliance with all applicable laws, regulations and
                    guidelines.
                </li>

                <li>
                    You will not use our services for any illegal or
                    unauthorised purpose, including but not limited to,
                    violation of any intellectual property rights, data
                    protection laws or any other applicable laws and
                    regulations.
                </li>

                <li>
                    You will be solely responsible for all activities that occur
                    under your account, including but not limited to, any
                    content or information submitted, posted or transmitted
                    through our service.
                </li>

                <li>
                    You will not engage in any activities that may harm or
                    disrupt the service or other users' use of the service.
                </li>

                <li>
                    You will not use our services in any way that may infringe
                    on any third-party rights, including but not limited to,
                    intellectual property rights, privacy rights, or any other
                    rights.
                </li>

                <li>
                    You will not use our services to create or promote hate
                    speech, discrimination, or harassment.
                </li>

                <li>
                    You will not use our services to impersonate or misrepresent
                    yourself or others.
                </li>
            </ul>

            <span>
                We reserve the right to terminate or restrict your access to our
                services if you violate these terms of use.
            </span>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Intellectual property</h3>

            <p>
                All content and software on our website, unless otherwise
                stated, is the property of Apteryx Software and is protected by
                copyright laws. You may not use any content or software on our
                webiste without our express written permission.
            </p>

            <p>
                User-generated content, such as game modes, remain the property
                of the individual who submitted the content. By submitting
                content to our website, you grant us a non-exclusive,
                royalty-free, worldwide license to use, copy, display, and
                distribute that content.
            </p>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Limitation of liability</h3>

            <p>
                In no event shall Apteryx Software, or its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                damages whatsoever, including but not limited to, direct,
                indirect, special, incidental, or consequential damages, arising
                out of or in connection with the use or inability to use our
                services.
            </p>
        </section>

        <section className="bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Acceptance of these terms</h3>

            <p>
                Continued use of our site signifies your acceptance of these
                terms. If you do not accept these terms then please do not use
                this site. When registering we will further request your
                explicit acceptance of the terms of use.
            </p>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Changes to these terms</h3>

            <p>
                We reserve the right to modify these terms of use at any time.
                If we make changes to the terms of use, we will post those
                changes on this page. Your continued use of our services
                following any changes to these terms of use constitutes
                acceptance of those changes.
            </p>
        </section>
    </div>;
};
