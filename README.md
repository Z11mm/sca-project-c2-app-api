# Project: Deploy a Three-Tier application to The Cloud

## Introduction
This application is a face-detection app based off of the AI/ML [Clarifai API](https://www.clarifai.com/models/ai-face-detection). The application allows users to upload images of audiences in an event and record the audience count. 

## Application Architecture
![Application Architecture](/assets/images/app-str.png)

The parts of the application are as follows:
* Frontend - ReactJS, found in this [repo](https://github.com/Z11mm/sca-project-c2-app)
* API - NodeJS, this repo
* Database - PostgreSQL, found [here](https://github.com/Z11mm/sca-project-c2-app-api/tree/main/postgres)

## Deployment Architecture
![Deployment Architecture](/assets/images/deploy-str.png)

Deploy the frontend and api on GKE while using GCP-managed Cloud SQL database service.

* Frontend deployment (`react_deployment.yml`)
Deploy the React frontend with a Load Balancer service to make it accessible over the public internet.  
Configure Nginx as a reverse proxy to direct traffic to the API.
Enable Zero Downtime Deployment with a rolling update in Kubernetes.

* API deployment (`api_deployment.yml`)
Deploy the API with a ClusterIP service which will ensure it is not accessible over the internet.
Enable Zero Downtime Deployment with a rolling update in Kubernetes.
Create Secrets for database credentials and service accounts for IAM authentication to Cloud SQL.

* Database deployment
Setup Postgres on Cloud SQL instance.
Use Cloud SQL Auth Proxy for secure access to Cloud SQL instance without the need for authorized networks or  
for configuring SSL.
Setup Cloud SQL Auth Proxy as a 'sidecar', to run as a container within the pod running the API container. 

## Available Scripts

In the project directory, you can run:

* `docker-compose -f docker-compose.yml up --build` in development mode.

* In production mode, run `docker-compose -f docker-compose-prod.yml build` to create a production-ready image.

* `npm run test-script`

Launches the local test environment with a bash script  .


## Infrastructure Provisioning

![Provision infrastructure in GCP using Terraform](/assets/images/infra-provision.png)
Infrastructure for this project:
* VPC network
* Firewall rules
* Google Compute Engine VM instances
* Google Kubernetes Engine Cluster
* Cloud SQL Instance for Postgres
* Remote backend

Provision infrastructure in GCP using Terraform. 

Check out the infrastructure-as-code configuration  
for this project in this [repo](https://github.com/Z11mm/sca-project-c2-iac)

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

    * Update Repository by including the official project’s PPA
     `sudo apt-get update`
     `sudo apt-add-repository -y ppa:ansible/ansible`
     `sudo apt-get update` to refresh the package manager

    * Install Ansible (and Python)
     `sudo apt-get install -y ansible`
     `sudo apt install python-pip -y`

    * Install Boto Framework
     `sudo pip install boto boto3`
     `sudo apt-get install python-boto -y`

    * Check that Ansible is installed
     `ansible --version`

    * Add the ip address of the Jenkins instance within Ansible's inventory file:
     `sudo vi /etc/ansible/hosts`
     Add this snippet within `/etc/ansible/hosts`:
        ```
        [jenkins-server]
        <external-ip-address> ansible_ssh_user=<username> ansible_ssh_private_key=path/to/private/key   ansible_python_interpreter=path/to/python
    
        ```

* Install and configure Jenkins
    - Create a directory within the Ansible instance named `playbooks`:
        `mkdir playbooks`
    - Within the `playbooks` directory, create the playbooks found in this [repo](https://github.com/Z11mm/     ansible-playbooks)
    - Run the playbooks, one at a time using this command:
        `sudo ansible-playbook <filename>`
    - Install Java first, followed by Jenkins, and then the others in any order.
    - Once complete, open `http://<ext-ip-address>:8080` in the browser and follow the prompts.
    - In the Jenkins web application, install the following plugins:
        - Node
        - Google Kubernetes Engine
        - Docker
        - Slack Notifications

## Continuous Integration (CI pipeline)  
A push to the repository triggers the CI/CD script in the Jenkinsfile. The CI portion of the script does the following:
* Runs `npm run build` to create a build folder.
* Builds a Docker image using the `docker-compose-prod.yml` file.
* Pushes the Docker image to DockerHub with a tag version corresponding to the build id.
* Sends Slack notifications when build starts and if build is successful or build fails.


## Continuous Deployment (CD pipeline)
A push to the repository triggers the CI/CD script in the Jenkinsfile. The CD portion of the script does the following:
* Pulls the Docker image from DockerHub.
* Replaces the `:latest` tag version within the deployment file with the updated build id.
* Deploys the application to Google Kubernetes Engine(GKE) using the Jenkins GKE plugin.
* Sends Slack notifications when build starts and if build is successful or build fails.