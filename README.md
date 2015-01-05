# Cloud Monitoring Dashboard

A dashboard for Rackspace's Cloud Monitoring.   See the statuses of the alerts on all of your cloud properties.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/amussey/cloud-monitoring-dashboard)

![](https://raw.githubusercontent.com/amussey/cloud-monitoring-dashboard/master/static/images/screenshot-dashboard.png)


## API (v1)

The v1 API is accessible at `<Your Dashboard URL>/api/v1/`.  The following calls can be made against the API:

| Call | Method | Parameters | Description |
|------|--------|--------|--------|
| `/accounts`            | `GET`    |                                          | List the accounts currently on the dashboard. |
| `/accounts`            | `POST`   | `username`, `apikey`, `alias` (optional) | Add a new account to the dashboard. |
| `/accounts`            | `DELETE` | `username` or `apikey`                   | Remove an account from the dashboard. |
| `/auth`                | `GET`    |                                          | Retrieve the authentication status of all users.  Refreshes the auth information if it is out of date. |
| `/auth/<username>`     | `GET`    |                                          | Retrieve the authentication status of a particular user.  Refreshes the auth information if it is out of date. |
| `/monitors`            | `GET`    | `fast` (pull the response from the Redis cache) | Retrieve all of the configured Cloud Monitoring alerts. |
| `/monitors/<username>` | `GET`    | `fast` (pull the response from the Redis cache) | Retrieve all of the configured Cloud Monitoring alerts for a particular user. |
| `/monitors/<username>/<server id>`| `GET`                                    | Retrieve detailed information about the Cloud Monitoring alerts for a particular server. |
| `/filters`             | `GET`    |                                          | List the filters currently on the dashboard. |
| `/filters`             | `POST`   | `filter`                                 | Add a new filter to the dashboard. |
| `/filters`             | `DELETE` | `filter`                                 | Remove a filter from the dashboard. |


## Authentication

The Cloud Monitoring dashboard supports basic HTTP authentication.  To enable this, [generate an `.htpasswd` file](http://httpd.apache.org/docs/2.2/programs/htpasswd.html) and add it to your repo.  After deploying to Heroku, run the command:

```
heroku config:set HTPASSWD="Your .htpasswd filename"
```

Authentication will then be enabled.

To disable authentication, run the command:

```
heroku config:unset HTPASSWD
```


## Launching on Heroku

```bash
# Pull the Cloud Monitoring Dashboard repo.
git clone https://github.com/amussey/cloud-monitoring-dashboard
cd cloud-monitoring-dashboard

# Login to your Heroku account.
heroku login

# Create a new Heroku app.
heroku create

# Install the required Redis backend
heroku addons:add rediscloud

# Push the app to Heroku.
git push heroku master

# Make sure that the webapp is up and scaled correctly.
heroku ps:scale web=1

# Open your Dashboard!
heroku open
```
