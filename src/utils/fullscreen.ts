export function cancelFullScreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen()
  }

  if (typeof window.ActiveXObject !== 'undefined') {
    // Older IE.
    const wscript = new window.ActiveXObject('WScript.Shell')
    if (wscript !== null) {
      wscript.SendKeys('{F11}')
    }
  }
}

export function requestFullScreen(el) {
  // Supports most browsers and their versions.
  const requestMethod =
    el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(el)
  } else if (typeof window.ActiveXObject !== 'undefined') {
    // Older IE.
    const wscript = new window.ActiveXObject('WScript.Shell')
    if (wscript !== null) {
      wscript.SendKeys('{F11}')
    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @returns {boolean} isInFullScreen
 */
export default function fullScreen(el: HTMLElement) {
  if (!el) {
    el = document.body // Make the body go full screen.
  }
  const isInFullScreen = document.fullscreenElement && document.fullscreenElement !== null

  if (isInFullScreen) {
    cancelFullScreen()
  } else {
    requestFullScreen(el)
  }

  return isInFullScreen
}
