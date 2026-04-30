import React, { useState, useRef, useEffect } from "react"
import api from "../api/axios.js"

const HELP_TEXT = `
available commands:
    shorten <url>                       generate a random short link
    shorten <url> --pass <password>     generate a password-protected short link
    custom <url> <code>                 create a custom short link
    check <code>                        check if a short code is available or not
    expand <short-url>                  expand a short URL to its original URL
    clear                               clear the terminal
    help                                show this message
`.trim()

function Terminal() {

    const [lines, setLines] = useState([
        { text: "url shortener termial v1.0", type: "info" },
        { text: "type 'help' to see available commands.", type: "muted" },
        { text: "", type: "out" },
    ])

    const [input, setInput] = useState("")
    const [history, setHistory] = useState([])
    const [histIdx, setHistIdx] = useState(-1)
    const [loading, setLoading] = useState(false)

    const outputRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
    }, [lines])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const print = (text, type = "out") => {
        setLines((prev) => [...prev, { text, type }])
    }

    const printBatch = (entries) => {
        setLines((prev) => [...prev, ...entries])
    }

    const runCommand = async (raw) => {

        const trimmed = raw.trim()

        if (!trimmed) return

        const parts = trimmed.split(/\s+/)
        const cmd = parts[0].toLowerCase()

        setLines((prev) => [...prev, { text: `~/urlshort $ ${trimmed}`, type: "prompt" }])

        setHistory((prev) => [trimmed, ...prev])
        setHistIdx(-1)

        if (cmd === "help") {

            const helpLines = HELP_TEXT.split("\n").map((line, i) => ({
                text: line,
                type: i === 0 ? "info" : "out"
            }))
            setLines((prev) => [...prev, ...helpLines])
            return
        }

        if (cmd === "clear" || cmd === "cls") {
            setLines([])
            return
        }

        if (cmd === "shorten") {
            const url = parts[1]
            if (!url) {
                print("usage: shorten <url> [--pass <password>]", "err")
                return
            }
            const passIdx = parts.indexOf("--pass")
            const password = passIdx !== -1 ? parts[passIdx + 1] : null

            print("Generating short link...", "muted")
            setLoading(true)
            try {
                let res
                if (password) {
                    res = await api.post("/protected", {
                        original_url: url,
                        password
                    })
                } else {
                    res = await api.post("/shorten", {
                        original_url: url,
                    })
                }
                printBatch([
                    { text: "short url: " + res.data.short_url, type: "url" },
                    ...(password ? [{ text: "protected with password", type: "success" }] : []),
                    { text: "done.", type: "success" },
                ])
            } catch (err) {
                print("error: " + (err?.response?.data?.message || "Failed to shorten URL"), "err")
            }
            setLoading(false)
            return
        }

        if (cmd === "custom") {
            const url = parts[1]
            const code = parts[2]
            if (!url || !code) {
                print("usage: custom <url> <code>", "err")
                return
            }
            print("Creating custom link...", "muted")
            setLoading(true)
            try {
                const res = await api.post("/shorten/custom", {
                    original_url: url,
                    custom_code: code,
                })
                printBatch([
                    { text: "short url: " + res.data.short_url, type: "url" },
                    { text: "done.", type: "success" }
                ])
            } catch (err) {
                print("error: " + (err?.response?.data?.message || "Failed to create custom link"), "err")
            }
            setLoading(false)
            return
        }

        if (cmd === "check") {
            const code = parts[1]
            if (!code) {
                print("usage: check <code>", "err")
                return
            }
            print("Checking availabilty...", "muted")
            setLoading(true)
            try {
                const res = await api.get(`/shortcode/${code}/check`)
                if (res.data.exists) {
                    print(`"${code}" is already taken`, "err")
                } else {
                    print(`"${code}" is available`, "success")
                }
            } catch (err) {
                print("error: " + (err?.response?.data?.message || "Failed to check code"), "err")
            }
            setLoading(false)
            return
        }

        if (cmd === "expand") {
            const url = parts[1]
            if (!url) {
                print("usage: expand <short-url>", "err")
                return
            }
            print("expanding...", "muted")
            setLoading(true)
            try {
                const res = await api.get("/expand", { params: { url } })
                printBatch([
                    { text: "original: " + res.data.original, type: "muted" },
                    { text: "final:    " + res.data.final, type: "url" },
                    { text: "done.", type: "success" },
                ])
            } catch (err) {
                print("error: " + (err?.response?.data?.message || "Failed to expand URL"), "err")
            }
            setLoading(false)
            return
        }
        print(`command not found: ${cmd}. type 'help' for commands.`, "err")
    }
    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            const val = input
            setInput("")
            await runCommand(val)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setHistIdx((prev) => {
                const next = Math.min(prev + 1, history.length - 1)
                if (history[next] !== undefined) setInput(history[next])
                return next
            })
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            setHistIdx((prev) => {
                const next = prev - 1
                if (next < 0) {
                    setInput("")
                    return -1
                }
                if (history[next] !== undefined)
                    setInput(history[next])
                return next
            })
        }
    }
    const typeColor = {
        prompt: "#7ec8a0",
        out: "#d4d4d4",
        err: "#f87171",
        info: "#60a5fa",
        success: "#4ade80",
        url: "#fbbf24",
        muted: "#666",
    }
    return (
        <div
            onClick={(e) =>{
                if(e.target === e.currentTarget){
                    inputRef.current?.focus()
                }
            }}
            style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                border: "0.5px solid #333",
                fontFamily: "monospace",
                display: "flex",
                flexDirection: "column",
                minHeight: "460px",
                overflow: "hidden",
                cursor: "text",
                userSelect: "text",
                WebkitUserSelect: "text"
            }}
        >
            <div
                style={{
                    background: "#2a2a2a",
                    padding: "10px 16px",
                    display:"flex",
                    alignItems:"center",
                    gap: "8px",
                    borderBottom: "0.5px solid #333"
                }}
            >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ color: "#888", fontSize: 13, marginLeft: 8 }}>
                   url-shortener - terminal 
                </span>
            </div>
            <div
                ref={outputRef}
                style={{
                    flex:1,
                    padding: "16px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    maxHeight: "380px",
                }}
            >
                {lines.map((line,i) => (
                    <div
                        key={i}
                        style={{
                            fontSize: 13,
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            color: typeColor[line.type] || "#d4d4d3"
                        }}
                    >
                        {line.text || "\u00A0"}
                    </div>
                ))}
                {loading && (
                    <div style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>
                        waiting for response...
                    </div>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderTop: "0.5px solid #333",
                    gap: "8px",
                    background: "#1a1a1a"
                }}
            >
                <span style={{ color: "#7ec8a0", fontSize: 13, whiteSpace: "nowrap" }}>
                    ~/urlshort $
                </span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    autoComplete="off"
                    spellCheck={false}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#d4d4d4",
                        fontFamily: "monospace",
                        fontSize: 13,
                        caretColor: "#7ec8a0"
                    }}
                    placeholder={loading ? "" : "type a command..."}
                />
            </div>
        </div>
    )
}

export default Terminal