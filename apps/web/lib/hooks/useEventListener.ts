/* eslint-disable @typescript-eslint/no-loop-func */
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

// MediaQueryList Event based useEventListener interface
export function useEventListener<K extends keyof MediaQueryListEventMap>(
    eventName: K,
    handler: (event: MediaQueryListEventMap[K]) => void,
    element: RefObject<MediaQueryList>,
    options?: boolean | AddEventListenerOptions
): void;

// Window Event based useEventListener interface
export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element?: undefined,
    options?: boolean | AddEventListenerOptions
): void;

// Element Event based useEventListener interface
export function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement
>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    element: RefObject<T>,
    options?: boolean | AddEventListenerOptions
): void;

// Document Event based useEventListener interface
export function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    element: RefObject<Document>,
    options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    KM extends keyof MediaQueryListEventMap,
    T extends HTMLElement | MediaQueryList | never = never
>(
    eventName: KW | KH | KM,
    handler: (
        event:
            | WindowEventMap[KW]
            | HTMLElementEventMap[KH]
            | MediaQueryListEventMap[KM]
            | Event
    ) => void,
    element?: RefObject<T>,
    options?: boolean | AddEventListenerOptions
) {
    // Create a ref that stores handler
    const savedHandler = useRef(handler);

    useIsomorphicLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        injectEventEmitters();

        // Define the listening target
        const targetElement: T | Window = element?.current ?? window;

        if (!targetElement?.addEventListener) return;

        // Create event listener that calls handler function stored in ref
        const listener: typeof handler = event => savedHandler.current(event);
        listener.toString = () => handler.toString();

        targetElement.addEventListener(eventName, listener, options);

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, listener, options);
        };
    }, [eventName, element, options]);
}

export function injectEventEmitters() {
    for (const { prototype } of [Element, Document, Window]) {
        if (Object.hasOwn(prototype, 'getEventListeners')) continue;

        prototype._eventListeners = {};
        prototype._addEventListener = prototype.addEventListener;
        prototype._removeEventListener = prototype.removeEventListener;

        prototype.addEventListener = function addEventListener(
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ) {
            const that = this ?? window;
            if (typeof options !== 'object')
                options = { capture: options === true };
            that._addEventListener(type, listener, options);

            if (!that._eventListeners[type]) that._eventListeners[type] = [];

            that._eventListeners[type].push({
                type,
                listener,
                useCapture: options.capture === true,
                passive: options.passive === true,
                once: options.once === true,
            });
        };

        prototype.removeEventListener = function removeEventListener(
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | EventListenerOptions
        ) {
            if (typeof options !== 'object')
                options = { capture: options === true };
            const that = this ?? window;
            that._removeEventListener(type, listener, options);

            if (!that._eventListeners[type]?.length) return;

            for (let i = 0; i < that._eventListeners[type].length; i++) {
                const event = that._eventListeners[type][i];

                if (event.listener !== listener) continue;
                if (event.useCapture !== options.capture) continue;

                that._eventListeners[type].splice(i, 1);
                break;
            }

            if (that._eventListeners[type].length === 0)
                delete that._eventListeners[type];
        };

        // @ts-expect-error 2322
        prototype.getEventListeners = function getEventListeners(
            type?: string
        ) {
            const that = this ?? window;
            if (type) return that._eventListeners[type] ?? [];
            return that._eventListeners;
        };

        prototype.clearEventListeners = function clearEventListeners(
            type?: string
        ) {
            const that = this ?? window;

            if (type) {
                const eventListeners = that.getEventListeners(type);
                for (const event of eventListeners)
                    that.removeEventListener(event.type, event.listener);
                return;
            }

            for (const type of Object.keys(that._eventListeners))
                that.clearEventListeners(type);
        };
    }
}

export interface EventObject {
    useCapture: boolean;
    passive: boolean;
    once: boolean;
    type: string;
    listener: EventListenerOrEventListenerObject;
}

export type EventCollection = Record<string, EventObject[]>;

export interface EventHandler<
    T extends Document | Element | Window,
    M extends DocumentEventMap | ElementEventMap | WindowEventMap
> {
    addEventListener<K extends keyof M>(
        type: K,
        listener: (this: T, ev: M[K]) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener<K extends keyof M>(
        type: K,
        listener: (this: T, ev: M[K]) => unknown,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;

    getEventListeners<K extends keyof M>(type: K): EventObject[];
    getEventListeners(type: string): EventObject[];
    getEventListeners(): EventCollection;

    clearEventListeners<K extends keyof M>(type: K): void;
    clearEventListeners(type?: string): void;

    _addEventListener: EventHandler<T, M>['addEventListener'];
    _removeEventListener: EventHandler<T, M>['removeEventListener'];
    _eventListeners: EventCollection;
}

declare global {
    interface Document extends EventHandler<Document, DocumentEventMap> {}
    interface Element extends EventHandler<Element, ElementEventMap> {}
    interface Window extends EventHandler<Window, WindowEventMap> {}
}
