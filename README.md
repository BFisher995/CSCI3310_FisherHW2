# CSCI3310_FisherHW2
Ben's Kitchen — Recipe Site

A multi-page recipe web application built with Express.js, EJS, MySQL, and client-side JavaScript.

Setup Instructions

Prerequisites
- Node.js (v14+)
- MySQL 8.0

1. Clone the repository
git clone <your-repo-url>
cd recipe-site


2. Install dependencies
npm install

3. Set up the database
1. Open MySQL Workbench and connect to your local instance
2. Open the `schema.sql` file (File → Open SQL Script)
3. Run the entire script (lightning bolt ⚡ button)
4. This will create the `recipes_db` database, all tables, and insert the sample data

4. Configure your database password
Open db.js and add your MySQL root password

5. Run the app
node app.js

Then open your browser to: http://localhost:3000