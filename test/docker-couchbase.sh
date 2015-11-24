#!/bin/bash
set -ev

# Requires something like:
# export COUCHBASE="couchbase/server:community-3.0.1"

function try()
{
    [[ $- = *e* ]]; SAVED_OPT_E=$?
    set +e
}

function catch()
{
    export ex_code=$?
    (( $SAVED_OPT_E )) && set +e
    return $ex_code
}

docker pull $COUCHBASE

docker run --name CONTAINER -d -p 8091:8091 -p 8092:8092 -p 11207:11207 -p 11210:11210 $COUCHBASE

CONTAINER_IP=`docker inspect CONTAINER | grep -i IPAddress | awk -F: '{print $2}' |  grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b"`

while true; do
  try
  (
    docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
      server-info -c "$CONTAINER_IP:8091" -u Administrator -p password
  )
  catch || {
    sleep 3
    continue
  }
  break
done

if [ $COUCHBASE == 'couchbase/server:community-4.0.0' ]; then
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    cluster-init -c "$CONTAINER_IP:8091" -u Administrator -p password \
    --cluster-username=Administrator --cluster-password=password --cluster-ramsize=256 --services=data,index,query
fi

if [ $COUCHBASE == 'couchbase/server:community-3.0.1' ]; then
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    cluster-init -c "$CONTAINER_IP:8091" -u Administrator -p password \
    --cluster-username=Administrator --cluster-password=password --cluster-ramsize=256
fi

docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
  bucket-create -c "$CONTAINER_IP:8091" -u Administrator -p password \
  --bucket=default --bucket-type=couchbase --bucket-port=11211 --bucket-ramsize=256 --bucket-replica=1 --wait
