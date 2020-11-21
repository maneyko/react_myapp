#!/bin/sh

### BEGIN INIT INFO
# Provides:          react
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the react app server
# Description:       starts react using start-stop-daemon
### END INIT INFO

# This file should be linked to: /etc/init.d/react_myapp
# It should be called via: sudo service react_myapp restart

set -e

USAGE="Usage: $0 <start|stop|restart|upgrade|rotate|force-stop>"

# app settings
USER="maneyko"
APP_NAME="react_myapp"
APP_ROOT="/var/www/react_myapp"
ENV="production"

# environment settings
CMD="cd $APP_ROOT && npm start"

# make sure the app exists
cd $APP_ROOT || exit 1

app_start() {
  pgrep node && echo >&2 "Already running" && exit 0
  echo "Starting $APP_NAME"
  su - $USER -c "$CMD"
}

app_stop() {
  echo "Stopping $APP_NAME"
  pkill node || echo >&2 "Not running"
  sleep 1
}

case $1 in
  start)
    app_start
    ;;
  stop)
    app_stop
    ;;
  restart|reload|upgrade)
    app_stop
    app_start
    ;;
  *)
    echo >&2 $USAGE
    exit 1
    ;;
esac
