// AWS Configuration
export const AWS_CONFIG = {
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  dynamoDBTableName: process.env.REACT_APP_DYNAMODB_TABLE_NAME || 'EmployeeDatabase'
};

// Instructions for setting up AWS credentials:
// 1. Create a .env file in your project root with:
//    REACT_APP_AWS_REGION=us-east-1
//    REACT_APP_DYNAMODB_TABLE_NAME=EmployeeDatabase
//
// 2. Configure AWS credentials using one of these methods:
//    - AWS CLI: aws configure
//    - Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
//    - IAM roles (recommended for production)
