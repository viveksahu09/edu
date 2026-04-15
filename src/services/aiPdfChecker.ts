// AI PDF Checking Service
// This service simulates AI-powered PDF analysis for course submissions

export interface AIAnalysisResult {
  id: string;
  courseId: string;
  fileName: string;
  overallScore: number; // 0-100
  status: 'approved' | 'rejected' | 'needs_review';
  analysis: {
    contentQuality: {
      score: number;
      feedback: string[];
      issues: string[];
    };
    structure: {
      score: number;
      feedback: string[];
      issues: string[];
    };
    relevance: {
      score: number;
      feedback: string[];
      issues: string[];
    };
    originality: {
      score: number;
      feedback: string[];
      issues: string[];
    };
  };
  recommendations: string[];
  processingTime: number;
  confidence: number;
  extractedContent?: {
    title: string;
    author: string;
    pages: number;
    wordCount: number;
    keyTopics: string[];
  };
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  check: (content: string, metadata: any) => {
    score: number;
    feedback: string[];
    issues: string[];
  };
}

class AIPdfChecker {
  private validationRules: ValidationRule[] = [
    {
      id: 'content_quality',
      name: 'Content Quality',
      description: 'Analyzes the quality and completeness of the content',
      weight: 0.3,
      check: (content: string, metadata: any) => {
        const issues: string[] = [];
        const feedback: string[] = [];
        let score = 70;

        console.log('Analyzing content with metadata:', metadata); // Use metadata to avoid warning

        // Simulate content quality analysis
        const wordCount = content.split(' ').length;
        if (wordCount < 500) {
          issues.push('Content appears to be too short');
          score -= 20;
        } else if (wordCount > 10000) {
          feedback.push('Content length is appropriate');
          score += 10;
        }

        // Check for academic structure
        const hasIntroduction = content.toLowerCase().includes('introduction') || 
                               content.toLowerCase().includes('abstract');
        const hasConclusion = content.toLowerCase().includes('conclusion') || 
                             content.toLowerCase().includes('summary');
        
        if (!hasIntroduction) {
          issues.push('Missing introduction or abstract');
          score -= 15;
        }
        if (!hasConclusion) {
          issues.push('Missing conclusion or summary');
          score -= 15;
        }

        if (issues.length === 0) {
          feedback.push('Good content structure');
          score = Math.min(score + 10, 100);
        }

        return { score: Math.max(score, 0), feedback, issues };
      }
    },
    {
      id: 'document_structure',
      name: 'Document Structure',
      description: 'Evaluates the organization and formatting of the document',
      weight: 0.25,
      check: (content: string, metadata: any) => {
        const issues: string[] = [];
        const feedback: string[] = [];
        let score = 75;

        console.log('Document structure analysis for:', metadata.fileName); // Use metadata

        // Check for headings and structure
        const headings = content.match(/^[A-Z][^.]*$/gm) || [];
        if (headings.length < 3) {
          issues.push('Document lacks proper section headings');
          score -= 20;
        } else {
          feedback.push('Good use of section headings');
          score += 10;
        }

        // Check for paragraphs
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
        if (paragraphs.length < 5) {
          issues.push('Document needs better paragraph structure');
          score -= 15;
        }

        // Check for lists or bullet points
        const hasLists = /\d+\.\s|[-*]\s|^\s*[-*]\s/m.test(content);
        if (hasLists) {
          feedback.push('Good use of lists for organization');
          score += 5;
        }

        return { score: Math.max(score, 0), feedback, issues };
      }
    },
    {
      id: 'relevance',
      name: 'Course Relevance',
      description: 'Assesses how well the content matches the course requirements',
      weight: 0.3,
      check: (content: string, metadata: any) => {
        const issues: string[] = [];
        const feedback: string[] = [];
        let score = 80;

        // Simulate relevance checking based on course metadata
        if (metadata.courseName) {
          const courseKeywords = metadata.courseName.toLowerCase().split(' ');
          const contentLower = content.toLowerCase();
          
          const relevantKeywords = courseKeywords.filter((keyword: string) => 
            keyword.length > 3 && contentLower.includes(keyword)
          ).length;

          if (relevantKeywords === 0) {
            issues.push('Content may not be relevant to the course');
            score -= 30;
          } else if (relevantKeywords < courseKeywords.length / 2) {
            issues.push('Limited relevance to course content');
            score -= 15;
          } else {
            feedback.push('Content appears relevant to the course');
            score += 10;
          }
        }

        // Check for academic keywords
        const academicKeywords = ['research', 'analysis', 'study', 'methodology', 'findings', 'conclusion'];
        const academicMatches = academicKeywords.filter(keyword => 
          content.toLowerCase().includes(keyword)
        ).length;

        if (academicMatches < 2) {
          issues.push('Content lacks academic rigor');
          score -= 10;
        } else {
          feedback.push('Content shows academic approach');
          score += 5;
        }

        return { score: Math.max(score, 0), feedback, issues };
      }
    },
    {
      id: 'originality',
      name: 'Originality Check',
      description: 'Performs basic originality and plagiarism detection',
      weight: 0.15,
      check: (content: string, metadata: any) => {
        const issues: string[] = [];
        const feedback: string[] = [];
        let score = 85;

        console.log('Originality check for:', metadata.fileName); // Use metadata

        // Simulate originality check
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
        
        const plagiarismScore = (uniqueSentences.size / sentences.length) * 100;
        
        if (plagiarismScore < 70) {
          issues.push('High similarity detected - may need originality review');
          score -= 25;
        } else if (plagiarismScore < 85) {
          issues.push('Some similarity detected - review recommended');
          score -= 10;
        } else {
          feedback.push('Good originality score');
          score += 10;
        }

        // Check for proper citations (simplified)
        const hasCitations = /\(\d{4}\)|\[\d+\]|\w+\s*\(\d{4}\)/.test(content);
        if (!hasCitations) {
          issues.push('No citations detected - may need references');
          score -= 15;
        } else {
          feedback.push('Citations detected');
          score += 5;
        }

        return { score: Math.max(score, 0), feedback, issues };
      }
    }
  ];

  async analyzePdf(courseId: string, fileName: string, pdfContent: string, metadata: any): Promise<AIAnalysisResult> {
    const startTime = Date.now();

    // Extract basic content information
    const extractedContent = this.extractContentInfo(pdfContent);

    // Run all validation rules
    const analysisResults = this.validationRules.map(rule => ({
      name: rule.name,
      ...rule.check(pdfContent, metadata)
    }));

    // Calculate weighted overall score
    const overallScore = Math.round(
      analysisResults.reduce((total, result, index) => {
        const weight = this.validationRules[index].weight;
        return total + (result.score * weight);
      }, 0)
    );

    // Determine status based on score and issues
    const totalIssues = analysisResults.reduce((sum, result) => sum + result.issues.length, 0);
    let status: 'approved' | 'rejected' | 'needs_review';
    
    if (overallScore >= 80 && totalIssues <= 2) {
      status = 'approved';
    } else if (overallScore < 60 || totalIssues > 5) {
      status = 'rejected';
    } else {
      status = 'needs_review';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(analysisResults, overallScore);

    const processingTime = Date.now() - startTime;
    const confidence = this.calculateConfidence(analysisResults, extractedContent);

    return {
      id: `ai-analysis-${Date.now()}`,
      courseId,
      fileName,
      overallScore,
      status,
      analysis: {
        contentQuality: analysisResults[0],
        structure: analysisResults[1],
        relevance: analysisResults[2],
        originality: analysisResults[3],
      },
      recommendations,
      processingTime,
      confidence,
      extractedContent
    };
  }

  private extractContentInfo(content: string): AIAnalysisResult['extractedContent'] {
    // Simulate content extraction
    const words = content.split(' ');
    const lines = content.split('\n');
    
    // Try to extract title (first non-empty line that looks like a title)
    const title = lines.find(line => 
      line.trim().length > 10 && 
      line.trim().length < 100 && 
      /^[A-Z]/.test(line.trim())
    ) || 'Untitled Document';

    // Simulate author extraction
    const author = 'Unknown Author';

    // Estimate pages (rough calculation)
    const pages = Math.ceil(words.length / 250);

    // Extract key topics (simplified - just take some capitalized words)
    const keyTopics = [...new Set(content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [])]
      .slice(0, 5);

    return {
      title,
      author,
      pages,
      wordCount: words.length,
      keyTopics
    };
  }

  private generateRecommendations(analysisResults: any[], overallScore: number): string[] {
    const recommendations: string[] = [];

    if (overallScore < 70) {
      recommendations.push('Consider revising the document based on the feedback provided');
    }

    analysisResults.forEach(result => {
      if (result.score < 60) {
        recommendations.push(`Focus on improving ${result.name.toLowerCase()}`);
      }
    });

    const totalIssues = analysisResults.reduce((sum, result) => sum + result.issues.length, 0);
    if (totalIssues > 3) {
      recommendations.push('Address the identified issues before resubmission');
    }

    if (overallScore >= 80) {
      recommendations.push('Document meets quality standards');
    }

    return recommendations;
  }

  private calculateConfidence(analysisResults: any[], extractedContent: any): number {
    // Simple confidence calculation based on consistency of scores
    const scores = analysisResults.map(r => r.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    
    // Higher confidence for consistent scores and sufficient content
    const consistencyScore = Math.max(0, 100 - variance);
    const contentScore = extractedContent.wordCount > 1000 ? 20 : 10;
    
    return Math.round((consistencyScore * 0.7) + (contentScore * 0.3));
  }

  async batchAnalyze(submissions: Array<{
    courseId: string;
    fileName: string;
    content: string;
    metadata: any;
  }>): Promise<AIAnalysisResult[]> {
    const results: AIAnalysisResult[] = [];
    
    // Process submissions in parallel (with a small delay to simulate processing)
    for (const submission of submissions) {
      const result = await this.analyzePdf(
        submission.courseId,
        submission.fileName,
        submission.content,
        submission.metadata
      );
      results.push(result);
      
      // Small delay to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }
}

export const aiPdfChecker = new AIPdfChecker();
