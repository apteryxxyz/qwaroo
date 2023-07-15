import { createContext, useContext, useEffect, useMemo } from 'react';
import { BrowserConnection } from '@/utilities/ws/BrowserConnection';

export const WebSocketContext = createContext<BrowserConnection<any, any> | null>(null);
WebSocketContext.displayName = 'WebSocketContext';

export function WebSocketProvider({ children, url }: any) {
    const isBrowser = typeof window !== 'undefined';
    const setupClient = () => {
        if (!isBrowser) return null;
        const socket = new WebSocket(url);
        return new BrowserConnection<any, any>(socket);
    };

    const instance = useMemo(setupClient, [isBrowser, url]);

    useEffect(() => {
        Reflect.set(window, 'msgpro', instance);
        return () => {
            instance?.client?.close();
            console.log('closed');
        };
    }, [instance]);

    return <WebSocketContext.Provider value={instance}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket<
    TIncomingMap extends {},
    TOutgoingMap extends {
        on: (keyof TIncomingMap)[];
        off: (keyof TIncomingMap)[];
    }
>() {
    const context = useContext(WebSocketContext);
    if (context === undefined)
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    return context as BrowserConnection<TIncomingMap, TOutgoingMap>;
}
