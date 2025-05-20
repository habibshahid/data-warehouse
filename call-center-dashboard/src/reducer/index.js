import * as ActionTypes from "../actions/types"

const defaultState = {
  selectedDashboard: null,
  display: 'home',
  currentQueueWidget: {}
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_BI_DASHBOARD:
      return { ...state, selectedDashboard: action.payload }
    case ActionTypes.SET_SELECTED_DISPLAY:
      return { ...state, display: action.payload }
    case ActionTypes.SET_CURRENT_QUEUE_WIDGET:
      return { ...state, currentQueueWidget: action.payload }
    default:
      return state
  }
}