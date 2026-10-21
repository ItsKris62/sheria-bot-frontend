import type { CalendarEventRecord, CreateEventParams, ListEventsParams, GetEventParams, UpdateEventParams, DeleteEventParams, UpcomingEventsParams } from './calendar.types';
declare class CalendarModule {
    private assertAssignableMember;
    createEvent(params: CreateEventParams): Promise<CalendarEventRecord>;
    listEvents(params: ListEventsParams): Promise<CalendarEventRecord[]>;
    getEvent(params: GetEventParams): Promise<CalendarEventRecord>;
    updateEvent(params: UpdateEventParams): Promise<CalendarEventRecord>;
    deleteEvent(params: DeleteEventParams): Promise<{
        id: string;
    }>;
    getUpcomingDeadlines(params: UpcomingEventsParams): Promise<CalendarEventRecord[]>;
    getUpcomingDeadlinesSummary(params: UpcomingEventsParams): Promise<{
        total: number;
        urgentCount: number;
        windowDays: number;
    }>;
    evaluateAndGenerateReminders(organizationId: string): Promise<void>;
}
export declare const calendarModule: CalendarModule;
export { CalendarModule };
//# sourceMappingURL=calendar.module.d.ts.map