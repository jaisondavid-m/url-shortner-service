import Code from "../components/Code.jsx"

export const gettingStarted = [
    {
        title: "Create an account",
        desc: (
            <>
                Register with your email or sign in instantly using{" "}
                <Code>Google OAuth</Code>. You'll need an account to create and
                manage links.
            </>
        ),
    },
    {
        title: "Shorten a URL",
        desc: (
            <>
                Paste any long URL on the Home page. Pick a tab -{" "}
                <Code>Random</Code> auto-generates a code, <code>Custom</code>{" "}
                lets you choose your own keyword - then Generate.
            </>
        ),
    },
    {
        title: "Copy and Share",
        desc: "Your short link is ready instantly. Copy it and share anywhere - anyone who visits it gets redirected to the original URL."
    },
    {
        title: "Manage your Links",
        desc: (
            <>
                Go to <Code>My URLs</Code> to see all your links, view click
                counts, copy or delete any of them at any time.
            </>
        )
    }
]