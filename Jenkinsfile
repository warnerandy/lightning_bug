properties([pipelineTriggers([githubPush()])])

pipeline {
  agent {
    label 'Worker-1'
  }
  stages {
    stage('Clone repository') {
      /* Let's make sure we have the repository cloned to our workspace */
      steps {
        checkout scm
        sh "yarn config set -- modules-folder ./assets/node_modules"
        sh "yarn install"
      }
    }

    stage('Build image') {
      /* This builds the actual image; synonymous to
       * docker build on the command line */
      steps {
        script {
          docker.withRegistry('http://192.168.1.121:32768/') {
            def image = docker.build("lightning_bug/lightning_bug")
            image.push()
            image.push('latest')
          }
          docker.build("lightning_bug/lightning_bug")
        }
      }
    }
  }
}
