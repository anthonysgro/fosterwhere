# Welcome to FosterWhere!

This is an application created as an aid for nonprofits, childcare 
agencies, and fostercare agencies to visualize and optimize their
employees' caseloads. Managers can import an excel file and see
how far their employees have to travel to meet all of their clients.

# Recent Features Added
- Now features several different transportation modes: driving, transit, bicycling, walking.
- Drag n' Drop Excel Files
- Default groupings now available to visualize current worker/client configuration
- Basic documentation on homepage
- Some error handling for bad server responses/bad input on the front end.

# To-Do
- If Google API responds with a "transportation mode not available for region", show user on error page.
- Cache all graphs so the app doesn't have to generate them each time a user clicks a new algorithm button.

# Startup Guide
-   **Easy Local Start-Up**
-   run `npm run start:dev` command
-   [go to development port 8000](http://localhost:8000)
-   have fun!

# Built With...
Node.JS, Express, React, Heroku, and Google APIs.
