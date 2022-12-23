import { ServerError } from '#/components/Display/ServerError';

export default () => {
    return <div id="error-500">
        <ServerError />
    </div>;
};
