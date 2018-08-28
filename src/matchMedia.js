/**
 * This is a modification of https://github.com/ncochard/matchmediaquery/blob/v0.2.1/index.js
 * to allow target window object to be passed in, so matchMedia measures the iframe's window when this is being called inside an iframe.
 */

import { match as staticMatch } from 'css-mediaquery'

// our fake MediaQueryList
function Mql(targetWindow, query, values) {
  const currentWindow = targetWindow || window
  const self = this
  let mql
  if (currentWindow && currentWindow.matchMedia) {
    mql = currentWindow.matchMedia.call(currentWindow, query)
    this.matches = mql.matches
    this.media = mql.media
    mql.addListener(update)
  } else {
    this.matches = staticMatch(query, values)
    this.media = query
  }

  this.addListener = addListener
  this.removeListener = removeListener
  this.dispose = dispose

  function addListener(listener) {
    if (mql) {
      mql.addListener(listener)
    }
  }

  function removeListener(listener) {
    if (mql) {
      mql.removeListener(listener)
    }
  }

  // update ourselves!
  function update(evt) {
    self.matches = evt.matches
    self.media = evt.media
  }

  function dispose() {
    if (mql) {
      mql.removeListener(update)
    }
  }
}

function matchMedia(targetWindow, query, values) {
  return new Mql(targetWindow, query, values)
}

module.exports = matchMedia
