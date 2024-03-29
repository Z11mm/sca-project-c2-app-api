pipeline {
  agent any
  tools {nodejs "Node"}

  environment {
    PROJECT_ID = "sca-cloud-school-c2"
    CLUSTER_NAME = "sca-project-cluster"
    LOCATION = "us-central1-f"
    CREDENTIALS_ID = "kubernetes"
    BUILD_ID = "${env.BUILD_ID}"
  }

  stages {

    stage('Start build notification') {
      steps {
        // send build started notifications
        slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
      }
    }

    stage('Install app dependencies') {
      steps {
        echo 'Installing app dependencies'
        sh '''
        npm ci

        '''
      }
    }

    stage('Test application') {
      steps {
        echo 'Testing application'
        sh '''
        npm run test-script
        docker-compose -f docker-compose-test.yml down -v
        '''
      }
    }

    stage('Build Docker image') {
      steps {
        echo 'Building image'
        sh '''
        docker-compose -f docker-compose-prod.yml build
        docker image ls
        '''
      }
    }

    stage('Push Docker image to DockerHub') {
      steps {
        echo 'Pushing Docker image to DockerHub'
        script {
          withCredentials([string(credentialsId: 'DockerHub', variable: 'DockerHub')]) {
            sh '''
            docker login -u masterziii -p ${DockerHub}
            docker tag masterziii/sca-project-backend:latest masterziii/sca-project-backend:$BUILD_ID
            docker image push masterziii/sca-project-backend:$BUILD_ID
            '''
          }
        }
      }
    }

    stage('Deploy to GKE') {
      steps {
        echo 'Deploying to GKE'
        sh 'ls -ltr'
        sh "sed -i 's/latest/$BUILD_ID/g' api_deployment.yml"
        step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'service-acc-key.yml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
        step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'api_deployment.yml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
      
      }
    }
  }
  post {
    // Send build success notification
    success {
      slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }

    // Send build failure notification
    failure {
      slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }
  }
}