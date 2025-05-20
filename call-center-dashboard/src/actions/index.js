import axios            from "axios";
import * as ActionTypes from "../actions/types";

let reportUrl = 'http://localhost:3900'

export const addNewDashboard = (dashboardName) => {
  return axios.post(`${ reportUrl }/biTools/addNewDashboard`, dashboardName, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

export const updateSelectedDashboard = (data) => {
  return axios.put(`${ reportUrl }/biTools/updateSelectedDashboard`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

export const fetchDashboards = () => {
  return axios.get(`${ reportUrl }/biTools`, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
}

export const getSelectDashboard = (data) => {
  return axios.get(`${ reportUrl }/biTools/getSelectedDashboard`, {
    headers: { Authorization: `${ localStorage.getItem('token') }`, params: data }
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

export const setSelectedDashboard = (data) => {
  return dispatch => {
    dispatch({
      type: ActionTypes.SET_SELECTED_BI_DASHBOARD,
      payload: data
    })
  }
}

export const queueBiReports = (data) => {
  return axios.post(`${ reportUrl }/biTools/queueBiReports`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

export const getBiAttributes = () => {
  return axios.get(`${ reportUrl }/biTools/getBiAttributes`, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

export const makeBiReport = (data) => {
  return axios.post(`${ reportUrl }/biTools/makeBiReport`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  }).then(response => {
    return response.data
  }).catch(error => {
    return error
  })
}

export const setBiDisplay = (data) => {
  return dispatch => {
    dispatch({
      type: ActionTypes.SET_SELECTED_DISPLAY,
      payload: data
    })
  }
}

export const setDefaultDashboard = (data) => {
  return axios.put(`${ reportUrl }/biTools/setDefaultDashBoard`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  }).then(response => {
    return response
  }).catch(error => {
    return error.message
  })
}

export const deleteDashboard = (data) => {
  return axios.put(`${ reportUrl }/biTools/deleteSelectedDashboard`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  }).then(response => {
    return response
  }).catch(error => {
    return error.message
  })
}

export const deleteFiles = (data) => {
  return axios.post(`${ reportUrl }/biTools/deleteBiReport`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  }).then(response => {
    return response
  }).catch(error => {
    return error.message
  })
}

export const setCurrentBiWidget = (data) => {
  return dispatch => {
    dispatch({
      type: ActionTypes.SET_CURRENT_QUEUE_WIDGET,
      payload: data
    })
  }
}

export const changeDashboardName = (data) => {
  return axios.put(`${ reportUrl }/biTools/changeDashboardName`, data, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  }).then(response => {
    return response.data
  }).catch(error => {
    return error.message
  })
}

export async function searchDash(data, dashboardId) {
  try {
    const response = await axios.get(`${ reportUrl }/biTools/searchAll`, {
      headers: { Authorization: `${ localStorage.getItem('token') }` },
      params: {
        dateFilters: data,
        dashboardId
      }
    });
    return response?.data
  }
  catch (e) {
    return e;
  }
}

export const getWorkCodesCategories = () => {
  return axios.get(`${ reportUrl }/biTools/workCodeCategories`, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return Array.isArray(response?.data?.data) ? response?.data?.data : []
    })
    .catch(error => {
      console.log(error)
      return []
    })
}

export function getSipInterfaces() {
  return axios.get(`${ reportUrl }/biTools/sip_interfaces`, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return Array.isArray(response?.data?.data) ? response?.data?.data : []
    })
    .catch(error => {
      console.log(error)
      return []
    })
}

export function getQueues() {
  return axios.get(`${ reportUrl }/biTools/getQueues`, {
    headers: { Authorization: `${ localStorage.getItem('token') }` }
  })
    .then(response => {
      return Array.isArray(response?.data?.data) ? response?.data?.data : []
    })
    .catch(error => {
      console.log(error)
      return []
    })
}

