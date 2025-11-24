# Node API workshops
## Setup Instructions
### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed (version 20.18)
- Ensure you have [postgresql](https://www.postgresql.org/download/) installed (version 18.1)

### Installation Steps
1. Clone the repository:
2. ```bash
   git clone git@github.com:dawidho/node-api.git
   cd node-api
   ```
3. Install dependencies: 
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add necessary environment variables as specified in `example.env`.
5. Set up PostgreSQL database:
   - Create a new database named `habit_tracker`.
   - Update the database connection settings in `.env` if necessary.
6. Start the development server:
   ```bash
   npm run dev
   ```


