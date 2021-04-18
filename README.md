## Gardenist
<img src="https://media-exp1.licdn.com/dms/image/C562DAQEuIUK6EdzW2w/profile-treasury-image-shrink_1280_1280/0/1617812798093?e=1618855200&v=beta&t=oOd7xWG-B_UG6xL1qq-T8IQ4R4B78I6NhUmlZMl-5TM" alt="" />
Welcome to Gardenist! Where you can research different plants and save them in several named lists for easy reference later. A simple user account is required to save lists, but not required to search plant information.

#### Tech Stack:
- Backend = TDD, RESTful API, OOP, Node.js, Express.js, AJAX, Axios, JSDOM, JSON Web Tokens, Joi, Bcrypt, Posgres SQL, Jest, SuperTest
- Frontend = React.js, React-Router, Redux, Redux-Thunk, , AJAX, Axios, Formik, Yup, Material-UI

#### To run Backend:
- on a CLI window, navigate to the 'backend' folder
- run `npm install`
- run `npm run database`
- run `npm start`
##### Testing Backend
- On a CLI window, navigate to the 'backend' folder
- run `npm run database-test`
- run `npm test`

#### To run Frontend:
- on a CLI window, navigate to the 'backend' folder
- run `npm install`
- run `npm start`
- if window doesn't open automatically, navigate to [http://localhost:3000/](http://localhost:3000)


#### Test user
- Username: `test@test.com`
- Password: `password`


#### Frontend Routes
- http://localhost:3000 (/)
  - home, register and login page
  - authorization required: none
- http://localhost:3000/user (/user)
  - edit user profile
  - authorization required: same user logged in
- http://localhost:3000/lists (/lists)
  - all lists for user
  - authorization required: same user logged in
- http://localhost:3000/lists/<listId> (/lists/<listId>)
  - shows a specific list as per id (incremented integer)
  - authorization required: same user logged in
- http://localhost:3000/search (/search)
  - shows the search page where plant queries can be made
  - authorization required: none
- http://localhost:3000/search/<plantId> (/search/<plantId>)
  - shows a specific plant's details based on it's id (integer assigned by backend's source)
  - authorization required: none


#### Backend Routes
##### User Routes
- POST - http://localhost:3000/api/user/register (/api/user/register)
  - REGISTER NEW USER
  - JSON input: `{email, name, password}`
  - returns: `user`(email, name)`, token`(jwt-token)
  - authorization required: none
  - throws `BadRequestError` on email duplicates.
- POST - http://localhost:3000/api/user/login (/api/user/login)
  - LOGIN EXISTING USER
  - JSON input: `{email, password}`
  - returns: `{user`(email, name)`, token`(jwt-token)`, lists}`
  - authorization required: none
  - throws `UnauthorizedError` is user not found or wrong password
- PATCH - http://localhost:3000/api/user/edit (/api/user/edit)
  - UPDATE USER PROFILE
  - JSON input: `{ email, password, formData }`
    - where formData = `{email, name, password}`
  - returns: `{user`(email, name)`, token}`
  - authorization required: same user Bearer Token
  - throws `BadRequestError` if new email already exists or if invalid new entries given
  - throws `UnauthorizedError` if wrong email or password
- DELETE - http://localhost:3000/api/user/delete (/api/user/delete)
  - DELETE USER ACCOUNT
  - JSON Input: `{email, password}`
  - returns: `{deleted: email}`
  - authorization required: same user Bearer Token
  - throws `UnauthorizedError` if wrong password
  - throws `NotFoundError` if user not found
##### List Routes
- POST - http://localhost:3000/api/lists/new (/api/lists/new)
  - CREATE NEW LIST
  - JSON Input: `listName`
  - returns: `{list: {list_id, list_name}}`
  - authorization required: user Bearer Token
  - throws `BadRequestError` if list already exists
- POST - http://localhost:3000/api/lists/<listId>/<plantId> (/api/lists/<listId/<plantId>)
  - ADD SPECIFIC PLANT TO SPECIFIC LIST
  - URL String Input: `listId, plantId`
  - JSON Input: `common`
  - returns: `{list: {list_id, plant_id, common}`
  - authorization required: user Bearer Token
  - throws `BadRequestError` if missing input data or plant already in list
  - throws `NotFoundError` if list not found
 - DELETE - http://localhost:3000/api/lists/<listId>/<plantId>  (/api/lists/<listId>/<plantId>)
   - REMOVE SPECIFIC PLANT FROM SPECIFIC LIST
   - URL String Input: `listId, plantId`
   - returns: `{list: {list_id, plant_id}}`
   - authorization required: user Bearer Token
   - throws `BadRequestError` if plant not found
- DELETE - http://localhost:3000/api/lists/<listId>   (/api/lists/<listId>)
  - DELETE SPECIFIC LIST
  - URL String Input: `listId`
  - returns: `{list : {list_id}}`
  - authorization required: user Bearer Token
  - throws `BadRequestError` if list not found
##### Plant Routes
- GET - http://localhost:3000/api/plants/search (/api/plants/search)
  - SEARCH FOR PLANTS WITH A KEYWORD
  - query String Input: (`q`) 
    - where q is a query param name, spaces replaced with `%20`
  - returns: `[plantObjs]`
  - authorization required: none
- GET - http://localhost:3000/api/search/<plantId> (/api/search/<plantId>)
   - VIEW MORE DETAILS ON SPECIFIC PLANT
   - URL Input: `id`
   - returns: `{plantObj}`
   - authorization required: none
