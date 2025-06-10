# Community Hope - Anonymous Donation Platform

A SvelteKit web application that allows well-wishers to anonymously donate to various social projects with M-Pesa integration and administrative tracking.

## 🌟 Features

- 🎯 **Anonymous donations** - No signup or personal information required
- 💳 **M-Pesa integration** - Secure mobile money payments
- 💰 **Card payments** - Alternative payment method
- 📊 **Admin dashboard** - Track donations and manage projects
- 📱 **Responsive design** - Works on mobile and desktop
- 🔒 **Secure processing** - No personal data stored
- 📈 **Real-time tracking** - Live donation progress per project
- 🎨 **Modern UI** - Clean, intuitive interface

## 🛠 Tech Stack

- **Frontend**: SvelteKit 2.x, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: SvelteKit API routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: M-Pesa STK Push API
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional for demo)
- M-Pesa developer account (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/community-hope.git
   cd community-hope
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # M-Pesa Configuration
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_SHORTCODE=your_mpesa_business_shortcode
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_ENVIRONMENT=sandbox # or production

   # Application Configuration
   VITE_APP_NAME=Community Hope
   VITE_APP_URL=http://localhost:5173
   ```

4. **Set up the database** (Optional - demo works without)

   Run the SQL schema in your Supabase dashboard:
   ```bash
   # The schema is in database-schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📱 Demo Mode

The application includes a demo mode that works without external services:

- **Sample projects** are loaded automatically
- **M-Pesa payments** are simulated (90% success rate)
- **Admin dashboard** shows mock data
- **Admin credentials**: `admin@communityhope.com` / `password123`

## 🏗 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── ProjectCard.svelte
│   │   └── DonationModal.svelte
│   ├── supabase.ts         # Database utilities
│   └── mpesa.ts            # M-Pesa integration
├── routes/
│   ├── api/                # API endpoints
│   │   ├── mpesa/          # M-Pesa STK push & callbacks
│   │   ├── projects/       # Projects CRUD
│   │   └── donations/      # Donations CRUD
│   ├── admin/              # Admin dashboard
│   ├── +layout.svelte      # Main layout
│   └── +page.svelte        # Home page
├── app.css                 # Global styles
└── app.html                # HTML template
```

## 🔧 Configuration

### M-Pesa Setup

1. **Get M-Pesa credentials** from [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. **Create an app** and get Consumer Key & Secret
3. **Set up STK Push** and get Business Shortcode & Passkey
4. **Configure callback URL** to `https://yourdomain.com/api/mpesa/callback`

### Supabase Setup

1. **Create a project** at [Supabase](https://supabase.com/)
2. **Run the database schema** from `database-schema.sql`
3. **Get your project URL and anon key** from Settings > API
4. **Configure Row Level Security** policies as needed

## 🎯 Usage

### For Donors

1. **Browse projects** on the home page
2. **Click "Donate Now"** on any project
3. **Enter donation amount** and payment details
4. **Complete payment** via M-Pesa or card
5. **Receive confirmation** - completely anonymous!

### For Administrators

1. **Access admin panel** at `/admin`
2. **Login** with admin credentials
3. **View dashboard** with donation statistics
4. **Track project progress** and donations
5. **Monitor payment status** and trends

## 🔒 Security & Privacy

- **No personal data stored** - truly anonymous donations
- **Secure payment processing** via M-Pesa and card providers
- **Row Level Security** enabled on database
- **Environment variables** for sensitive configuration
- **HTTPS required** for production deployment

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic builds on push

### Netlify

1. **Connect your repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `build`
4. **Configure environment variables**

### Manual Deployment

```bash
# Build the application
npm run build

# Preview the build
npm run preview

# Deploy the 'build' directory to your hosting provider
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SvelteKit** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Supabase** for backend infrastructure
- **Safaricom** for M-Pesa API
- **Lucide** for beautiful icons

## 📞 Support

For support, email support@communityhope.com or create an issue on GitHub.

---

**Made with ❤️ for the community**

```
// Environment variables
# Demo environment variables
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=demo_key

# M-Pesa Configuration
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=VKpFfX0GP08AYIV6FAiVNiGTiaDU9C5qXh4TgFR9oAEgJNNL
MPESA_CONSUMER_SECRET=i5KX5c2S6J48BXbYm71F5ltNK3GGVrj1s8OlvtX1Ptn3k5xg8Qsz3QtAETijAQR6
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://webhook.site/unique-id

# Application Configuration
VITE_APP_NAME=Community Hope
VITE_APP_URL=http://localhost:5173
```