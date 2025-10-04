# HR Unity - Employee Database System

A React-based HR management system with AWS DynamoDB backend for managing employee data.

## Features

- 📊 **Employee Dashboard** - View all employees in a clean, searchable table
- ➕ **Add Employees** - Create new employee records with validation
- ✏️ **Edit Employees** - Update existing employee information
- 🗑️ **Delete Employees** - Remove employee records
- 🔍 **Search & Filter** - Find employees by name, role, department, or ID
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Real-time Updates** - Auto-refresh every 10 seconds
- 🎨 **Modern UI** - Built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Backend**: AWS DynamoDB
- **AWS Services**: DynamoDB, AWS CLI
- **State Management**: React Hooks, Context API

## Prerequisites

1. **Node.js** (v14 or higher)
2. **AWS CLI** installed and configured
3. **AWS Account** with DynamoDB access

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Credentials

#### Option A: AWS CLI Configuration (Recommended)
```bash
aws configure
```
Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (`json`)

#### Option B: Environment Variables
Create a `.env` file in the project root:
```env
REACT_APP_AWS_REGION=us-east-1
REACT_APP_DYNAMODB_TABLE_NAME=EmployeeDatabase
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 3. Create DynamoDB Table

Run these AWS CLI commands to create the employee database:

```bash
# Create the table
aws dynamodb create-table \
    --table-name EmployeeDatabase \
    --attribute-definitions \
        AttributeName=employeeId,AttributeType=S \
    --key-schema \
        AttributeName=employeeId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-east-1

# Wait for table creation
aws dynamodb wait table-exists --table-name EmployeeDatabase --region us-east-1

# Add sample data
aws dynamodb put-item \
    --table-name EmployeeDatabase \
    --item '{
        "employeeId": {"S": "EMP001"},
        "name": {"S": "John Smith"},
        "role": {"S": "Software Engineer"},
        "department": {"S": "Engineering"},
        "manager": {"S": "Jane Doe"},
        "managerEmail": {"S": "jane.doe@company.com"},
        "employeeEmail": {"S": "john.smith@company.com"},
        "performanceRating": {"N": "4.5"},
        "skillsRating": {"N": "4.2"},
        "compensation": {"N": "85000"}
    }' \
    --region us-east-1
```

### 4. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

1. **Access Employee Database**: Click the floating "Employee Database" button in the bottom-right corner
2. **View Employees**: See all employees in a searchable table with key information
3. **Add Employee**: Click "Add Employee" to create a new employee record
4. **Edit Employee**: Click the edit icon next to any employee to modify their information
5. **Delete Employee**: Click the delete icon to remove an employee (with confirmation)
6. **Search**: Use the search bar to filter employees by name, role, department, or ID

## Database Schema

The DynamoDB table `EmployeeDatabase` has the following structure:

| Attribute | Type | Description |
|-----------|------|-------------|
| employeeId | String | Primary key (auto-generated) |
| name | String | Employee's full name |
| role | String | Job title/role |
| department | String | Department name |
| manager | String | Manager's name |
| managerEmail | String | Manager's email address |
| employeeEmail | String | Employee's email address |
| performanceRating | Number | Performance rating (0-5) |
| skillsRating | Number | Skills rating (0-5) |
| compensation | Number | Annual salary |
| createdAt | String | Record creation timestamp |
| updatedAt | String | Last update timestamp |

## AWS CLI Commands Reference

### Create Table
```bash
aws dynamodb create-table \
    --table-name EmployeeDatabase \
    --attribute-definitions AttributeName=employeeId,AttributeType=S \
    --key-schema AttributeName=employeeId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Add Employee
```bash
aws dynamodb put-item \
    --table-name EmployeeDatabase \
    --item '{
        "employeeId": {"S": "EMP001"},
        "name": {"S": "John Smith"},
        "role": {"S": "Software Engineer"},
        "department": {"S": "Engineering"},
        "manager": {"S": "Jane Doe"},
        "managerEmail": {"S": "jane.doe@company.com"},
        "employeeEmail": {"S": "john.smith@company.com"},
        "performanceRating": {"N": "4.5"},
        "skillsRating": {"N": "4.2"},
        "compensation": {"N": "85000"}
    }'
```

### Query All Employees
```bash
aws dynamodb scan --table-name EmployeeDatabase
```

### Update Employee
```bash
aws dynamodb update-item \
    --table-name EmployeeDatabase \
    --key '{"employeeId": {"S": "EMP001"}}' \
    --update-expression "SET compensation = :comp" \
    --expression-attribute-values '{":comp": {"N": "90000"}}'
```

### Delete Employee
```bash
aws dynamodb delete-item \
    --table-name EmployeeDatabase \
    --key '{"employeeId": {"S": "EMP001"}}'
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── EmployeeForm.jsx
│   ├── EmployeeDatabaseTab.jsx
│   ├── HRModuleTile.jsx
│   ├── LoginHeader.jsx
│   ├── EmployeeContext.jsx
│   └── ui/
│       └── sonner.jsx
├── pages/              # Page components
│   └── EmployeeDatabase.jsx
├── services/           # API and external service integrations
│   └── awsService.js
├── hooks/              # Custom React hooks
│   └── useEmployees.js
├── config/             # Configuration files
│   └── aws.js
├── App.jsx             # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Security Considerations

- **AWS Credentials**: Use IAM roles in production instead of hardcoded credentials
- **Environment Variables**: Never commit `.env` files to version control
- **Input Validation**: All user inputs are validated on both client and server side
- **Access Control**: Implement proper authentication and authorization for production use

## Troubleshooting

### Common Issues

1. **AWS Credentials Error**: Ensure AWS CLI is properly configured
2. **DynamoDB Table Not Found**: Verify the table exists and region is correct
3. **CORS Issues**: Ensure your AWS credentials have proper permissions
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Debug Mode

Set `REACT_APP_DEBUG=true` in your `.env` file to enable detailed logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
