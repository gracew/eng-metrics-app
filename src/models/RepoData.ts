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
    prUrl: string
    maxCheckName: string
    maxCheckDuration: number
    maxCheckUrl: string
}

export interface IPRData {
    week: string
    merged: number
    rejected: number
    opened: number
    details: IPRDetails[] | null
}

export enum PRState {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    MERGED = "MERGED"
}

export interface IPRDetails {
    number: number
    title: string
    url: string
    state: string
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
    number: number
    title: string
    url: string
    state: string
    resolutionTime: number
}
