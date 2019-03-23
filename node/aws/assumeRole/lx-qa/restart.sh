#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export AWS_PROFILE="cbtn-ops-prod"
/bin/bash $DIR/stop.sh
/bin/bash $DIR/start.sh