#!/bin/sh

### REDHAT chkconfig header
# chkconfig: - 58 74
# description: node-app is the script for starting a node app on boot.
### BEGIN INIT INFO
# Provides: node
# Required-Start:    $network $remote_fs $local_fs
# Required-Stop:     $network $remote_fs $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: start and stop node
# Description: Node process for app
### END INIT INFO

# user to run the app as
USER="johan"

# folder to run the app in (also PID_FILE and LOG_FILE will be here)
APP_DIR="/Users/johan/git/webehome_restufull_bin"

# node app name
NODE_APP="/usr/local/bin/node server.js"

# app parameters
NODE_APP_CONF=""

# DO NOT TOUCH UNDER
# ------------------

PID_FILE="$APP_DIR/app.pid"
LOG_FILE="$APP_DIR/app.log"
USAGE="Usage: $0 {start|stop|restart|status} [--force]"
FORCE_OP=false

pid_file_exists() {
    [ -f "$PID_FILE" ]
}

get_pid() {
    echo "$(cat "$PID_FILE")"
}

is_running() {
    PID=$(get_pid)
    ! [ -z "$(ps aux | awk '{print $2}' | grep "^$PID$")" ]
}

start_it() {
    echo "Starting $NODE_APP ..."
    echo "cd $APP_DIR && $NODE_APP $NODE_APP_CONF 1>$LOG_FILE 2>&1 & echo \$! > $PID_FILE" | sudo -i -u $USER
    echo "$NODE_APP started with pid $(get_pid)"
}

stop_process() {
    PID=$(get_pid)
    echo "Killing process $PID"
    pkill -P $PID
}

remove_pid_file() {
    echo "Removing pid file"
    rm -f "$PID_FILE"
}

start_app() {
    if pid_file_exists
    then
        if is_running
        then
            PID=$(get_pid)
            echo "$NODE_APP already running with pid $PID"
            exit 1
        else
            echo "$NODE_APP stopped, but pid file exists"
            if [ $FORCE_OP = true ]
            then
                echo "Forcing start anyways"
                remove_pid_file
                start_it
            fi
        fi
    else
        start_it
    fi
}

stop_app() {
    if pid_file_exists
    then
        if is_running
        then
            echo "Stopping $NODE_APP ..."
            stop_process
            remove_pid_file
            echo "$NODE_APP stopped"
        else
            echo "$NODE_APP already stopped, but pid file exists"
            if [ $FORCE_OP = true ]
            then
                echo "Forcing stop anyways ..."
                remove_pid_file
                echo "$NODE_APP stopped"
            else
                exit 1
            fi
        fi
    else
        echo "$NODE_APP already stopped, pid file does not exist"
        exit 1
    fi
}

status_app() {
    if pid_file_exists
    then
        if is_running
        then
            PID=$(get_pid)
            echo "$NODE_APP running with pid $PID"
        else
            echo "$NODE_APP stopped, but pid file exists"
        fi
    else
        echo "$NODE_APP stopped"
    fi
}

case "$2" in
    --force)
        FORCE_OP=true
    ;;

    "")
    ;;

    *)
        echo $USAGE
        exit 1
    ;;
esac

case "$1" in
    start)
        start_app
    ;;

    stop)
        stop_app
    ;;

    restart)
        stop_app
        start_app
    ;;

    status)
        status_app
    ;;

    *)
        echo $USAGE
        exit 1
    ;;
esac
