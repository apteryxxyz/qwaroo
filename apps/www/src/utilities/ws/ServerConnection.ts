import { EventEmitter } from 'node:events';

export class ServerConnection<
    TIncomingMap extends {
        on: (keyof TOutgoingMap)[];
        off: (keyof TOutgoingMap)[];
    },
    TOutgoingMap extends {}
> {
    private _events: (keyof TOutgoingMap)[] = [];
    public readonly client: import('ws').WebSocket;
    public readonly events = new EventEmitter();

    public constructor(client: import('ws').WebSocket) {
        client.on('message', this._handle.bind(this));
        this.client = client;
    }

    private _handle(message: Buffer) {
        try {
            const data = JSON.parse(message.toString());
            if (data.name === 'on') {
                this._events = [...this._events, ...data.payload] //
                    .filter((event, index, self) => self.indexOf(event) === index);
            } else if (data.name === 'off') {
                this._events = this._events.filter(event => !data.payload.includes(event));
            } else {
                this.events.emit(data.name, data.payload);
            }
        } catch (error: unknown) {
            console.error(error);
        }
    }

    public send<TName extends keyof TOutgoingMap, TPayload extends TOutgoingMap[TName]>(
        name: TName,
        payload: TPayload
    ) {
        if (!this._events.includes(name)) return;
        this.client.send(JSON.stringify({ name, payload }));
    }

    public on<TName extends keyof TIncomingMap, TPayload extends TIncomingMap[TName]>(
        name: TName & string,
        callback: (payload: TPayload) => void
    ) {
        this.events.on(name, callback);
    }
}
