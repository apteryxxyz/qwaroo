import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { Button } from '#/components/Input/Button';
import { PageSeo } from '#/components/Seo/Page';

export default () => {
    return <div
        className="flex flex-col gap-1 max-w-4xl mx-auto
        [&>section]:my-1 [&>section]:p-5"
    >
        <PageSeo
            title="Contact Us"
            description="Ready to have some fun? Check out our collection of exciting guessing and statistics-based games!
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/contact"
        />

        <h2 className="font-bold text-4xl text-qwaroo-400">
            Qwaroo Contact Us
        </h2>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Welcome!</h3>

            <p>
                Need to get in contact with the developers of Qwaroo? You've
                come to the right place! Just use one of the methods below to
                get in touch. We'll get back to you as soon as we can.
            </p>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Via Discord</h3>

            <p>
                If you need a quick answer, the best way to get in touch is to
                join our Discord server. We have a dedicated support channel
                where you can ask any questions you may have. We'll get back to
                you as soon as we can.
            </p>

            <Button
                className="bg-[#5865F2] hover:brightness-125"
                iconProp={faDiscord}
                linkProps={{
                    href: 'https://discord.gg/C3qVXYqX8J',
                    newTab: true,
                }}
            >
                Discord
            </Button>
        </section>

        <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-xl">
            <h3 className="font-bold text-2xl">Via Email</h3>

            <p>
                You can send us an email at{' '}
                <a
                    className="underline text-blue-500 hover:opacity-80"
                    href="mailto:kiaora@apteryx.xyz"
                >
                    kiaora@apteryx.xyz
                </a>
                , however a response <strong>will</strong> take longer than via
                Discord.
            </p>
        </section>
    </div>;
};
