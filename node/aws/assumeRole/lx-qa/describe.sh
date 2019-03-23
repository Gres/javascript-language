#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export AWS_PROFILE="cbtn-ops-prod"
node $DIR/stepFunctions/describe/describeStepFunctionExecution.js