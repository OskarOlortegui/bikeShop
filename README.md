npm init -y
npm install json-server

// https://www.npmjs.com/package/json-server
*  terminal: npm i json-server
*  terminal: json-server --watch data/db.json --port 8000
*   otherwise the default port will be 3000


DO NOT USE
  LIVE SERVER VS-Code Extension.
  When you make a POST or DELETE request, Live server will automatically refresh the page
  making the "e.preventDefault()" useless
  So after downloading this project. go to "views" folder
  make a right click to "shop.html" and "open with" and choose
  the borwser of your preference.
