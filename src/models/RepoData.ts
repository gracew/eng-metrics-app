export interface IRepoData {
    ci: ICIData[]
    prs: IPRData[]
    issues: IIssueData[]
}

export interface ICIData {
    week: string
    buildTime50: number
}

export interface IPRData {
    week: string
    merged: number
    rejected: number
    opened: number
}

export interface IIssueData {
    week: string
    closed: number
    opened: number
}
