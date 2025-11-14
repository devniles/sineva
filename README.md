# Sineva

Sineva is a full-stack application designed to manage personas and integrate with Meta Ads for creating and managing advertisements. The project includes both a client-side React application and a server-side Node.js backend with MongoDB.

## Features

### Client
- **Persona Management**: Add, edit, delete, and view personas.
- **Meta Ads Integration**: Create dummy or live Meta Ads using persona data.
- **Authentication**: Login and register functionality (in progress).
- **Responsive Design**: Built with React and Bootstrap for a modern UI.

### Server
- **REST API**: Provides endpoints for managing personas, authentication, and Meta Ads integration.
- **MongoDB Integration**: Stores personas and user data.
- **Meta Ads API**: Supports both dummy and live Meta Ads creation.
- **Authentication**: Secure login and registration with JWT and bcrypt.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Meta Ads credentials (for live ads):
  - `META_ACCESS_TOKEN`
  - `META_AD_ACCOUNT_ID`
  - `META_PAGE_ID`

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/devniles/sineva.git
   cd sineva
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `server/` directory:
     ```env
     PORT=5050
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sineva
     META_ACCESS_TOKEN=<your_meta_access_token>
     META_AD_ACCOUNT_ID=<your_ad_account_id>
     META_PAGE_ID=<your_page_id>
     ```

4. Start the development servers:
   ```bash
   # Start the backend
   cd server
   npm run dev

   # Start the frontend
   cd ../client
   npm run dev
   ```

5. Open the application:
   - Client: [http://localhost:5173](http://localhost:5173)
   - Server: [http://localhost:5050](http://localhost:5050)

## Folder Structure

```
.
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Application pages (Home, Manage, Register, etc.)
│   │   ├── store.js      # Zustand store for state management
│   │   └── ...
│   ├── public/           # Static assets
│   └── ...
├── server/                # Node.js backend
│   ├── models/           # Mongoose models (Persona, User, etc.)
│   ├── routes/           # API routes (personas, auth, metaAds, etc.)
│   ├── server.js         # Main server file
│   └── ...
└── README.md             # Project documentation
```

## API Endpoints

### Personas
- `GET /api/personas`: Fetch all personas.
- `POST /api/personas`: Add a new persona.
- `PUT /api/personas/:id`: Update a persona.
- `DELETE /api/personas/:id`: Delete a persona.

### Meta Ads
- `POST /api/meta/ads`: Create a dummy ad.
- `POST /api/meta/ads/live`: Create a live ad (requires Meta credentials).

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive a JWT.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy coding! 🚀
