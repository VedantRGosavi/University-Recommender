const { GrokClient } = require('@xai-org/grok-sdk');
const dotenv = require('dotenv');

dotenv.config();

const grokClient = new GrokClient({
  apiKey: process.env.GROK_API_KEY
});

// Campus Culture and Student Life Features
async function matchCampusCulture(studentPreferences) {
  const prompt = `Given these student preferences: ${JSON.stringify(studentPreferences)}, 
                  analyze and match with university culture data considering social life, 
                  campus atmosphere, and student activities.`;
  
  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

async function matchExtracurricularActivities(interests) {
  const prompt = `Match these student interests: ${JSON.stringify(interests)} 
                  with university clubs and activities. Consider both academic 
                  and non-academic activities.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

async function getDiversityInsights(universityData) {
  const prompt = `Analyze diversity statistics for this university: 
                  ${JSON.stringify(universityData)}. Provide insights on 
                  student demographics, inclusion initiatives, and cultural representation.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

// Academic Path Planning Features
async function suggestUniversitiesForCareer(majorAndCareer) {
  const prompt = `Based on this intended major and career goal: 
                  ${JSON.stringify(majorAndCareer)}, suggest suitable universities 
                  and explain their strengths in this field.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

async function getPrerequisiteInfo(program) {
  const prompt = `For this program: ${JSON.stringify(program)}, list and explain 
                  the prerequisite courses and requirements needed.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

async function analyzeGraduationRates(demographicData) {
  const prompt = `Analyze these graduation rate statistics by demographics: 
                  ${JSON.stringify(demographicData)}. Provide insights on trends 
                  and success factors.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

// Integration Features
async function trackApplication(applicationData) {
  const prompt = `Track this application: ${JSON.stringify(applicationData)}. 
                  Provide status updates and upcoming deadline reminders.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

async function getVirtualTourInfo(universityId) {
  const prompt = `Provide virtual tour information for university ID: 
                  ${universityId}. Include key landmarks and facilities.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

async function analyzeAlumniNetwork(universityData) {
  const prompt = `Analyze the alumni network for this university: 
                  ${JSON.stringify(universityData)}. Focus on career outcomes, 
                  industry presence, and networking opportunities.`;

  const response = await grokClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

module.exports = {
  matchCampusCulture,
  matchExtracurricularActivities,
  getDiversityInsights,
  suggestUniversitiesForCareer,
  getPrerequisiteInfo,
  analyzeGraduationRates,
  trackApplication,
  getVirtualTourInfo,
  analyzeAlumniNetwork
}; 