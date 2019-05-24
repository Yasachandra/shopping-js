# shopping-js

The project in this repository (coded in pure JS only) showcases a shopping application having various recipes with following functionalities:
1. Making Http requests to https://www.food2fork.com/about/api to get recipe data based on the item entered by the user/.
2. Move between the list of recipes returned from the API using pagination.
3. Select a recipe and look at it's detailed view.
4. Ability to like or unlike a recipe and see the list of liked recipes in a menu.

# Usage
Clone the project & open CMD/Termminal in the cloned directory and give commands:

npm install

npm start

Open http://localhost:8080 in browser

It uses webpack-dev server to refresh the app automatically whenever we make some changes to it's code.
The project follows the MVC style design pattern.

If there are any errors during API requests then it means that the limit on the number of API requests for the particular key has been reached. To resolve this, register at https://www.food2fork.com and then find your API key in the dashboard at https://www.food2fork.com/about/api and then copy it inside "key" variable inside config.js file inside "src/js" folder
