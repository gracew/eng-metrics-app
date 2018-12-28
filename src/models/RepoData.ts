export interface IRepoData {
    ci: ICIData[]
    prs: IPRData[]
    issues: IIssueData[]
}

export interface ICIData {
    week: string
    details: ICIDetails[] | null
}

export interface ICIDetails {
    pr: number
    maxCheckName: string
    maxCheckDuration: number
}

export interface IPRData {
    week: string
    merged: number
    rejected: number
    opened: number
    details: IPRDetails[] | null
}

export interface IPRDetails {
    pr: number
    resolutionTime: number
    reviews: number
}

export interface IIssueData {
    week: string
    closed: number
    opened: number
    details: IIssueDetails[] | null
}

export interface IIssueDetails {
    issue: number
    resolutionTime: number
}
