# OpenAI API Setup for AI Generated Feedback

This guide will help you configure OpenAI API integration for enhanced AI-generated feedback in the Self Assessment feature.

## Prerequisites

1. **OpenAI Account**: You need an OpenAI account with API access
2. **API Key**: Generate an API key from your OpenAI dashboard

## Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign in to your account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the generated API key (starts with `sk-`)

### Step 2: Configure Environment Variable

#### Option A: Create .env file (Recommended)

1. Create a `.env` file in your project root directory
2. Add the following line:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

#### Option B: Set Environment Variable

**Windows (Command Prompt):**
```cmd
set REACT_APP_OPENAI_API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:REACT_APP_OPENAI_API_KEY="your_api_key_here"
```

**macOS/Linux:**
```bash
export REACT_APP_OPENAI_API_KEY=your_api_key_here
```

### Step 3: Restart Your Application

After setting the environment variable, restart your React development server:

```bash
npm start
```

## Verification

Once configured, you should see:

1. **"OpenAI Connected"** indicator in the AI Generated Feedback section
2. **Enhanced feedback quality** with more detailed, contextual responses
3. **AI Assessment Summary** section after generating feedback

## Features with OpenAI Integration

### Enhanced Feedback Quality
- **Detailed Analysis**: More comprehensive feedback based on quantitative responses
- **Contextual Insights**: AI understands question context and provides relevant advice
- **Actionable Recommendations**: Specific, actionable suggestions for improvement
- **Professional Tone**: Consistent, professional feedback language

### AI Assessment Summary
- **Overall Assessment**: High-level summary of performance
- **Key Insights**: Main takeaways from the quantitative data
- **Development Focus**: Areas to prioritize for growth

## API Usage and Costs

### OpenAI GPT-3.5 Turbo
- **Model Used**: `gpt-3.5-turbo`
- **Cost**: Approximately $0.002 per 1K tokens
- **Typical Usage**: 1-2 API calls per self-assessment
- **Estimated Cost**: $0.01-0.05 per assessment

### Token Usage
- **Input Tokens**: ~500-1000 tokens (questions + answers)
- **Output Tokens**: ~1000-2000 tokens (detailed feedback)
- **Total per Assessment**: ~1500-3000 tokens

## Troubleshooting

### Common Issues

**1. "OpenAI API key not configured" Error**
- Ensure the environment variable is set correctly
- Restart your development server
- Check that the variable name is exactly `REACT_APP_OPENAI_API_KEY`

**2. "API key invalid" Error**
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure your API key has the necessary permissions

**3. Network/Connection Errors**
- Check your internet connection
- Verify OpenAI API is accessible from your network
- Try again after a few minutes

### Fallback Behavior

If OpenAI API is not configured or fails:
- The system automatically falls back to local AI generation
- Basic feedback is still provided based on quantitative responses
- No functionality is lost, only enhanced features are unavailable

## Security Considerations

### API Key Security
- **Never commit API keys to version control**
- **Use environment variables** for configuration
- **Rotate API keys regularly**
- **Monitor API usage** in your OpenAI dashboard

### Data Privacy
- **No personal data is stored** by OpenAI beyond the API call
- **API calls are temporary** and not logged by OpenAI
- **All data remains in your local application**

## Support

For issues with:
- **OpenAI API**: Contact OpenAI support
- **Application Integration**: Check the console for error messages
- **Configuration**: Verify environment variable setup

## Example Configuration

```bash
# .env file
REACT_APP_OPENAI_API_KEY=sk-1234567890abcdef1234567890abcdef12345678
```

After configuration, the AI Generated Feedback button will show "OpenAI Connected" and provide enhanced, detailed feedback for your self-assessments.
