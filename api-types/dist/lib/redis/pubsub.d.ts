/**
 * In-process Pub/Sub service using Node.js EventEmitter.
 *
 * Replaces the ioredis TCP pub/sub implementation, which is incompatible
 * with Upstash's HTTP-based REST API.
 *
 * Trade-off: events are process-local only. For a single-instance Render
 * deployment this is identical in behaviour to Redis pub/sub. If you ever
 * move to multiple replicas, replace this with Upstash QStash or similar.
 */
export type NotificationEvent = {
    type: string;
    userId: string;
    data: any;
    timestamp: number;
};
export type PolicyProgressEvent = {
    type: 'generation_started' | 'analyzing_regulations' | 'generating_recommendations' | 'creating_checklist' | 'generation_complete' | 'generation_failed';
    policyId: string;
    progress: number;
    message: string;
    data?: any;
    timestamp: number;
};
export type EventHandler<T> = (event: T) => void | Promise<void>;
declare class PubSubService {
    private emitter;
    constructor();
    publish<T>(channel: string, event: T): Promise<void>;
    subscribe<T>(channel: string, handler: EventHandler<T>): Promise<() => void>;
    unsubscribe<T>(channel: string, handler: EventHandler<T>): Promise<void>;
    unsubscribeAll(): Promise<void>;
    disconnect(): Promise<void>;
}
export declare const pubsub: PubSubService;
export declare const notificationPubSub: {
    publish: (userId: string, notification: Omit<NotificationEvent, "timestamp">) => Promise<void>;
    subscribe: (userId: string, handler: EventHandler<NotificationEvent>) => Promise<() => void>;
    unsubscribe: (userId: string, handler: EventHandler<NotificationEvent>) => Promise<void>;
};
export declare const policyProgressPubSub: {
    publish: (policyId: string, event: Omit<PolicyProgressEvent, "policyId" | "timestamp">) => Promise<void>;
    subscribe: (policyId: string, handler: EventHandler<PolicyProgressEvent>) => Promise<() => void>;
    unsubscribe: (policyId: string, handler: EventHandler<PolicyProgressEvent>) => Promise<void>;
    started: (policyId: string) => Promise<void>;
    analyzing: (policyId: string) => Promise<void>;
    generating: (policyId: string) => Promise<void>;
    checklist: (policyId: string) => Promise<void>;
    complete: (policyId: string, data?: any) => Promise<void>;
    failed: (policyId: string, error: string) => Promise<void>;
};
export type ChecklistProgressEvent = {
    type: 'started' | 'progress' | 'parsing' | 'complete' | 'error';
    checklistId: string;
    message: string;
    categoriesDetected?: number;
    itemCount?: number;
    timestamp: number;
};
export declare const checklistProgressPubSub: {
    publish: (checklistId: string, event: Omit<ChecklistProgressEvent, "checklistId" | "timestamp">) => Promise<void>;
    subscribe: (checklistId: string, handler: EventHandler<ChecklistProgressEvent>) => Promise<() => void>;
};
export type AlertSSEEvent = {
    type: 'NEW_ALERT';
    alertId: string;
    title: string;
    severity: string;
    regulatoryBody: string;
    publishedAt: string;
    timestamp: number;
};
export declare const alertPubSub: {
    publish: (userId: string, event: Omit<AlertSSEEvent, "timestamp">) => Promise<void>;
    subscribe: (userId: string, handler: EventHandler<AlertSSEEvent>) => Promise<() => void>;
    unsubscribe: (userId: string, handler: EventHandler<AlertSSEEvent>) => Promise<void>;
};
export declare const systemEventsPubSub: {
    publish: (event: {
        type: string;
        message: string;
        data?: any;
    }) => Promise<void>;
    subscribe: (handler: EventHandler<any>) => Promise<() => void>;
};
export {};
//# sourceMappingURL=pubsub.d.ts.map