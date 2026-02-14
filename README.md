# Smart Parking System

A modern, full-stack parking management system built with Next.js, TypeScript, MongoDB, and NextAuth.js.

## 🚀 Features

- **Real-time Dashboard**: Visual grid showing parking slot availability
- **User Authentication**: Secure login/signup with role-based access
- **Interactive Booking**: Modal-based booking system with pre-filled user data
- **Admin Panel**: Administrative controls for managing the system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **IoT Integration**: API endpoints for sensor data updates
- **Webhook Support**: Integration with n8n for notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS
- **Database**: MongoDB

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/parking
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   N8N_WEBHOOK_URL=https://your-n8n-webhook-url
   ```

4. **Seed the Database**
   ```bash
   npm run seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Data

After running the seed script, you can use these test accounts:

### Admin Account
- **Email**: `admin@parking.com`
- **Password**: `admin123`
- **Role**: Admin (full system access)

### User Account
- **Email**: `user@parking.com`
- **Password**: `user123`
- **Role**: User (booking access only)

### Sample Parking Slots
- **A001**: Vacant (Ground Floor - Section A)
- **A002**: Occupied (Ground Floor - Section A)
- **B001**: Booked (First Floor - Section B)
- **B002**: Vacant (First Floor - Section B)

## 📁 Project Structure

```
parking/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   └── admin/          # Admin dashboard
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility libraries
│   ├── models/            # Mongoose schemas
│   └── types/             # TypeScript type definitions
├── scripts/               # Database seeding scripts
└── public/                # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with test data

## 🌟 Key Features

### Dashboard
- Real-time slot availability display
- Color-coded status indicators
- Interactive booking modal
- Responsive grid layout

### Booking System
- Pre-filled user information
- Vehicle number tracking
- Date/time selection
- Automatic status updates

### Authentication
- Secure JWT-based authentication
- Role-based access control
- Session management
- Password hashing

### API Endpoints
- `/api/slots` - Get all parking slots
- `/api/booking` - Create new booking
- `/api/auth/*` - Authentication routes
- `/api/user/profile` - Get user profile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.
