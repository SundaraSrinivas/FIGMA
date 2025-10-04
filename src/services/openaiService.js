// OpenAI Service for AI Generated Feedback
// This service handles OpenAI API integration for generating detailed feedback

class OpenAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Check if OpenAI API key is configured
  isConfigured() {
    return this.apiKey && this.apiKey.length > 0;
  }

  // Generate AI feedback using OpenAI API
  async generateFeedback(quantitativeAnswers, qualitativeQuestions, employeeName, quarterInfo) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }

    try {
      // Prepare the prompt for OpenAI
      const prompt = this.buildPrompt(quantitativeAnswers, qualitativeQuestions, employeeName, quarterInfo);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional HR consultant and performance coach. Provide constructive, detailed, and actionable feedback based on quantitative performance data. Be supportive, specific, and focus on development opportunities.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return this.parseAIResponse(data.choices[0].message.content, qualitativeQuestions);
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  // Build the prompt for OpenAI
  buildPrompt(quantitativeAnswers, qualitativeQuestions, employeeName, quarterInfo) {
    const answersText = Object.entries(quantitativeAnswers)
      .map(([key, data]) => `- ${data.question}: ${data.answer}/5 (Scale: ${data.scale})`)
      .join('\n');

    const questionsText = qualitativeQuestions
      .map((q, index) => `${index + 1}. ${q.question}`)
      .join('\n');

    return `Please provide detailed, constructive feedback for ${employeeName} for ${quarterInfo.name} ${quarterInfo.year} based on their quantitative self-assessment responses.

QUANTITATIVE ASSESSMENT RESULTS:
${answersText}

QUALITATIVE QUESTIONS TO ADDRESS:
${questionsText}

Please provide specific, actionable feedback for each qualitative question based on the quantitative data. Consider:
1. Patterns in the quantitative responses
2. Strengths indicated by high scores (4-5)
3. Areas for development indicated by lower scores (1-3)
4. Specific recommendations for improvement
5. Recognition of achievements and capabilities

Format your response as JSON with this structure:
{
  "feedback": {
    "question_1": "Detailed feedback for first question...",
    "question_2": "Detailed feedback for second question...",
    ...
  },
  "summary": "Overall assessment summary and key recommendations"
}

Be specific, supportive, and focus on actionable insights.`;
  }

  // Parse OpenAI response and extract feedback
  parseAIResponse(aiResponse, qualitativeQuestions) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Map feedback to question IDs
        const feedback = {};
        qualitativeQuestions.forEach((question, index) => {
          const questionKey = `question_${index + 1}`;
          if (parsed.feedback && parsed.feedback[questionKey]) {
            feedback[`qualitative_${question.id}`] = parsed.feedback[questionKey];
          }
        });

        return {
          feedback,
          summary: parsed.summary || 'AI-generated feedback based on your quantitative responses.'
        };
      } else {
        // Fallback: treat entire response as general feedback
        const feedback = {};
        qualitativeQuestions.forEach((question) => {
          feedback[`qualitative_${question.id}`] = aiResponse;
        });

        return {
          feedback,
          summary: 'AI-generated feedback based on your quantitative responses.'
        };
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      
      // Fallback: use the raw response
      const feedback = {};
      qualitativeQuestions.forEach((question) => {
        feedback[`qualitative_${question.id}`] = aiResponse;
      });

      return {
        feedback,
        summary: 'AI-generated feedback based on your quantitative responses.'
      };
    }
  }

  // Test OpenAI connection
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (response.ok) {
        return { success: true, message: 'OpenAI API connection successful' };
      } else {
        return { success: false, error: 'API key invalid or connection failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const openaiService = new OpenAIService();
export default openaiService;
