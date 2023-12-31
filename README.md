# Alterna-Canvas
This is an implementation of a gamified Canvas by Anusha Chitranshi, Nishil Faldu, Athulya Ganesh, and Emma Gardner.

To run this project on your machine, complete the following steps:
1. Clone/download the code in this repository.
2. Open a terminal and complete the following steps from within the root directory of the project.
   - Create a .env file containing the content that we have supplied to you. If you do not have this information, please request it from us.
   - Run `npm install` to install the necessary npm packages.
   - Run `npm run dev` to run the application in your localhost.
3. In a separate terminal, still in the root directory, run `npm install -g json-server` and then run `json-server --watch src/data/users.json --port 3030`.
   - If you receive an error stating `json-server cannot be loaded because running scripts is disabled on this system.`, try running the script in a different terminal type. Emma found that Git Bash and Command Prompt worked for her, while PowerShell and JavaScript Debug Terminal threw the aforementioned error.
5. Open the web app at the URL provided when you ran the `npm run dev` command (likely http://localhost:5173/). Alternatively, perform the above steps and navigate to alterna-canvas.vercel.app. 
