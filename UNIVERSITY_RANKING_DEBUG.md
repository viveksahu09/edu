# University Ranking System Debug

## Current University Metrics

| University | Notes Count | Student Count | Combined Score | Rank |
|------------|-------------|---------------|----------------|------|
| IIT Delhi | 1,450 | 8,000 | 870.08 | 1 |
| Stanford University | 1,250 | 17,000 | 750.17 | 2 |
| IIT Bombay | 1,320 | 9,000 | 792.09 | 3 |
| MIT | 1,180 | 11,500 | 708.115 | 4 |
| Anna University | 1,100 | 45,000 | 660.45 | 5 |
| RGPV | 980 | 25,000 | 588.25 | 6 |
| Delhi University | 890 | 132,000 | 534.32 | 7 |
| JNU | 750 | 7,500 | 450.075 | 8 |

## Ranking Formula

**Combined Score** = (notesCount × 0.6) + (studentCount × 0.00001)

- **Notes Count (60% weight)**: Primary factor for ranking
- **Student Count (40% weight)**: Secondary factor (scaled down by 0.00001)

## Top 9 Universities Display

Since we have 8 universities total, all will be displayed in the featured section, ranked by the combined score:

1. **IIT Delhi** - Highest notes count (1,450)
2. **Stanford University** - Strong notes + good student count
3. **IIT Bombay** - High notes count
4. **MIT** - Good balance of both metrics
5. **Anna University** - Large student population
6. **RGPV** - Good notes count
7. **Delhi University** - Largest student population
8. **JNU** - Smallest but still significant

## Grid Layout

The universities will be displayed in a 3x3 grid:
```
Row 1: [IIT Delhi] [Stanford] [IIT Bombay]
Row 2: [MIT] [Anna Univ] [RGPV]
Row 3: [Delhi Univ] [JNU] [Empty]
```

## Search Functionality

The search feature will filter from the top 9 ranked universities, maintaining the ranking order within search results.
