# Project: Deploy a Three-Tier application to The Cloud

## Introduction
This is my final project for the She Code Africa Cloud School(Cohort 2). <br>

This application is a face-detection app based off of the AI/ML [Clarifai API](https://www.clarifai.com/models/ai-face-detection). The application allows users to upload images of audiences in an event/meeting and record the audience count. 

## Application Architecture
![Application Architecture](/assets/images/app-str.png)

This application is a three-tier application, with the frontend and the backend split into two repositories:  
* The frontend is in [this repository](https://github.com/Z11mm/sca-project-c2-app), while
* The backend is this current repository.
### Backend architecture
The backend is made up of the API and the database. 
1. API <br>
The api routes are in the `routes.js` file, with the route handlers in the `/controllers` directory. <br>
The server entrypoint is `index.js`, with the server setup in `server.js`.<br>
Configure environment and environment variables in `.env` files and `config.js`, with different `.env` files created for dev and testing environments. Use the [dotenv-flow](https://www.npmjs.com/package/dotenv-flow) package.

2. Database - PostgreSQL <br>
The database is made up of three tables - `users`, `login` and `meetings`. Sql scripts to create the database tables and populate the tables with dummy data are in the `/postgres` directory.

## Development Environment
In the project directory, run: <br>

* `docker-compose -f docker-compose.yml up` to spin up a development environment(add the `--build` flag when you run the command for the first time or you add new dependencies). This will create an api container and a database container.

## Testing Environment
* Integration tests are written using Jest, Chai and Supertest, within the `/__tests__` directory. <br>

In the project directory, run: <br>

* `npm run test-script` to launch a local test environment. This runs a bash script defined in `/bin/test.sh`.

## Production Environment
* Run `docker-compose -f docker-compose-prod.yml build` to create a production-ready image for the api. <br>
Use a managed database service in production.

## Deployment Architecture
![Deployment Architecture](/assets/images/deploy-str.png)

Deploy the frontend and api on the same GKE cluster while using GCP-managed Cloud SQL database service.

* Frontend deployment (`react_deployment.yml`) <br>
    * Deploy the React frontend with a Load Balancer service to make it accessible over the public internet. <br>

    * Configure Nginx as a reverse proxy to direct traffic to the API. <br>

    * Enable Zero Downtime Deployment with a rolling update strategy in Kubernetes. <br>

* API deployment <br>

    * Create Secrets for database credentials and service accounts for IAM authentication to Cloud SQL. <br>

    * Deploy the API with a ClusterIP service which will ensure it is not accessible over the internet. <br>

    * The `service-acc-key.yml` file is the service account credentials required for the GKE cluster to access the Cloud SQL database. Deploy this file before `api_deployment.yml`<br>

    * The `api_deployment.yml` deployment file contains the Kubernetes objects- Secrets, Service and Deployment - required for this application for easy readability. The order of deployment is Secrets, Service and then Deployment. <br>   

    * Enable Zero Downtime Deployment with a rolling update strategy in Kubernetes. <br>


* Database deployment
    * Setup Postgres on Cloud SQL instance.
    * Use Cloud SQL Auth Proxy for secure access to Cloud SQL instance without the need for authorized networks or  
for configuring SSL.
    * Setup Cloud SQL Auth Proxy as a 'sidecar', to run as a container within the pod running the API container. 


## Infrastructure Provisioning

![Provision infrastructure in GCP using Terraform](/assets/images/infra-provision.png)

Provision infrastructure in GCP using Terraform. Infrastructure for this project include:
* VPC network
* Firewall rules
* Google Compute Engine VM instances
* Google Kubernetes Engine Cluster
* Cloud SQL Instance for Postgres
* Remote backend

Check out the infrastructure-as-code configuration for this project in this [repo](https://github.com/Z11mm/sca-project-c2-iac)

## Configuration Management with Ansible

![Configure Jenkins](/assets/images/jenkins-config.png)

Install Ansible in one of the two VM instances provisioned with Terraform. Then, install and configure Jenkins for this project using Ansible.

To install Ansible, follow these steps:
* Access the Ansible VM instance using ssh:
    - `gcloud compute ssh <ansible-server-name>`
* Generate SSH keys:
    - `ssh-keygen`
* Copy the public key:
    - `sudo cat ~/.ssh/id_rsa.pub`
* Access the Jenkins VM instance using ssh. 
* Paste the public key within `~/.ssh/authorized_keys` folder:
    - `sudo vi /home/<username>/.ssh/authorized_keys`
* Confirm connection between the two instances:
    - `ssh <jenkins-instance-ip-address>`
* Run the following commands to install Ansible:

    * Update Repository by including the official project’s PPA <br>
     `sudo apt-get update` <br>
     `sudo apt-add-repository -y ppa:ansible/ansible` <br>
     `sudo apt-get update` to refresh the package manager <br>

    * Install Ansible (and Python) <br>
     `sudo apt-get install -y ansible` <br>
     `sudo apt install python-pip -y` <br>

    * Install Boto Framework <br>
     `sudo pip install boto boto3` <br>
     `sudo apt-get install python-boto -y` <br>

    * Check that Ansible is installed <br>
     `ansible --version` <br>

    * Add the ip address of the Jenkins instance to the Ansible's inventory file: <br>
     `sudo vi /etc/ansible/hosts` <br>
     Add this snippet in `/etc/ansible/hosts`: <br>
        ```
        [jenkins-server]
        <external-ip-address> ansible_ssh_user=<username> ansible_ssh_private_key=path/to/private/key   ansible_python_interpreter=path/to/python
    
        ```

* Install and configure Jenkins
    - Create a directory within the Ansible instance named `playbooks`: <br>
        `mkdir playbooks`
    - Within the `playbooks` directory, create the playbooks found in this [repo](https://github.com/Z11mm/     ansible-playbooks)
    - Run the playbooks, one at a time using this command: <br>
        `sudo ansible-playbook <filename>`
    - Install Java first, followed by Jenkins, and then the others in any order.
    - Once complete, open `http://<ext-ip-address>:8080` in the browser and follow the prompt.
    - In the Jenkins web application, install the following plugins:
        - Node
        - Google Kubernetes Engine
        - Docker
        - Slack Notifications
        - 
    -  Assign a service account with full IAM access to the Jenkins instance to enable it interact with GCP resources.
  
## Continuous Integration (CI pipeline)  
A push to the repository triggers the CI/CD script in the Jenkinsfile. The CI portion of the script does the following:
* Runs tests.
* Builds a Docker image using the `docker-compose-prod.yml` file.
* Pushes the Docker image to DockerHub with a tag version corresponding to the build id.
* Sends Slack notifications when build starts and if build is successful or build fails.


## Continuous Deployment (CD pipeline)
The CD portion of the script does the following:
* Pulls the Docker image from DockerHub.
* Replaces the `:latest` tag version within the deployment file with the updated build id.
* Deploys the application to Google Kubernetes Engine(GKE) using the Jenkins GKE plugin.
* Sends Slack notifications when build starts and if build is successful or build fails.

## Monitoring

Monitor the application running in GKE through the built-in Cloud Operations for GKE which has Cloud Monitoring and Logging by default. <br>

* Set up a Monitoring Dashboard for GKE
![Monitoring Dashboard for GKE](/assets/images/gke-dashboard.png)

* Set up an alerting policy to get notifications, with Slack as the notification channel
![Alerting policy](/assets/images/alerting-policy.png)
![Alerting policy](/assets/images/IMG_0172.PNG)
