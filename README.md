
# Netflix Shows Data Visualization
## Project Description
This application provides an interactive visualization of Netflix shows and movies data. The main features include searching for titles, filtering by type (Movies or TV Shows), and filtering by release year. Users can also visualize the number of titles produced by different countries and explore the yearly production data.
The dataset used is a collection of Netflix titles, which includes information like title, type, director, cast, country, date added, release year, rating, duration, genres, and description. This dataset was chosen because it provides a lot of information about Netflix's content, which is suitable for generating insights about production trends and distributions.
The insights provided by this application include:
* Top producing countries for Netflix content.
* Yearly production trends for movies and TV shows.
* Detailed search results based on title, type, and release year.
## Core Technologies
- **Node.js**: A powerful JavaScript runtime used for building the backend of the application. It is chosen for its non-blocking, event-driven architecture, making it ideal for handling multiple requests efficiently.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Express is used to handle API requests and serve the application, offering simplicity and flexibility.
- **Elasticsearch**: A highly scalable open-source full-text search and analytics engine. It is used for storing and querying the Netflix titles data. Elasticsearch is chosen for its powerful search capabilities and the ability to perform complex aggregations.
- **Bonsai**: A hosted Elasticsearch service, providing ease of use, scalability, and reliability. Bonsai is used to manage the Elasticsearch cluster without worrying about infrastructure maintenance.
- **React.js**: A popular JavaScript library for building user interfaces, particularly single-page applications where data changes dynamically. React is used to build the frontend of the application, allowing for a modular and component-based architecture.
- **Chart.js**: A simple yet flexible JavaScript charting library for designers and developers. It is used to create interactive charts for visualizing data, chosen for its ease of use and extensive customization options.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces. Tailwind CSS is used for styling the application, providing a modern and responsive design with minimal effort.
- **Heroku**: A cloud platform as a service enabling developers to build, run, and operate applications entirely in the cloud. Heroku is used for deploying the application, chosen for its simplicity, scalability, and seamless integration with GitHub for continuous deployment.
## How to Use
It is pretty straightforward to use.
For the type distribution chart you can choose if you want to see a bar or line graph. You can see how many movies or tv-shows (or both) were produced each year and how the production rate has developed.
For the top countries graph you can see which countries that have produced most content on netflix.
For the search method you can filter in up to three ways. You can search for titles and if you write a letter wrong it should still give you suggestions similar to the title you searched for. You can also filter by type, if you only want to search for a movie or tv-show. And lastly if you are intrested in content produced a certain year you can also filter by release year.
## Link to the Deployed Application
[Netflix Shows Data Visualization](https://netflix-visualization-ddbaf3e0356b.herokuapp.com/)


