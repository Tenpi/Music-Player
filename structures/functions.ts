import playTiny from "../assets/icons/playTiny.png"
import playTinyHover from "../assets/icons/playTiny-hover.png"
import pauseTiny from "../assets/icons/pauseTiny.png"
import pauseTinyHover from "../assets/icons/pauseTiny-hover.png"
import fs from "fs"
import path from "path"

const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac", ".mid"]

export default class Functions {
    public static arrayIncludes = (str: string, arr: string[]) => {
        for (let i = 0; i < arr.length; i++) {
            if (str.includes(arr[i])) return true
        }
        return false
    }

    public static arrayRemove = <T>(arr: T[], val: T) => {
        return arr.filter((item) => item !== val)
    }

    public static findDupe = (recent: any[], info: any) => {
        for (let i = recent.length - 1; i >= 0; i--) {
            if (recent[i].midi) {
                if (recent[i].bpm === info.bpm
                    && recent[i].songName === info.songName
                    && recent[i].duration === info.duration) return i
            } else {
                if (recent[i].songUrl === info.songUrl
                    && recent[i].songName === info.songName
                    && recent[i].duration === info.duration) return i
            }
        }
        return -1
    }

    public static timeout = async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public static removeDirectory = (dir: string) => {
        if (!fs.existsSync(dir)) return
        fs.readdirSync(dir).forEach((file: string) => {
            const current = path.join(dir, file)
            if (fs.lstatSync(current).isDirectory()) {
                Functions.removeDirectory(current)
            } else {
                fs.unlinkSync(current)
            }
        })
        try {
            fs.rmdirSync(dir)
        } catch (e) {
            console.log(e)
        }
    }

    public static logSlider = (position: number) => {
        const minPos = 0
        const maxPos = 1
        const minValue = Math.log(60)
        const maxValue = Math.log(100)
        const scale = (maxValue - minValue) / (maxPos - minPos)
        const value = Math.exp(minValue + scale * (position - minPos))
        let adjusted = value - 100
        if (adjusted > 0) adjusted = 0
        return adjusted
    }

    public static logSlider2 = (position: number, min: number, max: number) => {
        const minPos = 0
        const maxPos = 100
        const minValue = Math.log(min)
        const maxValue = Math.log(max)
        const scale = (maxValue - minValue) / (maxPos - minPos)
        const value = Math.exp(minValue + scale * (position - minPos))
        console.log(value)
        return value
    }

    public static formatSeconds = (duration: number) => {
        let seconds = Math.floor(duration % 60) as any
        let minutes = Math.floor((duration / 60) % 60) as any
        let hours = Math.floor((duration / (60 * 60)) % 24) as any
        if (Number.isNaN(seconds) || seconds < 0) seconds = 0
        if (Number.isNaN(minutes) || minutes < 0) minutes = 0
        if (Number.isNaN(hours) || hours < 0) hours = 0

        hours = (hours === 0) ? "" : ((hours < 10) ? "0" + hours + ":" : hours + ":")
        minutes = hours && (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds
        return `${hours}${minutes}:${seconds}`
    }

    public static decodeEntities(encodedString: string) {
        const regex = /&(nbsp|amp|quot|lt|gt);/g
        const translate = {
            nbsp:" ",
            amp : "&",
            quot: "\"",
            lt  : "<",
            gt  : ">"
        } as any
        return encodedString.replace(regex, function(match, entity) {
            return translate[entity]
        }).replace(/&#(\d+);/gi, function(match, numStr) {
            const num = parseInt(numStr, 10)
            return String.fromCharCode(num)
        })
    }

    public static round = (value: number, step?: number) => {
        if (!step) step = 1.0
        const inverse = 1.0 / step
        return Math.round(value * inverse) / inverse
    }

    public static streamToBuffer = async (stream: NodeJS.ReadableStream) => {
        const chunks: any[] = []
        const arr = await new Promise<Buffer>((resolve, reject) => {
          stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
          stream.on("error", (err) => reject(err))
          stream.on("end", () => resolve(Buffer.concat(chunks)))
        })
        return arr.buffer
    }

    public static getFile = async (filepath: string) => {
        const blob = await fetch(filepath).then((r) => r.blob())
        const name = path.basename(filepath).replace(".mp3", "").replace(".wav", "").replace(".flac", "").replace(".ogg", "")
        // @ts-ignore
        blob.lastModifiedDate = new Date()
        // @ts-ignore
        blob.name = name
        return blob as File
    }

    public static flipPlayTitle = () => {
        const button = document.querySelector(".title-bar-button.play-title-button") as HTMLImageElement
        const name = path.basename(button?.src ?? "")
        if (name.includes("hover")) {
            if (name.includes("play")) {
                button.src = pauseTinyHover
            } else {
                button.src = playTinyHover
            }
        } else {
            if (name.includes("play")) {
                button.src = pauseTiny
            } else {
                button.src = playTiny
            }
        }
    }

    public static getSortedFiles = async (dir: string) => {
        const files = await fs.promises.readdir(dir)
        return files
            .filter((f) => audioExtensions.includes(path.extname(f)))
            .map(fileName => ({
                name: fileName,
                time: fs.statSync(`${dir}/${fileName}`).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time)
            .map(file => file.name)
    }

    public static transposeNote = (note: string, transpose: number) => {
        const octave = Number(note.match(/\d+/)?.[0])
        note = note.replace(/\d+/g, "")
        const octaveAdjustment = Math.round(transpose / 12)
        const noteAdjustment = transpose - (octaveAdjustment * 12)
        const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
        const noteIndex = notes.findIndex((n) => n === note)
        let adjusted = noteIndex + noteAdjustment
        while (adjusted > 12) adjusted -= 12
        while (adjusted < 0) adjusted += 12
        return `${notes[adjusted]}${octave + octaveAdjustment}`
    }

    public static noteFactor = (scaleFactor: number) => {
        if (scaleFactor === 1) return 0
        if (scaleFactor < 1) {
            return Math.round(-1 * ((1 / scaleFactor) * 6))
        } else {
            return Math.round(scaleFactor * 6)
        }
    }

    public static escapeQuotes = (str: string) => {
        return str.replace(/"/g, `"\\""`).replace(/'/g, `'\\''`)
    }
}
