import Code from "../components/Code.jsx"

export const flows = {
    basic: [
        {
            title: "Go to Home",
            desc: (
                <>
                    Select the <Code>Random</Code> tab - it's the default.
                </>
            ),
        },
        {
            title: "Paste your URL",
            desc: "Drop the long URL into the input field",
        },
        {
            title: "Click Generate",
            desc: "A unique short code is created automatically. Copy your new link and share it."
        }
    ],
    custom: [
        {
            title: "Switch to the Custom Tab",
            desc: (
                <>
                    The URL includes <Code>?tab=custom</Code> so this view is
                    bookmarkable.
                </>
            ),
        },
        {
            title: "Type your keyword",
            desc: (
                <>
                    The app checks in real time whether your code is available
                    and shows <Code>Available</Code> or{" "}
                    <Code>Already Taken</Code>
                </>
            ),
        },
        {
            title: "Generate",
            desc: "Submits only when the code is confirmed free. Your custom URL is ready."
        }
    ],
    protected: [
        {
            title: "On the Random tab, enable Password Protect",
            desc: "Check the password toggle that appears below the URL input",
        },
        {
            title: "Enter a password",
            desc: "It's hashed with bcrypt before being stored - plain-text is never saved."
        },
        {
            title: "Share the link",
            desc: "Visitors will see an unlock form and must enter the correct password before being redirected."
        },
    ],
    terminal: null,
}
