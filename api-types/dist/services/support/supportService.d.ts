/**
 * Support Ticket Service
 *
 * All business logic for support ticket operations.
 * tRPC routers are thin wrappers that call these functions.
 */
import type { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';
export interface CreateTicketInput {
    subject: string;
    description: string;
    category: TicketCategory;
    priority?: TicketPriority;
}
export interface ListTicketsFilters {
    status?: TicketStatus;
    page?: number;
    limit?: number;
}
export interface AdminListTicketsFilters {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    search?: string;
    page?: number;
    limit?: number;
}
export declare function createTicket(prisma: any, userId: string, input: CreateTicketInput): Promise<any>;
export declare function getUserTickets(prisma: any, userId: string, filters: ListTicketsFilters): Promise<{
    tickets: any;
    total: any;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function getTicketDetail(prisma: any, ticketNumber: string, userId: string): Promise<any>;
export declare function addUserComment(prisma: any, ticketId: string, userId: string, message: string): Promise<any>;
export declare function getAdminTickets(prisma: any, filters: AdminListTicketsFilters): Promise<{
    tickets: any;
    total: any;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function getAdminTicketDetail(prisma: any, ticketNumber: string): Promise<any>;
export declare function adminUpdateStatus(prisma: any, ticketId: string, newStatus: TicketStatus, adminUserId: string): Promise<any>;
export declare function adminAddResponse(prisma: any, ticketId: string, adminUserId: string, message: string, updateStatusTo?: TicketStatus): Promise<any>;
export declare function getTicketStats(prisma: any): Promise<{
    open: any;
    inProgress: any;
    awaitingUser: any;
    resolved: any;
    closed: any;
    urgent: any;
}>;
//# sourceMappingURL=supportService.d.ts.map