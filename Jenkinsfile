pipeline {
  agent any
  tools {nodejs "Node"}

  stages {

    stage('Start build notification') {
      steps {
        // send build started notifications
        slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
      }
    }

    stage('Build application') {
      steps {
        echo 'Building application'
        // sh '''
        // npm ci
        // npm run build

        // '''
      }
    }

    stage('Test application') {
      steps {
        echo 'Testing application'
      }
    }

    stage('Build Docker image') {
      steps {
        echo 'Building Docker image'
        script {
          image = docker.build("masterziii/sca-project-backend:${env.BUILD_NUMBER}")
        }
      }
    }

    stage('Push Docker image to DockerHub') {
      steps {
        echo 'Pushing Docker image to DockerHub'
        script {
          withCredentials([string(credentialsId: 'DockerHub', variable: 'DockerHub')]) {
            sh 'docker login -u masterziii -p ${DockerHub}'
          }
          image.push("${env.BUILD_NUMBER}")
        }
      }
    }

    post {
    success {
      slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }

    failure {
      slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }
  }
  }
}