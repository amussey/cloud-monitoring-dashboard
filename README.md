# Cloud Monitoring Dashboard

A dashboard for Rackspace's Cloud Monitoring.   See the statuses of the alerts on all of your cloud properties.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/amussey/cloud-monitoring-dashboard)

![](https://raw.githubusercontent.com/amussey/cloud-monitoring-dashboard/master/static/images/screenshot-dashboard.png)

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
