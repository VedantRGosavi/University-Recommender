process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 
const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

// Campus Culture Matching endpoint
app.post('/api/campus-culture-match', async (req, res) => {
  try {
    const { socialPreferences, activityInterests, campusEnvironment, diversityImportance } = req.body;
    
    // Combine all preferences into a single prompt
    const userInput = `
      Based on these student preferences, suggest matching universities:
      - Social Life: ${socialPreferences}
      - Activities: ${activityInterests}
      - Campus Environment: ${campusEnvironment}
      - Diversity Importance: ${diversityImportance}

      Please provide:
      1. Brief analysis of student preferences
      2. 3-5 university suggestions with explanations
      3. Tips for finding the right campus culture fit
    `;

    // Call xAI API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'x-api-version': '1.0'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful university advisor who provides personalized university recommendations based on student preferences.'
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        model: 'grok-v1',
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Send back just the AI-generated response
    res.json({ 
      matches: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error in campus culture matching:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});