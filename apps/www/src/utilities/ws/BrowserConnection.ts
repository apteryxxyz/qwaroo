import { EventEmitter } from 'events';

export class BrowserConnection<
    TIncomingMap extends {},
    TOutgoingMap extends {
        on: (keyof TIncomingMap)[];
        off: (keyof TIncomingMap)[];
    }
> {
    private _events: (keyof TIncomingMap)[] = [];
    public readonly client: WebSocket; // native browser
    public readonly events = new EventEmitter();

    public constructor(client: WebSocket) {
        client.addEventListener('message', this._handle.bind(this));
        this.client = client;
    }

    private _handle(message: MessageEvent) {
        try {
            const data = JSON.parse(message.data.toString());
            this.events.emit(data.name, data.payload);
        } catch (error: unknown) {
            console.error(error);
        }
    }

    public listen(events: (keyof TIncomingMap)[]) {
        this._events = [...this._events, ...events] //
            .filter((event, index, array) => array.indexOf(event) === index);
        this.send('on', events);
    }

    public unlisten(events: (keyof TIncomingMap)[]) {
        this._events = this._events.filter(event => !events.includes(event));
        this.send('off', events);
    }

    public send<TName extends keyof TOutgoingMap, TPayload extends TOutgoingMap[TName]>(
        name: TName,
        payload: TPayload
    ) {
        this.client.send(JSON.stringify({ name, payload }));
    }

    public on<TName extends keyof TIncomingMap, TPayload extends TIncomingMap[TName]>(
        name: TName,
        callback: (payload: TPayload) => void
    ) {
        if (!this._events.includes(name)) return;
        // @ts-expect-error - Added custom errors
        this.events.on(name, callback);
    }
}
