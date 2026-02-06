export const dispatchEvent = (element: any, event: any): void => {
  element.dispatchEvent(event)

  // Also invoke direct on* handler if set (e.g. element.onclick = function(){})
  const handlerName = `on${event.type}`
  if (typeof element[handlerName] === 'function') {
    element[handlerName](event)
  }
}
