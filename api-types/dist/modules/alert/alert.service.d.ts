import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { EffectivePlan } from '@/types/plan.types';
import type { RegulatoryAlert, AlertSubscription } from '@prisma/client';
import type { AlertWithReadStatus, GetAlertsResult } from './alert.types';
import type { CreateAlertInput, UpdateAlertInput, RejectAlertInput, GetAlertsInput, UpsertSubscriptionInput } from './alert.schema';
declare class AlertService {
    private readonly prisma;
    constructor(deps?: {
        prisma?: typeof defaultPrisma;
    });
    createAlert(input: CreateAlertInput, publishedById: string): Promise<RegulatoryAlert>;
    publishAlert(alertId: string, publishedById: string): Promise<void>;
    getAlerts(userId: string, _organizationId: string | undefined, plan: EffectivePlan, params: GetAlertsInput): Promise<GetAlertsResult>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string, _organizationId: string | undefined): Promise<void>;
    getAlertById(alertId: string, userId: string): Promise<AlertWithReadStatus>;
    upsertSubscription(organizationId: string | undefined, input: UpsertSubscriptionInput): Promise<AlertSubscription>;
    getSubscription(organizationId: string | undefined): Promise<AlertSubscription | null>;
    getAdminAlerts(params: {
        page: number;
        limit: number;
    }): Promise<{
        alerts: RegulatoryAlert[];
        total: number;
    }>;
    private dispatchAlertEmail;
    updateDraft(input: UpdateAlertInput, userId: string): Promise<RegulatoryAlert>;
    rejectDraft(input: RejectAlertInput, reviewerId: string): Promise<{
        success: boolean;
        alertId: string;
    }>;
}
export declare const alertService: AlertService;
export { AlertService };
//# sourceMappingURL=alert.service.d.ts.map