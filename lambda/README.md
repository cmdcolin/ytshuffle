## Lambda function

Setting up AWS lambdas requires a lot of clicking and pointing in the web
interface that I did not keep track of properly but roughly I

- Added a lambda
- Added a API gateway as a 'trigger' for the lambda with CORS enabled
- Increase lambda timeout from 3 seconds to 10 minutes for long youtube response
  time

The goal of the lambda is to protect the Youtube API key V3 from the otherwise
purely client side app
