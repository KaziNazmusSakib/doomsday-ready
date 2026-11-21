export interface BookingQuote {
    possible: boolean;
    bundleCount?: number;
    bundles?: {
        size: number;
        count: number;
    }[];
    message?: string;
}
export declare function getBookingQuote(bundleSizes: number[], groupSize: number): BookingQuote;
