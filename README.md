# aws-serverless-koa-starter
NodeJS server based on Typescript using [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) wrapped with [koa](http://koajs.com) server to support yields.

AWS Lambda Supports NodeJS v4.3. Make sure to maintain the same for your development environment.

To install dependencies

```sh
$ npm install
```

To run the existing server

```sh
$ npm run grunt
$ npm run start
```

## Project Structure

All Typescript files are maintained in src and a grunt job can be triggered (or grunt watch for active development) to generate the equivalent ES6 js. 

* **src/routes** hosts individual services that need to deployed as separate Lambdas
* **src/common** houses application code common to each service

This is an opiniated structure based on the [DDD Paradigm](https://en.wikipedia.org/wiki/Domain-driven_design)  

The serverless folder contains configurations for CloudFormation.
* **serverless.yml:** service description
* **iam.yml:** IAM Rules for your Lambda
* **resources.yml:** Other AWS Resources that need to be provisioned - The existing yml defines a DynamoDB Table

## Development

The grunt task is defined such as to deploy each folder in routes as a service.
To change the behaviour update gruntfile.js

All the shared resources should be maintained in common.

To add another service
* Duplicate the dummy-service folder with the appropriate name
* Update **gruntfile.js**, add a block for the new service
* Modify serverless/serverless.yml to include your new service

Configurations are preferably given through env variables to facilitate CICD through integration into build pipelines.

The existing dependencies use the [request](https://github.com/awslabs/aws-serverless-express) library for HTTP REST API Transactions
AWS Lambda provides aws-sdk as an npm module once deployed, so it need not be checked into your package.

## Deployment
### To deploy/update

```sh
$ npm run prepareForDeploy
$ npm run deployToAws -- --stage rd --profile PROFILE_NAME_GOES_HERE --region AWS_REGION_GOES_HERE deploy
```

This task packages your code into a zip and publishes it along with the cloudformation template to AWS.

### To remove

```sh
$ npm run deployToAws -- --stage rd --profile PROFILE_NAME_GOES_HERE --region AWS_REGION_GOES_HERE remove
```

## Documentation Generation

This project relies on [grunt-apidoc](https://github.com/apidoc/grunt-apidoc) to generate docs.

```sh
$ npm run grunt watch
```


> Maintained by Tanmay Binaykiya
