import { NotFound } from '#/components/Display/NotFound';
import { Seo } from '#/components/Seo';

export default () => {
    return <div id="error-404">
        <Seo title="Not Found" noIndex />

        <NotFound />
    </div>;
};
