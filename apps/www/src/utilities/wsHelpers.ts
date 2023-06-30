import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/Authentication';

export async function getSession(request: import('http').IncomingMessage) {
    const headers = request.headers;
    const cookies =
        headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key.trim()] = value;
            return acc;
        }, {} as Record<string, string>) ?? {};

    delete cookies['next-auth.callback-url'];
    return getServerSession(
        { headers, cookies } as any,
        { getHeader() {}, setHeader() {} } as any,
        authOptions
    );
}

export function parseJson(maybeJson: string) {
    try {
        return JSON.parse(maybeJson);
    } catch {
        return null;
    }
}

export function sendMessage(client: import('ws').WebSocket, type: string, payload: any) {
    client.send(JSON.stringify({ type, payload }));
}
