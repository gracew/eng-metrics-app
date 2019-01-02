import * as uuid from 'uuid';
export const purple = '#6f42c1';
export const green = '#28a745';
export const red = '#cb2431';
export const toMinutes = (seconds: number) => (seconds / 60).toFixed(2)
export const toDays = (seconds: number) => (seconds / (60 * 60 * 24)).toFixed(2)

export function getGithubLoginUrl() {
    let state = localStorage.getItem("oauthState")
    if (state === null) {
        state = uuid.v4()
        localStorage.setItem("oauthState", state)
    }
    return `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=repo&state=${state}`
}
