# University Navigation Flows - Complete Guide

## Overview
This document shows the navigation flow for all universities in the Edu application, including existing universities and new Indian universities.

## Stanford University Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on Stanford University Card
        |    - Image: Stanford campus
        |    - Slug: "stanford"
        |    - Route: /university/stanford
        |
        V
UniversityDetails Page (/university/stanford)
        |
        |=== PAGE STRUCTURE ===
        |
        | Layout Component
        |   - Background: Educational theme image
        |   - Theme-aware overlay (dark/light mode)
        |
        | University Header Section
        |   - Hero Image: Stanford campus image
        |   - University Name: "Stanford University"
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
        |   - Stanford campus background image
        |   - University name display
        |   - Degree dropdown populated with:
        |     * B.S. (Bachelor of Science)
        |
        V

Step 2: Degree Selection
        |
        | User selects: B.S.
        |
        V
        | Course Buttons Appear:
        |   - Computer Science
        |
        V

Step 3: Course Selection
        |
        | User clicks: "Computer Science"
        |
        V
        | Semester Buttons Appear:
        |   - Semester 1
        |   - Semester 2
        |
        V

Step 4: Semester Selection
        |
        | User clicks: "Semester 1"
        |
        V
        | Subject Grid Display:
        |   - Introduction to Programming (cs101)
        |   - Data Structures (cs102)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Introduction to Programming (cs101)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Introduction to Programming"
        |   - University: "Stanford University"
        |   - Download All Units button
        |
        | Units Section
        |   - No units defined (basic subject structure)
        |   - Preview button (navigates to PDFViewer)
        |   - Download button
        |
        V
```

## MIT Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on MIT University Card
        |    - Image: MIT campus
        |    - Slug: "mit"
        |    - Route: /university/mit
        |
        V
UniversityDetails Page (/university/mit)
        |
        |=== PAGE STRUCTURE ===
        |
        | University Header Section
        |   - Hero Image: MIT campus image
        |   - University Name: "Massachusetts Institute of Technology"
        |   - Degree Selection Dropdown
        |
        V
=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Degree dropdown populated with:
        |   * B.S. (Bachelor of Science)
        |
        V

Step 2: Degree Selection
        |
        | User selects: B.S.
        |
        V
        | Course Buttons Appear:
        |   - Electrical Engineering
        |
        V

Step 3: Course Selection
        |
        | User clicks: "Electrical Engineering"
        |
        V
        | Semester Buttons Appear:
        |   - Semester 1
        |
        V

Step 4: Semester Selection
        |
        | User clicks: "Semester 1"
        |
        V
        | Subject Grid Display:
        |   - Circuit Analysis (ee101)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Circuit Analysis (ee101)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Circuit Analysis"
        |   - University: "Massachusetts Institute of Technology"
        |   - Preview/Download functionality
        |
        V
```

## Indian Universities Navigation Flows

### IIT Delhi Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on IIT Delhi University Card
        |    - Image: IIT Delhi campus
        |    - Slug: "iit-delhi"
        |    - Route: /university/iit-delhi
        |
        V
UniversityDetails Page (/university/iit-delhi)
        |
        |=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Degree dropdown populated with:
        |   * B.Tech (Bachelor of Technology)
        |   * M.Tech (Master of Technology)
        |   * Ph.D. (Doctor of Philosophy)
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
        |   - Mechanical Engineering
        |   - Civil Engineering
        |   - Chemical Engineering
        |   - Physics
        |   - Mathematics
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
        | Subject Grid Display:
        |   - Mathematics I (MA101)
        |   - Physics I (PH101)
        |   - Chemistry I (CH101)
        |   - Introduction to Computing (CS101)
        |   - Engineering Graphics (EG101)
        |   - Workshop Practice (WP101)
        |   - Communication Skills (CS101)
        |   - Physical Education (PE101)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Introduction to Computing (CS101)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Introduction to Computing"
        |   - University: "Indian Institute of Technology Delhi"
        |
        | Units Section:
        |   - Unit 1: Basic Programming Concepts
        |   - Unit 2: Data Types and Variables
        |   - Unit 3: Control Structures
        |   - Unit 4: Functions and Arrays
        |   - Unit 5: Introduction to Algorithms
        |
        V
```

### IIT Bombay Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on IIT Bombay University Card
        |    - Image: IIT Bombay campus
        |    - Slug: "iit-bombay"
        |    - Route: /university/iit-bombay
        |
        V
UniversityDetails Page (/university/iit-bombay)
        |
        |=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Degree dropdown populated with:
        |   * B.Tech (Bachelor of Technology)
        |   * M.Tech (Master of Technology)
        |   * Dual Degree (B.Tech + M.Tech)
        |   * Ph.D. (Doctor of Philosophy)
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
        |   - Mechanical Engineering
        |   - Civil Engineering
        |   - Aerospace Engineering
        |   - Chemical Engineering
        |   - Materials Science
        |   - Energy Engineering
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
        | Subject Grid Display:
        |   - Calculus (MA101)
        |   - Linear Algebra (MA102)
        |   - Physics I (PH101)
        |   - Chemistry I (CH101)
        |   - Introduction to Programming (CS101)
        |   - Digital Logic Design (EE101)
        |   - Engineering Drawing (ED101)
        |   - Basic Electronics (EC101)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Introduction to Programming (CS101)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Introduction to Programming"
        |   - University: "Indian Institute of Technology Bombay"
        |
        | Units Section:
        |   - Unit 1: Problem Solving and Algorithms
        |   - Unit 2: C Programming Basics
        |   - Unit 3: Arrays and Strings
        |   - Unit 4: Pointers and Memory
        |   - Unit 5: File Handling and Projects
        |
        V
```

### Delhi University Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on Delhi University Card
        |    - Image: Delhi University campus
        |    - Slug: "delhi-university"
        |    - Route: /university/delhi-university
        |
        V
UniversityDetails Page (/university/delhi-university)
        |
        |=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Degree dropdown populated with:
        |   * B.A. (Bachelor of Arts)
        |   * B.Sc. (Bachelor of Science)
        |   * B.Com. (Bachelor of Commerce)
        |   * B.Tech (Bachelor of Technology)
        |   * M.A. (Master of Arts)
        |   * M.Sc. (Master of Science)
        |   * M.Com. (Master of Commerce)
        |
        V

Step 2: Degree Selection
        |
        | User selects: B.Sc.
        |
        V
        | Course Buttons Appear:
        |   - Computer Science
        |   - Mathematics
        |   - Physics
        |   - Chemistry
        |   - Botany
        |   - Zoology
        |   - Statistics
        |   - Electronics
        |
        V

Step 3: Course Selection
        |
        | User clicks: "Computer Science"
        |
        V
        | Semester Buttons Appear (1-6):
        |   - Semester 1
        |   - Semester 2
        |   - Semester 3
        |   - Semester 4
        |   - Semester 5
        |   - Semester 6
        |
        V

Step 4: Semester Selection
        |
        | User clicks: "Semester 1"
        |
        V
        | Subject Grid Display:
        |   - Programming in C (CS101)
        |   - Digital Electronics (CS102)
        |   - Mathematics I (MA101)
        |   - Physics I (PH101)
        |   - English Communication (EN101)
        |   - Environmental Studies (EV101)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Programming in C (CS101)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Programming in C"
        |   - University: "Delhi University"
        |
        | Units Section:
        |   - Unit 1: C Fundamentals
        |   - Unit 2: Operators and Expressions
        |   - Unit 3: Control Flow
        |   - Unit 4: Functions and Arrays
        |   - Unit 5: Structures and File Operations
        |
        V
```

### JNU (Jawaharlal Nehru University) Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on JNU University Card
        |    - Image: JNU campus
        |    - Slug: "jnu"
        |    - Route: /university/jnu
        |
        V
UniversityDetails Page (/university/jnu)
        |
        |=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Degree dropdown populated with:
        |   * B.A. (Bachelor of Arts)
        |   * B.A. (Hons)
        |   * M.A. (Master of Arts)
        |   * M.Sc. (Master of Science)
        |   * M.Phil. (Master of Philosophy)
        |   * Ph.D. (Doctor of Philosophy)
        |
        V

Step 2: Degree Selection
        |
        | User selects: B.A. (Hons)
        |
        V
        | Course Buttons Appear:
        |   - Computer Science
        |   - Mathematics
        |   - Physics
        |   - Chemistry
        |   - Economics
        |   - Political Science
        |   - History
        |   - Sociology
        |   - Linguistics
        |
        V

Step 3: Course Selection
        |
        | User clicks: "Computer Science"
        |
        V
        | Semester Buttons Appear (1-6):
        |   - Semester 1
        |   - Semester 2
        |   - Semester 3
        |   - Semester 4
        |   - Semester 5
        |   - Semester 6
        |
        V

Step 4: Semester Selection
        |
        | User clicks: "Semester 1"
        |
        V
        | Subject Grid Display:
        |   - Introduction to Programming (CS101)
        |   - Discrete Mathematics (MA101)
        |   - Digital Logic (CS102)
        |   - English Communication (EN101)
        |   - Indian Constitution (PO101)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Introduction to Programming (CS101)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Introduction to Programming"
        |   - University: "Jawaharlal Nehru University"
        |
        | Units Section:
        |   - Unit 1: Programming Paradigms
        |   - Unit 2: Python Basics
        |   - Unit 3: Data Structures in Python
        |   - Unit 4: Object-Oriented Programming
        |   - Unit 5: Algorithm Design
        |
        V
```

### Anna University Navigation Flow

```
Home Page (Featured Universities)
        |
        | 1. Click on Anna University Card
        |    - Image: Anna University campus
        |    - Slug: "anna-university"
        |    - Route: /university/anna-university
        |
        V
UniversityDetails Page (/university/anna-university)
        |
        |=== DETAILED NAVIGATION PATH ===

Step 1: University Details Page Load
        |
        | Degree dropdown populated with:
        |   * B.E. (Bachelor of Engineering)
        |   * B.Tech (Bachelor of Technology)
        |   * M.E. (Master of Engineering)
        |   * M.Tech (Master of Technology)
        |   * M.C.A. (Master of Computer Applications)
        |   * Ph.D. (Doctor of Philosophy)
        |
        V

Step 2: Degree Selection
        |
        | User selects: B.E.
        |
        V
        | Course Buttons Appear:
        |   - Computer Science and Engineering
        |   - Information Technology
        |   - Electronics and Communication Engineering
        |   - Electrical and Electronics Engineering
        |   - Mechanical Engineering
        |   - Civil Engineering
        |   - Chemical Engineering
        |   - Biomedical Engineering
        |
        V

Step 3: Course Selection
        |
        | User clicks: "Computer Science and Engineering"
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
        | Subject Grid Display:
        |   - Technical English I (HS1715)
        |   - Mathematics I (MA1715)
        |   - Engineering Physics I (PH1715)
        |   - Engineering Chemistry I (CY1715)
        |   - Problem Solving and Python Programming (CS1715)
        |   - Engineering Graphics (GE1715)
        |   - Fundamentals of Computing and Programming (CS1711)
        |
        V

Step 5: Subject Selection
        |
        | User clicks: "Problem Solving and Python Programming (CS1715)"
        |
        V
Subject Browser Modal Opens
        |
        | Subject Header
        |   - Title: "Problem Solving and Python Programming"
        |   - University: "Anna University"
        |
        | Units Section:
        |   - Unit 1: Algorithmic Problem Solving
        |   - Unit 2: Python Basics
        |   - Unit 3: Control Flow and Functions
        |   - Unit 4: Lists, Tuples, and Dictionaries
        |   - Unit 5: File Handling and Modules
        |
        V
```

## Summary of All Navigation Flows

### Common Pattern Across All Universities:

1. **Home Page** Click University Card
2. **UniversityDetails Page** Load with university-specific data
3. **Degree Selection** Choose academic program
4. **Course Selection** Choose field of study
5. **Semester Selection** Choose academic term
6. **Subject Selection** Choose specific subject
7. **Subject Browser Modal** Access study materials
8. **PDF Preview/Download** Access learning resources

### Key Differences by University Type:

**IITs (IIT Delhi, IIT Bombay):**
- Strong focus on engineering and technology
- 8-semester B.Tech programs
- Research-oriented M.Tech and Ph.D. programs
- Comprehensive subject coverage

**Central Universities (Delhi University, JNU):**
- Diverse program offerings (Arts, Science, Commerce)
- 6-semester bachelor programs
- Emphasis on liberal arts and sciences
- Interdisciplinary approach

**State Universities (Anna University, RGPV):**
- Regional focus
- Practical engineering programs
- Industry-aligned curriculum
- Affiliated college system

**International Universities (Stanford, MIT):**
- Global perspective
- Research emphasis
- Flexible curriculum structure
- Innovation-focused programs

### Navigation Features:

- **Progressive Disclosure**: Show options based on previous selections
- **Contextual Navigation**: Each level depends on parent selection
- **Multi-path Support**: Users can navigate back and change selections
- **Modal System**: Subject browser with tab support
- **PDF Integration**: Direct access to study materials
- **Theme Support**: Consistent dark/light mode experience
- **Responsive Design**: Mobile-friendly interface
