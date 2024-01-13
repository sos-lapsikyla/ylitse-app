#!/usr/bin/env bash

# exit on first error
set -e

tee config.json > /dev/null <<EOF
{
    "baseUrl": "$YLITSE_BASEURL",
    "loginUrl": "$YLITSE_LOGINURL",
    "feedBackUrl": "$YLITSE_FEEDBACKURL",
    "termsUrl": "$YLITSE_TERMSURL",
    "userGuideUrl": "$YLITSE_USERGUIDEURL",
    "apuuUrl": "$YLITSE_APUUURL",
    "sekasinUrl": "$YLITSE_SEKASINURL",
    "messageFetchDelay": $YLITSE_MESSAGEFETCHDELAY
}
EOF
