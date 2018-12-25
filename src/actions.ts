export function selectRepo(repo: string) {
    return {
        repo,
        type: 'SELECT_REPO',
    }
}

export function fetchDataSuccess(items: any[]) {
    return {
        items,
        type: 'FETCH_DATA_SUCCESS',
    }
}

export function fetchItems() {
    return (dispatch: any) => {
        fetch('http://localhost:8080/PrimerAI/disco/score?weeks=6', { mode: "cors" })
            .then(res => res.json())
            .then(({ ci }) => ci.map(({ week, buildTime50 }: { week: string, buildTime50: number }) => [week, buildTime50]))
            .then(items => dispatch(fetchDataSuccess(items)))
    }
}