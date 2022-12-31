import { ServerError } from '#/components/Display/ServerError';
import { Seo } from '#/components/Seo';

export default () => {
    return <div id="error-500">
        <Seo title="Server Error" noIndex />

        <ServerError />
    </div>;
};
