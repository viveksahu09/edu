# RGPV University Page Navigation Tree Diagram

## Overview
This tree diagram shows the complete page navigation flow when clicking on **Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)** from the featured universities section.

## Navigation Flow Tree

```
Home Page (Featured Universities)
        |
        | 1. Click on RGPV University Card
        |    - Image: https://www.rgpv.ac.in/images/slider/new_slide1.jpg
        |    - Slug: "RGPV"
        |    - Route: /university/RGPV
        |
        V
UniversityDetails Page (/university/RGPV)
        |
        |=== PAGE STRUCTURE ===
        |
        | Layout Component
        |   - Background: Educational theme image
        |   - Theme-aware overlay (dark/light mode)
        |
        | University Header Section
        |   - Hero Image: RGPV campus image
        |   - University Name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya"
        |   - Degree Selection Dropdown
        |
        | Content Selection Area
        |   - Course Selection Buttons
        |   - Semester Selection Buttons  
        |   - Subject Cards Grid
        |
        | Subject Browser Modal (when subject clicked)
        |
        V
=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Header Section
        |   - RGPV campus background image
        |   - University name display
        |   - Degree dropdown populated with:
        |     * B.Tech (Bachelor of Technology)
        |     * M.Tech (Masters of Technology)
        |
        V

Step 2: Degree Selection
        |
        | User selects: B.Tech
        |
        V
        | Course Buttons Appear:
        |   - Computer Science & Engineering
        |   - Electrical Engineering  
        |   - Civil Engineering
        |   - Mechanical Engineering
        |
        V

Step 3: Course Selection
        |
        | User clicks: "Computer Science & Engineering"
        |
        V
        | Semester Buttons Appear (1-8):
        |   - Semester 1
        |   - Semester 2
        |   - Semester 3
        |   - Semester 4
        |   - Semester 5
        |   - Semester 6
        |   - Semester 7
        |   - Semester 8
        |
        V

Step 4: Semester Selection
        |
        | User clicks: "Semester 1"
        |
        V
        | Subject Grid Display (2 columns):
        |   - Engineering Chemistry (BT-101)
        |   - Mathematics-I (BT-102)
        |   - English for Communication (BT-103)
        |   - Basic Electrical & Electronics Engineering (BT-104)
        |   - Engineering Graphics (BT-105)
        |   - Manufacturing Practices (BT-106)
        |   - Internship-I (BT-107)
        |   - Swachh Bharat Summer Internship (BT-108)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Engineering Chemistry (BT-101)"
        |
        V
Subject Browser Modal Opens
        |
        |=== MODAL STRUCTURE ===
        |
        | Browser Toolbar
        |   - Tab: "Engineering Chemistry"
        |   - Minimize/Maximize controls
        |   - Close button
        |
        | Subject Header
        |   - Title: "Engineering Chemistry"
        |   - University: "Rajiv Gandhi Proudyogiki Vishwavidyalaya"
        |   - Download All Units button
        |
        | Units Section
        |   - Unit 1: "Unit 1 Overview"
        |     * Preview button (navigates to PDFViewer)
        |     * Download button
        |   - Unit 2: "Unit 2 Overview" 
        |     * Preview button (navigates to PDFViewer)
        |     * Download button
        |   - Unit 3: "Unit 3 Overview"
        |     * Preview button (navigates to PDFViewer)
        |     * Download button
        |   - Unit 4: "Unit 4 Overview"
        |     * Preview button (navigates to PDFViewer)
        |     * Download button
        |   - Unit 5: "Unit 5 Overview"
        |     * Preview button (navigates to PDFViewer)
        |     * Download button
        |
        V

Step 6: PDF Preview (Optional)
        |
        | User clicks "Preview" on any unit
        |
        V
PDFViewer Page (/pdfviewer)
        |
        | - Displays PDF content
        | - Navigation back to university page
        |
        V

=== ALTERNATIVE NAVIGATION PATHS ===

Path A: Different Degree Selection
        |
        | User selects: M.Tech instead of B.Tech
        |
        V
        | Same course options:
        |   - Computer Science & Engineering
        |   - Electrical Engineering
        |   - Civil Engineering  
        |   - Mechanical Engineering
        |   - Same semester structure (1-8)
        |   - Similar subject listings
        |
        V

Path B: Different Course Selection
        |
        | User selects: "Electrical Engineering"
        |
        V
        | Same 8-semester structure
        | Different subject content:
        |   - Circuit Analysis (repeated across semesters)
        |   - Course-specific subjects
        |
        V

Path C: Multi-Subject Browser
        |
        | User clicks multiple subjects
        |
        V
Subject Browser with Multiple Tabs
        |
        | - Tab 1: "Engineering Chemistry"
        | - Tab 2: "Mathematics-I"  
        | - Tab 3: "English for Communication"
        | - Tab switching functionality
        | - Individual tab closing
        |
        V

=== COMPONENT INTERACTION TREE ===

UniversityDetails Component
        |
        |--- State Management
        |    |--- selectedDegrees: Degree[]
        |    |--- selectedCourse: Course | null
        |    |--- selectedSemester: number | null
        |    |--- selectedSubjects: Subject[]
        |    |--- isBrowserOpen: boolean
        |
        |--- Child Components
        |    |--- Layout (wrapper)
        |    |--- Select (degree dropdown)
        |    |--- SubjectBrowser (modal)
        |
        V

SubjectBrowser Component  
        |
        |--- State Management
        |    |--- tabs: TabInfo[]
        |    |--- activeTab: string | null
        |    |--- isMinimized: boolean
        |
        |--- Child Components
        |    |--- BrowserToolbar
        |    |--- UnitSection (xN units)
        |
        V

UnitSection Component
        |
        |--- Actions
        |    |--- Preview (navigate to PDFViewer)
        |    |--- Download
        |
        V

=== DATA FLOW FOR RGPV ===

Static Data Source: universities.ts
        |
        | RGPV University Object
        |   |--- id: "3"
        |   |--- name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya"
        |   |--- slug: "RGPV"
        |   |--- image: RGPV campus image
        |   |--- degree: [B.Tech, M.Tech]
        |         |--- courses: [CSE, EE, CE, ME]
        |               |--- semesters: [1-8]
        |                     |--- subjects: [8 subjects per semester]
        |                           |--- units: [5 units for BT-101]
        |
        V

Route Matching: /university/RGPV
        |
        | useParams() hook extracts slug: "RGPV"
        | universities.find(u => u.slug === "RGPV")
        | Returns RGPV university object
        |
        V

Progressive Data Display
        |
        | 1. Degree dropdown populated from RGPV.degree[]
        | 2. Course buttons from selectedDegree.courses[]
        | 3. Semester buttons from selectedCourse.semesters[]
        | 4. Subject grid from selectedSemester.subjects[]
        | 5. Units from selectedSubject.units[]
        |
        V

=== USER EXPERIENCE SUMMARY ===

1. **Entry Point**: Click RGPV from featured universities
2. **First Decision**: Choose degree (B.Tech/M.Tech)  
3. **Second Decision**: Choose engineering branch
4. **Third Decision**: Choose semester (1-8)
5. **Fourth Decision**: Choose subject from grid
6. **Final Action**: Browse units, preview PDFs, download materials

=== TECHNICAL FEATURES ===

- **React Router**: Navigation between pages
- **State Management**: Local component state for selections
- **Modal System**: Draggable subject browser
- **Tab System**: Multi-subject browsing
- **Theme Support**: Dark/light mode throughout
- **Responsive Design**: Mobile-friendly layouts
- **PDF Integration**: Preview functionality
- **Download System**: Unit-level downloads

=== RGPV SPECIFIC DATA ===

B.Tech Computer Science - Semester 1 Subjects:
- Engineering Chemistry (BT-101) - Has 5 units with PDFs
- Mathematics-I (BT-102) - Basic subject
- English for Communication (BT-103) - Communication skills
- Basic Electrical & Electronics Engineering (BT-104) - Core engineering
- Engineering Graphics (BT-105) - Technical drawing
- Manufacturing Practices (BT-106) - Workshop training
- Internship-I (BT-107) - 60-hour institute internship
- Swachh Bharat Summer Internship (BT-108) - 100-hour rural outreach

Each subject provides:
- Subject name and ID
- Descriptive notes
- Unit structure (where applicable)
- PDF resources for study materials
