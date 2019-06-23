#!/bin/bash
set -ev

# Require some environment variables. Examples:
# export COUCHBASE="couchbase/server:community-5.1.1"
# export COUCHBASE_USER="Administrator"
# export COUCHBASE_PASS="password"

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

CONTAINER_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' CONTAINER`

while true; do
  try
  (
    docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
      server-info -c "$CONTAINER_IP:8091" -u $COUCHBASE_USER -p $COUCHBASE_PASS
  )
  catch || {
    sleep 3
    continue
  }
  break
done

if [ $COUCHBASE == 'couchbase/server:community-5.1.1' ]; then
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    cluster-init -c "$CONTAINER_IP:8091" \
    --cluster-username=$COUCHBASE_USER --cluster-password=$COUCHBASE_PASS --cluster-ramsize=256 \
    --cluster-ramsize=512 --cluster-index-ramsize=256 --cluster-fts-ramsize=256 \
    --services=data,index,query,fts
fi

if [ $COUCHBASE == 'couchbase/server:community-4.0.0' ]; then
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    cluster-init -c "$CONTAINER_IP:8091" -u $COUCHBASE_USER -p $COUCHBASE_PASS \
    --cluster-username=$COUCHBASE_USER --cluster-password=$COUCHBASE_PASS --cluster-ramsize=256 \
    --services=data,index,query
fi

if [ $COUCHBASE == 'couchbase/server:community-3.0.1' ]; then
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    cluster-init -c "$CONTAINER_IP:8091" -u $COUCHBASE_USER -p $COUCHBASE_PASS \
    --cluster-username=$COUCHBASE_USER --cluster-password=$COUCHBASE_PASS --cluster-ramsize=256
fi

if [ $COUCHBASE == 'couchbase/server:community-5.1.1' ]; then
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    bucket-create -c "$CONTAINER_IP:8091" -u $COUCHBASE_USER -p $COUCHBASE_PASS \
    --bucket=test_bucket --bucket-type=couchbase --bucket-port=11222 \
    --bucket-ramsize=100 --bucket-replica=1 --enable-flush=1 --wait
else
  docker run --rm --entrypoint=/opt/couchbase/bin/couchbase-cli $COUCHBASE \
    bucket-create -c "$CONTAINER_IP:8091" -u $COUCHBASE_USER -p $COUCHBASE_PASS \
    --bucket=test_bucket --bucket-type=couchbase --bucket-port=11211 \
    --bucket-ramsize=100 --bucket-replica=1 --enable-flush=1 --wait
fi
