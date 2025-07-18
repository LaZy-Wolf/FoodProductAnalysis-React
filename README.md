# NutriScan AI - Food Product Analysis App

A comprehensive AI-powered food product analysis application built with Next.js 14, featuring nutrition analysis, product comparison, and personalized meal planning.

## 🚀 Features

### Core Functionality
- **AI-Powered Food Analysis**: Upload front and back images of food products for comprehensive nutritional analysis
- **Product Comparison**: Side-by-side comparison of up to 2 products with detailed nutritional breakdowns
- **Personalized Meal Planning**: Generate custom 7-day meal plans based on health goals and conditions
- **Interactive Chatbot**: AI nutrition advisor for real-time assistance
- **Dark/Light Theme**: Full theme support with system preference detection

### Analysis Capabilities
- Complete nutrition facts extraction
- Health risk assessment
- Ingredient safety analysis
- Health benefits identification
- Personalized recommendations based on health conditions

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart visualization library

### UI Components
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library

### AI & Backend
- **Google Gemini AI** - Image analysis and text generation
- **Local Storage** - Client-side data persistence
- **Server Actions** - Next.js server-side functionality

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd nutriscan-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_GEMINI_API_KEY`: Google Gemini AI API key for image analysis , add key in gemini.ts file .

### API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

## 📱 Usage

### Product Analysis
1. Navigate to the home page
2. Upload front and back images of a food product
3. Wait for AI analysis (2-5 seconds)
4. View comprehensive nutrition analysis, health risks, and benefits

### Product Comparison
1. Go to the Compare page
2. Select up to 2 products from your scanned history
3. Apply health condition filters if needed
4. View side-by-side nutritional comparison

### Meal Planning
1. Access the Diet Planner page
2. Fill in your personal information (height, weight, age, etc.)
3. Select health conditions and dietary preferences
4. Generate a personalized 7-day meal plan
5. Export as PDF for offline use

### AI Chatbot
- Click the floating chat button on any page
- Ask nutrition questions or get product recommendations
- Get personalized advice based on your health profile

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── compare/           # Product comparison page
│   ├── diet-planner/      # Meal planning page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── benefits.tsx      # Health benefits display
│   ├── floating-chatbot.tsx # AI chatbot
│   ├── health-risks.tsx  # Health risks display
│   ├── nutrition-chart.tsx # Nutrition visualization
│   ├── product-analysis.tsx # Product analysis view
│   ├── theme-provider.tsx # Theme context
│   └── theme-toggle.tsx  # Theme switcher
├── lib/                  # Utility functions
│   ├── gemini.ts         # AI integration
│   ├── pdf-generator.ts  # PDF export functionality
│   ├── storage.ts        # Local storage utilities
│   └── utils.ts          # General utilities
└── README.md             # Project documentation
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary**: Emerald (500-600) to Blue (500-600) gradients
- **Secondary**: Gray scale for neutral elements
- **Accent**: Condition-specific colors (red for risks, green for benefits)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights with gradient text effects
- **Body**: Regular weight with proper contrast ratios

### Components
- **Cards**: Glass morphism effects with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with proper validation states

## 🔒 Privacy & Security

- **Local Storage**: All scanned products stored locally on device
- **No User Accounts**: No personal data collection or storage
- **API Security**: Gemini API calls made securely with proper error handling
- **Image Processing**: Images processed client-side before API calls

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Use Next.js template
- **Docker**: Use provided Dockerfile (if available)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Image upload functionality
- [ ] AI analysis with valid responses
- [ ] Product comparison features
- [ ] Meal plan generation
- [ ] Theme switching
- [ ] Responsive design
- [ ] Chatbot interactions

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Dark theme not working:**
- Ensure `next-themes` is properly installed
- Check if `suppressHydrationWarning` is set in HTML tag

**AI analysis failing:**
- Verify Gemini API key is correctly set
- Check image file sizes (should be < 4MB)
- Ensure images are in supported formats (JPEG, PNG)

**Images not displaying:**
- Check image upload functionality
- Verify file reader implementation
- Ensure proper error handling

### Getting Help
- Create an issue on GitHub
- Check existing documentation
- Review error logs in browser console

## 🔮 Future Enhancements

- [ ] Barcode scanning integration
- [ ] User authentication and cloud sync
- [ ] Recipe suggestions based on scanned products
- [ ] Nutrition tracking and progress monitoring
- [ ] Social features and product reviews
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced dietary restriction filters

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Image Optimization**: Next.js Image component for optimal loading

---

**Built with ❤️ using Next.js 14 and Google Gemini AI**
