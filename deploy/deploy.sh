#!/bin/sh
ENVIRONMENT=$1

echo Start deploying to $ENVIRONMENT...
ansible-playbook -i env/$ENVIRONMENT/hosts release.yml --vault-password-file ./.vault_pass_$ENVIRONMENT
