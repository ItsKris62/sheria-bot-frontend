export declare class BlogNotificationService {
    private shouldNotify;
    notifyMonitorFailure(adminId: string, monitorName: string, errorMsg: string): Promise<void>;
    notifyHighPrioritySuggestion(adminId: string, sourceName: string, suggestionId: string): Promise<void>;
    notifyDraftReadyForVerification(adminId: string, draftId: string): Promise<void>;
    notifyVerificationBlocked(adminId: string, draftId: string, reason: string): Promise<void>;
}
export declare const blogNotificationService: BlogNotificationService;
//# sourceMappingURL=blog-notification.service.d.ts.map