declare module "percentile" {
    // export function percentile<T>(p: number, list: number[]): number;
    function percentile<T>(p: number, list: T[], fn: (item: T) => number): T;
    export default percentile
}