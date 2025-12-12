
Prerequisites
- Node.js 18+ installed


Installation

1. Set up environment secret. Go to the .env file inside backend and change the enviroment secret to whatever you want:



2. Open two terminals, in the first one run the following
   ```bash
   sudo apt install sqlite3 libsqlite3-dev
   
   cd <your_path_to_backend>
   npm install
   nodejs index.js

   ```


3. On the second one run the following

   ```bash
   cd <your_path_to_frontend>
   npm install
   npm run dev
   ```



The application will be available at the localhost shown after running the "npm run dev" command. Example:

  VITE v7.2.7  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

  Here it is http://localhost:5173/

