import Elysia from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
const app = new Elysia()
    .use(html())
    .get("/", ({ html }) => html(
        <BaseHtml>
            <body class="flex w-full h-screen justify-center items-center">
                <button hx-post="/clicked" hx-swap="outerHTML">
                    Click me
                </button>
            </body>
        </BaseHtml >
    ))
    .post("/clicked", () => <div class="text-blue-600">I'm from the server!</div>)
    .listen(3000)

console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}/`);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nicholas Chang</title>
    <script src="https://unpkg.com/htmx.org@1.9.9" integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX" crossorigin="anonymous"></script>    </head>
    <script src="https://cdn.tailwindcss.com"></script>
    ${children}
`;