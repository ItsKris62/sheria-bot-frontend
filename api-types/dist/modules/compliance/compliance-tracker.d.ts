/**
 * Compliance Tracker
 * Handles requirement tracking, deadline management, and compliance certificates
 */
import { type Requirement, type RequirementStatus, type UpcomingDeadline, type EvidenceType, type RegulatoryArea, type GapPriority } from './compliance.types';
/**
 * Compliance Tracker Class
 * Handles all tracking and deadline management
 */
declare class ComplianceTracker {
    /**
     * Create a new requirement
     */
    createRequirement(orgId: string, params: {
        area: RegulatoryArea;
        title: string;
        description: string;
        priority?: GapPriority;
        dueDate?: Date;
        assignedTo?: string;
        notes?: string;
    }): Promise<Requirement>;
    /**
     * Update requirement status
     */
    updateRequirementStatus(requirementId: string, status: RequirementStatus, notes?: string): Promise<Requirement>;
    /**
     * Track completion with evidence
     */
    trackCompletion(requirementId: string, evidence: {
        type: EvidenceType;
        title: string;
        description?: string;
        documentId?: string;
        url?: string;
    }, userId: string): Promise<Requirement>;
    /**
     * Get requirements for an organization
     */
    getRequirements(orgId: string, filters?: {
        area?: RegulatoryArea;
        status?: RequirementStatus;
        priority?: GapPriority;
        assignedTo?: string;
        overdue?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        requirements: Requirement[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    /**
     * Get completion percentage
     */
    getCompletionPercentage(orgId: string): Promise<number>;
    /**
     * Get upcoming deadlines
     */
    getUpcomingDeadlines(orgId: string, daysAhead?: number): Promise<UpcomingDeadline[]>;
    /**
     * Get overdue requirements
     */
    getOverdueRequirements(orgId: string): Promise<Requirement[]>;
    /**
     * Send deadline reminders
     */
    sendDeadlineReminders(): Promise<{
        sent: number;
        failed: number;
    }>;
    /**
     * Generate compliance certificate
     */
    generateCertificate(orgId: string, area: RegulatoryArea): Promise<{
        certificateId: string;
        downloadUrl: string;
        validUntil: Date;
    }>;
    /**
     * Schedule deadline reminder
     */
    private scheduleDeadlineReminder;
    /**
     * Invalidate requirements cache
     */
    private invalidateRequirementsCache;
    /**
     * Generate certificate HTML
     */
    private generateCertificateHtml;
}
export declare const complianceTracker: ComplianceTracker;
export { ComplianceTracker };
//# sourceMappingURL=compliance-tracker.d.ts.map