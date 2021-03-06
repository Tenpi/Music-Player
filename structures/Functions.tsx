export default class Functions {
  /** Promise SetTimeout */
  public static timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /** Gets the browser a user is using */
  public static getBrowser = () => {
    // @ts-ignore Not in types
    const Opera = (!!window["opr"] && !!opr.addons) || !!window["opera"] || navigator.userAgent.indexOf(" OPR/") >= 0
    // @ts-ignore Not in types
    const Firefox = typeof InstallTrigger !== "undefined"
    // @ts-ignore Not in types
    const Safari = /constructor/i.test(window.HTMLElement as unknown as string) || (function (p) {return p.toString() === "[object SafariRemoteNotification]" })(!window["safari"] || (typeof safari !== "undefined" && safari.pushNotification))
    const IE = false || !!document["documentMode"]
    const Edge = !IE && !!window.StyleMedia
    const Chrome = !!window["chrome"] && (!!window["chrome"].webstore || !!window["chrome"].runtime)
    return {Opera, Firefox, Safari, IE, Edge, Chrome}
  }

  /** Prevent double click selection */
  public static preventDoubleClick = () => {
    document.addEventListener("mousedown", (event) => {
      if (event.detail > 1) {
        event.preventDefault()
      }
    }, false)
  }

  /** Log Slider */
  public static logSlider = (position: number, minValue: number, maxValue: number) => {
    const minPos = 0
    const maxPos = 1
    const originalMin = minValue
    minValue = Math.log(minValue)
    maxValue = Math.log(maxValue)
    const scale = (minValue-maxValue) / (maxPos-minPos)
    const formula = Number(Math.exp(maxValue + scale*(position-minPos)).toFixed(2))
    return formula*-1 + originalMin
  }

  /** Format Seconds */
  public static formatSeconds = (duration: number) => {
    let seconds = Math.floor(duration % 60) as any
    let minutes = Math.floor((duration / 60) % 60) as any
    let hours = Math.floor((duration / (60 * 60)) % 24) as any
    if (Number.isNaN(seconds)) seconds = 0
    if (Number.isNaN(minutes)) minutes = 0
    if (Number.isNaN(hours)) hours = 0

    hours = (hours === 0) ? "" : ((hours < 10) ? "0" + hours + ":" : hours + ":")
    minutes = hours && (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds
    return `${hours}${minutes}:${seconds}`
  }

  /* Decode HTML entities */
  public static decodeEntities(encodedString: string) {
    const regex = /&(nbsp|amp|quot|lt|gt);/g
    const translate = {
        nbsp:" ",
        amp : "&",
        quot: "\"",
        lt  : "<",
        gt  : ">"
    }
    return encodedString.replace(regex, function(match, entity) {
        return translate[entity]
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        const num = parseInt(numStr, 10)
        return String.fromCharCode(num)
    })
  }

  /* Round to nearest number */
  public static round = (value: number, step?: number) => {
    if (!step) step = 1.0
    const inverse = 1.0 / step
    return Math.round(value * inverse) / inverse
  }

  /** Prevent image dragging */
  public static preventDragging = () => {
    document.querySelectorAll("img").forEach((img) => {
      img.draggable = false
    })
  }
}