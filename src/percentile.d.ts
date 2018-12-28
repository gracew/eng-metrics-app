declare module "percentile" {
    function percentile<T>(p: number, list: T[], fn: (item: T) => number): T;
    export default percentile
}