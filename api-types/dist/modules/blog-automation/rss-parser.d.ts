export interface DiscoveredItem {
    title: string;
    url: string;
    publicationDate?: Date;
    summary?: string;
}
export declare function parseRssFeed(feedUrl: string, maxItems: number, timeoutMs: number): Promise<DiscoveredItem[]>;
//# sourceMappingURL=rss-parser.d.ts.map