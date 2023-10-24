# Expense Management Application

This project provides an expense management application that allows users to create, edit, and delete both users and expenses. The application uses a series of indexedDB stores to reliably save user and expense data. These stores are linked by matching keys, enabling efficient CRUD operations.

## Completed Project Status
- [x] User Management:
  - [x] Create, edit, and delete users
  - [x] Input fields for First Name and Last Name
  - [x] Validation for required fields
  - [x] Display all users in a table
  - [x] Reflect changes in related records

- [x] Expense Management:
  - [x] Create, edit, and delete expenses
  - [x] Dropdowns for user and category selection
  - [x] Input fields for expense description and cost
  - [x] Validation for all fields
  - [x] Display all expenses in a table
  - [x] Update related data in users and company expenses

- [x] Summary of Expenses:
  - [x] Display total cost of expenses for each category

- [x] Additional Notes:
  - [x] Efficient data model structure
  - [x] Optimized time complexity for actions
  - [x] Large data set support
  - [x] README file with project summary and design choices
  - [x] Well-structured and organized code
  - [x] Consideration of UI/UX

## Demos

Would have added a more comprehensive demo section with more time, considering edge cases.

## Data Structures and Algorithms

To ensure scalability and support CRUD operations effectively, the application utilizes the following data structure:

- **Expense Data:** Each expense has a:
    - expense_id (unique_id)
    - category_id (mapping to category_table)
    - user_id (mapping to user_table)
    - expense_description
    - expense_cost
- **User Data:** Each user has a:
    - user_id (unique_id)
    - user_first_name
    - user_last_name
- **Category Data:** Each category has a:
    - category_id (unique_id)
    - category_name

I decided to use UUIDs as unique keys for users and expenses, as using datetime as a unique key could have led to conflicts when multiple users and expenses Ire added. This approach ensures that each user and expense has a unique identifier, allowing for scalable CRUD operations that meet the project objectives.

### Considerations

During the implementation, I carefully considered the performance implications and trade-offs. Although the application is designed for efficient CRUD operations, it is important to note potential limitations and constraints, particularly concerning scalability and performance with a growing user base and increasing expense data.

## Application Setup

To set up and run the application, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Run the application using `npm start`.

## Design

**User Management**
![User Management Design](./public/design_img/user_management_design.png)

**Expense Management**
![Expense Management Design](./public/design_img/expense_management_design.png)

## Things To Add in Future
    - Currently code assumes only one page of browser is open at a time.
    - Supply more comprehensive visualiztions on the summary page
        - Users Ranked by their expenses
        - Add some sort of date value to expenses to track expenses over time
        - Clearer differentiation between users with same name
