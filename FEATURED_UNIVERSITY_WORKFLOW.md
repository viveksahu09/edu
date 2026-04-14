# Featured University Workflow Tree Diagram

## 📋 Overview
This document illustrates how the Featured University functionality works in the Edu application.

## 🌳 Tree Structure

```
Featured University System
├── 📁 Data Layer
│   ├── 📄 src/data/universities.ts
│   │   ├── 🏛️ University Objects Array
│   │   │   ├── 🔑 id: string
│   │   │   ├── 📝 name: string
│   │   │   ├── 🔗 slug: string
│   │   │   ├── 🖼️ image: string
│   │   │   └── 🎓 degree[]: Degree Programs
│   │   │       ├── 🔑 id: string
│   │   │       ├── 🔗 slug: string
│   │   │       ├── 📝 name: string
│   │   │       └── 📚 courses[]: Course List
│   │   │           ├── 🔑 id: string
│   │   │           ├── 📝 name: string
│   │   │           └── 📖 semesters[]: Semester Data
│   │   │               ├── 🔢 number: number
│   │   │               └── 📚 subjects[]: Subject List
│   │   │                   ├── 🔑 id: string
│   │   │                   ├── 📝 name: string
│   │   │                   ├── 📄 notes: string
│   │   │                   └── 📑 units[]: Unit Materials (Optional)
│   │   │                       ├── 🔑 id: string
│   │   │                       ├── 🔢 number: number
│   │   │                       ├── 📝 title: string
│   │   │                       ├── 📋 overview: string
│   │   │                       └── 📄 pdf[]: PDF Resources
│   │   └── 📋 Type Definitions (src/types/university.ts)
│
├── 📁 Component Layer
│   ├── 🏠 UniversitySection.tsx
│   │   ├── 🎯 Purpose: Static grid display of featured universities
│   │   ├── 📍 Location: Home page section
│   │   ├── 🔧 Features:
│   │   │   ├── 📱 Responsive grid (1/2/3 columns)
│   │   │   └── 🎨 Gray background section
│   │   └── 🔄 Data Flow:
│   │       └── 📥 Import universities → 🗂️ Map to UniversityCard
│   │
│   ├── 🎠 UniversitySlider.tsx
│   │   ├── 🎯 Purpose: Interactive carousel with search functionality
│   │   ├── 📍 Location: Enhanced home page section
│   │   ├── 🔧 Features:
│   │   │   ├── 🔍 Real-time search by name/slug
│   │   │   ├── ⬅️➡️ Navigation controls
│   │   │   ├── 🎨 Theme-aware styling
│   │   │   ├── 📱 Responsive (3 items per slide)
│   │   │   └── 🖼️ Hero banner with motivational quote
│   │   └── 🔄 Data Flow:
│   │       ├── 📥 Import universities
│   │       ├── 🔍 Filter by search term
│   │       ├── 📊 Paginate (3 per slide)
│   │       └── 🗂️ Map to UniversityCard
│   │
│   └── 🃏 UniversityCard.tsx
│       ├── 🎯 Purpose: Individual university display card
│       ├── 🔧 Features:
│       │   ├── 🖼️ University image display
│       │   ├── 📝 University name
│       │   ├── 📊 Course count
│       │   ├── 🎨 Theme-aware styling
│       │   ├── 🔗 Click to navigate to details
│       │   └── ✨ Hover effects (scale transform)
│       └── 🔄 Data Flow:
│           ├── 📥 Props: university object
│           ├── 🎨 Render with theme context
│           └── 🔗 Link to: `/university/${university.slug}`
│
├── 📁 Navigation Layer
│   ├── 🔄 React Router
│   │   └── 🛣️ Route: `/university/:slug`
│   │       └── 📄 Component: UniversityDetails.tsx
│   └── 📱 User Interaction
│       ├── 👆 Click UniversityCard
│       ├── 🔄 Navigate to university details
│       └── 📊 Display full university information
│
├── 📁 State Management
│   ├── 🎨 ThemeContext.tsx
│   │   └── 🌓 Dark/Light mode support
│   └── 🔍 Local Component State
│       ├── 📝 searchTerm (UniversitySlider)
│       └── 📊 startIndex (UniversitySlider pagination)
│
└── 📁 Styling & UI
    ├── 🎨 TailwindCSS Classes
    │   ├── 📱 Responsive: grid-cols-1/2/3
    │   ├── 🎭 Transitions: transform, hover:scale-105
    │   ├── 🌈 Colors: gray-50, white, indigo-600
    │   └── 📐 Layout: max-w-7xl, px-4, py-16
    └── 🖼️ Visual Elements
        ├── 📸 University Images (Unsplash)
        ├── 🎯 Gradient Overlays
        └── ✨ Shadow Effects
```

## 🔄 Data Flow Diagram

```
📄 universities.ts (Static Data)
        ↓
🏠 UniversitySection/UniversitySlider
        ↓
🗂️ .map() → 🃏 UniversityCard (xN)
        ↓
👆 User Click
        ↓
🛣️ React Router: /university/:slug
        ↓
📄 UniversityDetails.tsx
```

## 🎯 Key Features Summary

### UniversitySection (Simple Grid)
- ✅ Static display of all universities
- ✅ Responsive grid layout
- ✅ Clean, minimal design
- ✅ Direct navigation to university details

### UniversitySlider (Enhanced Carousel)
- ✅ Interactive carousel navigation
- ✅ Real-time search functionality
- ✅ Theme-aware styling
- ✅ Hero banner with motivational content
- ✅ Smooth transitions and animations
- ✅ "Record Not Found" handling

### UniversityCard (Reusable Component)
- ✅ Consistent university display
- ✅ Hover interactions
- ✅ Image optimization
- ✅ Course count display
- ✅ Theme integration

## 🛠️ Technical Implementation Details

### Data Structure
- **Static JSON-like data** in `universities.ts`
- **TypeScript interfaces** for type safety
- **Nested hierarchy**: University → Degree → Course → Semester → Subject → Units

### Component Architecture
- **Component composition** pattern
- **Props drilling** for university data
- **Context usage** for theme management
- **React Router** for navigation

### Styling Approach
- **TailwindCSS utility classes**
- **Responsive design** principles
- **Theme-aware** components
- **CSS transitions** for interactions

## 📱 User Experience Flow

1. **Home Page Load** → User sees featured universities
2. **Browse Options**:
   - Static grid view (UniversitySection)
   - Interactive carousel with search (UniversitySlider)
3. **University Selection** → Click card for details
4. **Navigation** → Redirect to university-specific page
5. **Detailed View** → Full curriculum and course information

## 🔧 Customization Points

### Adding New Universities
```typescript
// Add to universities.ts array
{
  id: "new-id",
  name: "University Name",
  slug: "university-slug",
  image: "image-url",
  degree: [/* degree programs */]
}
```

### Modifying Display Logic
- Change `itemsPerSlide` in UniversitySlider
- Adjust grid columns in UniversitySection
- Customize card styling in UniversityCard

### Theme Integration
- Uses `useTheme()` hook
- Automatic dark/light mode switching
- Consistent color scheme application
