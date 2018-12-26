import { ICIData } from '../models/ci';

export const SELECT_REPO = 'SELECT_REPO'
export const FETCH_REPO_DATA_SUCCESS = 'FETCH_REPO_DATA_SUCCESS'

export function selectRepo(repo: string) {
    return {
        repo,
        type: SELECT_REPO,
    }
}

export function fetchRepoDataSuccess(items: ICIData[]) {
    return {
        items,
        type: FETCH_REPO_DATA_SUCCESS,
    }
}

export function fetchRepoData(repo: string) {
    return (dispatch: any) => {
        fetch(`http://localhost:8080/${repo}/score?weeks=6`, { mode: "cors" })
            .then(res => res.json())
            .then(({ ci }) => ci)
            .then(items => dispatch(fetchRepoDataSuccess(items)))
            // TODO(gracew): handle failure case...
    }
}