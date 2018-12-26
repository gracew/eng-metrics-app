export interface IRepoData {
    ci: ICIData[]
}

export interface ICIData {
    week: string
    buildTime50: number
}