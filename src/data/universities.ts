import { University } from "../types/university";

export const universities: University[] = [
  {
    id: "1",
    name: "Stanford University",
    slug: "stanford",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000",
    degree: [
      {
        id: "bs",
        slug: "B.S.",
        name: "Bachelor of Science",
        courses: [
          {
            id: "cs",
            name: "Computer Science",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "cs101",
                    name: "Introduction to Programming",
                    notes:
                      "Fundamental concepts of programming including variables, control structures, functions, and basic data structures.",
                  },
                  {
                    id: "cs102",
                    name: "Data Structures",
                    notes:
                      "Advanced data structures and algorithms including arrays, linked lists, trees, and graphs.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "cs201",
                    name: "Algorithms",
                    notes:
                      "Analysis and design of algorithms, complexity theory, and problem-solving strategies.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Massachusetts Institute of Technology",
    slug: "mit",
    image:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1000",
    degree: [
      {
        id: "bs",
        slug: "B.S.",
        name: "Bachelor of Science",
        courses: [
          {
            id: "ee",
            name: "Electrical Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
    slug: "RGPV",
    image: "https://www.rgpv.ac.in/images/slider/new_slide1.jpg",
    degree: [
      {
        id: "bt",
        slug: "B.Tech",
        name: "Bachelor of Technology",
        courses: [
          {
            id: "ce",
            name: "Computer Science & Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "BT-101",
                    name: "Engineering Chemistry",
                    notes: "B-Tech Common to all Branches",
                    units: [
                      {
                        id: "u1",
                        number: 1,
                        title: "Unit 1",
                        overview: "Unit 1 Overview",
                        pdf: ["pdf1", "pdf2", "pdf3"],
                      },
                      {
                        id: "u2",
                        number: 2,
                        title: "Unit 2",
                        overview: "Unit 2 Overview",
                        pdf: ["pdf1", "pdf2", "pdf3"],
                      },
                      {
                        id: "u3",
                        number: 3,
                        title: "Unit 3",
                        overview: "Unit 3 Overview",
                        pdf: ["pdf1", "pdf2", "pdf3"],
                      },
                      {
                        id: "u4",
                        number: 4,
                        title: "Unit 4",
                        overview: "Unit 4 Overview",
                        pdf: ["pdf1", "pdf2", "pdf3"],
                      },
                      {
                        id: "u5",
                        number: 5,
                        title: "Unit 5",
                        overview: "Unit 5 Overview",
                        pdf: ["pdf1", "pdf2", "pdf3"],
                      },
                    ],
                  },
                  {
                    id: "BT-102",
                    name: "Mathematics-I",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-103",
                    name: "English for Communication",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-104",
                    name: "Basic Electrical & Electronics Engineering",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-105",
                    name: "Engineering Graphics",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-106",
                    name: "Manufacturing Practices",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-107",
                    name: "Internship-I(60 Hrs Duration) at the Institute level",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-108",
                    name: "Swachh Bharat Summer Internship Unnat Bharat Abhiyan (100Hrs)/Rural Outreach",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "BT-201",
                    name: "Engineering Physics",
                    notes: "B-Tech Common to all Branches",
                  },
                  {
                    id: "BT-202",
                    name: "Mathematics-II",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-203",
                    name: "Basic Mechanical Engineering",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-204",
                    name: "Basic Civil Engineering & Mechanics",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-205",
                    name: "Basic Computer Engineering",
                    notes: "B-Tech Common to all Branches.",
                  },
                  {
                    id: "BT-206",
                    name: "Language Lab & Seminars",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "BT-103",
                    name: "English for Communication",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "BT-104",
                    name: "Basic Electrical & Electronics Engineering",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "BT-105",
                    name: "Engineering Graphics",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "BT-106",
                    name: "Manufacturing Practices",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "BT-107",
                    name: "Internship-I(60 Hrs Duration) at the Institute level",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Swachh Bharat Summer Internship Unnat Bharat Abhiyan (100Hrs)/Rural Outreach",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
          {
            id: "ee",
            name: "Electrical Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "CSE101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
          {
            id: "cie",
            name: "Civil Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "CSE101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
          {
            id: "me",
            name: "Mechanical Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "CSE101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "mt",
        slug: "M.Tech",
        name: "Masters of Technology",
        courses: [
          {
            id: "ce",
            name: "Computer Science & Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "BT-101",
                    name: "Engineering Chemistry",
                    notes: "B-Tech Common to all Branches",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
          {
            id: "ee",
            name: "Electrical Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "CSE101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
          {
            id: "cie",
            name: "Civil Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "CSE101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
          {
            id: "me",
            name: "Mechanical Engineering",
            semesters: [
              {
                number: 1,
                subjects: [
                  {
                    id: "CSE101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 2,
                subjects: [
                  {
                    id: "102",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 3,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 4,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 5,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 6,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 7,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
              {
                number: 8,
                subjects: [
                  {
                    id: "ee101",
                    name: "Circuit Analysis",
                    notes: "B-Tech Common to all Branches.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
