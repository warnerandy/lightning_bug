properties([pipelineTriggers([githubPush()])])

pipeline {
  agent {
    label 'Worker-1'
  }
  stages {
    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */
         steps {
          sh """ 
whoami
"""
        script {
          docker.build("lightning_bug/lightning_bug")
        }
         }
    }
  }
}
