export const biReportsBus = {
  on(event, callback) {
    const handler = (e) => {callback(e)}

    const previousFunction = !!window['BiEventFunction'] ? window['BiEventFunction'] : []

    window['BiEventFunction'] = [...previousFunction , handler]

    document.addEventListener(event, handler)
  },
  emit(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }))
  }
}

export const editWidgetBus = {
  on(event, callback) {

    const handler = (e) => {callback(e)}

    const previousFunction = !!window['BiEditFunction'] ? window['BiEditFunction'] : []

    window['BiEditFunction'] = [...previousFunction , handler]

    document.addEventListener(event, handler)
  },
  emit(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }))
  }
}