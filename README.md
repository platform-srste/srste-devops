# srste-ci-cd
Pre-requisites/Assumptions - 
    1. Versioning API to get the next version for the given major release version 
    2. OOTB module mapping API to get the core modules and their repositories to clone 

Fresh Instance scenario - 

step 1 - Get the version number to build and deploy from versioning API 
step 2 - Go to srste-docker and create a new docker version by running the following command - 
    > docker build -t srste/srste:2.0.0 . 
step 3 - Run a container of the image built in step#2 
    > cd config
    > Update docker-compose.yml to reflect the right version of srste image built in step#2
    > docker run --service-ports impex2 
step 4 - Git clone all ootb modules to push default content to the container
    > cd /pratisrste     
    > git clone https://github.com/srste/core.git 
    > git clone https://github.com/srste/expense.git 
    > git clone https://github.com/srste/pos.git 
Step 4.1 - Clean up the cloned directory keeping only the changed contents 
    > Get last commit id from each repo in step#4
    > git diff --name-only main..origin/main > diff.log 
    > Iterate over the directory and remove all the files that are not included in diff.log 
step 5 - Import content to pratisrste 
    > npm run app-reset [app-name] [app-directory] 
    Example: npm run app-reset expense ./expense     
step 6 - Bundle the ootb content before pushing to container
    > npm run coreappbundle 
step 7 - Push ootb contents to the container that is ran in step#3
    > npm run push 192.168.0.101 8012 //Look for the IP and port number from docker-compose configuration in step#3 
    > npm run push-bundle 192.168.0.101 8012 
    > Update last commit id from each repo used in step#4 
Step 8 - Push ootb contents to registry 
    > cd /pratisrste 
    > docker build -t srste/srste_contents:2.0.0 . 
    > docker push srste/srste_contents:2.0.0 
Step 9 - Persist the updated database image into the container 
    Get container ID with the below command 
    > docker ps | grep srste/srste:2.0.0| awk '{ print $1 }' // 2.0.0 --> replace it with the version number 
    > docker exec -it <container-id>  grunt --port=3307 --host=192.168.0.101 dbdump
    > docker commit <container-id> srste/srste:2.0.0 
Step 10 - Push docker image to registry 
    > docker push srste/srste:2.0.0
Step 11 - Refresh caches from redis
    > cache/mmf.getSchemaData
    > reload_cache
    > cache/bundle_core
    > cache/bundle_debug_core 
Step 12 - Hard restart docker container 
    > docker-compose down -v
    > docker-compose run --service-ports impex2
Step 13 - Run Automation tests 
Step 14 - Publish results 

Upgrade Scenario - 

Step 1 - Download ootb contents from docker image       
    > docker run srste/srste_contents:2.0.0
Step 2 - Get docker container-id of ootb contents
    > docker ps | grep srste/srste:2.0.0| awk '{ print $1 }' // 2.0.0 --> replace it with the version number 
Step 3 - Download contents to pratisrste 
    > cd /pratisrste 
    > docker cp <container-id>:/path/to/contents ./contents 
Step 4 - Run pratisrste container and get the container-id
    > docker-compose up&
    > docker ps | grep srste/srste:2.0.0| awk '{ print $1 }' // 2.0.0 --> replace it with the version number 
Step 5 - Push ootb contents downloaded from step#3 to production instance of srste container 
    > docker cp ./contents <pratisrste-container-id>:/app/pratisrste/client 
Step 6 - Push ootb contents downloaded from step#3 to production instance of srste container 
    > docker exec -it <pratisrste-container-id> npm run push <production-node-ip> <production-node-port> 
    > docker exec -it <pratisrste-container-id> npm run push-bundle <production-node-ip> <production-node-port> 
Step 7 - Update production instance docker-compose.yml to reflect the latest version
Step 8 - Refresh caches from redis
    > cache/mmf.getSchemaData
    > reload_cache
    > cache/bundle_core
    > cache/bundle_debug_core
Step 9 - Hard restart docker container 
    > cd /srste
    > docker-compose down -v
    > docker-compose run --service-ports impex2
Step 10 - Run Automation tests 
Step 11 - Publish results

