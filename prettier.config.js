/**  @type {import("prettier").Config} */
export default {
    printWidth: 120,
    overrides: [
        {
            files: ["*.css", "*.js", "*.ts"],
            options: {
                tabWidth: 4,
            },
        },
    ],
    htmlWhitespaceSensitivity: "strict",
};
