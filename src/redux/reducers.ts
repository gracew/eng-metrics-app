import { combineReducers } from 'redux';

export function repo(state = null, action: any) {
  switch (action.type) {
    case 'SELECT_REPO':
      return action.repo
    default:
      return state
  }
}

export function items(state = [], action: any) {
  switch (action.type) {
    case 'FETCH_REPO_DATA_SUCCESS':
      return action.items
    default:
      return state
  }
}

export default combineReducers({
  items,
  repo,
})