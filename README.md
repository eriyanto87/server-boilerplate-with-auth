# API Boilerplate with User Authentication

## Local dev setup

1. Clone the respository to your local machine `git clone BOILERPLATE URL PROJECT-NAME`
2. `cd` into cloned repo
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. `mv example.env .env`
   `createdb -U user project-name`
   `createdb -U user project-name-test`
   If user has a password be sure to set it in .env for all appropriate fields. Or if using a different user, update appropriately.
5. npm install
6. npm run migrate
7. `env DATABASE_URL=project-name-test npm run migrate`
   And npm test should work at this point
8. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "server-project-boilerplate-with-authentication",`

Configuring Postgres
For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

Locate the postgresql.conf file for your Postgres installation.
E.g. for an OS X, Homebrew install: /usr/local/var/postgres/postgresql.conf
E.g. on Windows, maybe: C:\Program Files\PostgreSQL\11.2\data\postgresql.conf
E.g on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
Find the timezone line and set it to UTC:

# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default' # Select the set of available time zone
Scripts
Start the application npm start

Start nodemon for the application npm run dev

Run the tests mode npm test

Run the migrations up npm run migrate

Run the migrations down npm run migrate -- 0

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
