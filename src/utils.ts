import * as uuid from 'uuid';
export const purple = '#6f42c1';
export const green = '#28a745';
export const red = '#cb2431';
export const toMinutes = (seconds: number) => (seconds / 60).toFixed(2)
export const toDays = (seconds: number) => (seconds / (60 * 60 * 24)).toFixed(2)

export function getGithubLoginUrl(redirectUri?: string) {
    let state = localStorage.getItem("oauthState")
    if (state === null) {
        state = uuid.v4()
        localStorage.setItem("oauthState", state)
    }
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=repo&state=${state}`
    return redirectUri ? `${url}&redirect_uri=${redirectUri}` : url;
}

export const chartOptions = {
    dataZoom: [{
        filterMode: "none",
        type: "inside",
    }],
    legend: { top: "bottom" },
    tooltip: { trigger: "axis" },
}
