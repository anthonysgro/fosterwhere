# Welcome to FosterWhere!

<img width="367" alt="Screen Shot 2021-06-17 at 2 39 39 PM" src="https://user-images.githubusercontent.com/64649626/122454955-e0890280-cf79-11eb-9f5a-265b28791623.png">

This is an open-source application created as an aid for nonprofits, childcare 
agencies, and fostercare agencies to visualize and optimize their
employees' caseloads. Managers can import an excel file and see
how far their employees have to travel to meet all of their clients.

## How It Works
FosterWhere utilizes graph processing and optimization heuristics to generate efficient configurations of employees to family caseloads. Many of the algorithms rely on pairwise swapping between employees to reduce overall commute mean and standard deviation to produce both lower overall and more equitable commute times between the employees. 

When a user drops a valid excel file, the FosterWhere server will make a call to the Google Geocoding API to translate all addresses to latitude/longitude coordinates. Then, it will call the Google Directions API to get distances between all employees and all clients, seen below as the "weights" on each graph edge.

### Visualization
<img width="700" alt="graphExample" src="https://user-images.githubusercontent.com/64649626/122452734-9272ff80-cf77-11eb-91ce-514860d628ca.png">


The server will then send back a JSON object with all possible edges between each employee and client. The front-end then constructs a graph data structure from this object, and then uses the optimization heuristics to find the most optimal graph configuration it can find. Finally, the result is shown through a Google Maps API window with each employee and client color-coded by group for the user's convenience. From there, the user can select another optimization heuristic or manually re-arrange them to their liking.

### Front-End Map Page
<img width="700" alt="Screen Shot 2021-06-17 at 2 32 58 PM" src="https://user-images.githubusercontent.com/64649626/122454116-019d2380-cf79-11eb-9b8d-6be77d4ff2db.png">


## Recent Features Added
- Now features several different transportation modes: driving, transit, bicycling, walking.
- Drag n' Drop Excel Files
- Default groupings now available to visualize current worker/client configuration
- Basic documentation on homepage
- Some error handling for bad server responses/bad input on the front end.

## To-Do
- If Google API responds with a "transportation mode not available for region", show user on error page.
- Cache all graphs so the app doesn't have to generate them each time a user clicks a new algorithm button.

## Startup Dev Guide
-   **Easy Local Start-Up**
-   run `npm run start:dev` command
-   [go to development port 8000](http://localhost:8000)
-   You will have to create a `.env` file in the root directory with your own Google API Keys. You need to generate two: one each for the Google Geocoding API and Google Directions API. Additionally, you may have to change the Google Maps API key on the client. Please remember that you are responsible for your API keys, protect them with quotas and restrictions!

## Built With...
Node.js, Express, React, Heroku, and Google APIs.
