/**
 * Pilot Event Service
 *
 * Logs significant product actions for pilot testers to the PilotEvent table.
 * Used to calculate engagement scores and drive the admin pilot dashboard.
 *
 * Design invariants:
 *  - logPilotEvent() NEVER throws. All errors are caught and logged via Pino.
 *    Pilot event logging must never break or slow down the primary operation.
 *  - The function is always called fire-and-forget: callers must .catch() any
 *    rejection (defensive, since the function itself swallows errors).
 *  - The internal isPilot guard prevents writes for non-pilot users even if a
 *    call site inadvertently invokes logPilotEvent for a non-pilot userId.
 */
export type PilotAction = 'LOGIN' | 'CHECKLIST_GENERATED' | 'CHECKLIST_EXPORTED' | 'DOCUMENT_UPLOADED' | 'VAULT_ACCESSED' | 'AI_QUERY_SENT' | 'AI_QUERY_COMPLETED' | 'REPORT_GENERATED' | 'SETTINGS_UPDATED' | 'FEEDBACK_SUBMITTED';
export interface LogPilotEventParams {
    userId: string;
    action: PilotAction;
    feature: string;
    metadata?: Record<string, unknown>;
    sessionId?: string;
}
/**
 * Log a pilot tester action to the PilotEvent table.
 *
 * Guard clause: fetches User.isPilot from the DB before writing. If the user
 * is not a pilot, returns immediately without touching the DB write path.
 *
 * Must be called fire-and-forget:
 *   logPilotEvent({ ... }).catch((err) =>
 *     logger.error({ type: 'PILOT_EVENT_LOG_FAILED', err })
 *   );
 */
export declare function logPilotEvent(params: LogPilotEventParams): Promise<void>;
//# sourceMappingURL=pilot-event.service.d.ts.map