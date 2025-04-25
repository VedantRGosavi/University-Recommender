process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 
const express = require('express');
const app = express();
const cors = require('cors');
const { getRecommendations, getSimilarUniversities, getSATRangeMatches } = require('./recommendations');
const { calculateOverallScore } = require('./helper');

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

// Create index with mappings if it doesn't exist
async function createIndexIfNotExists() {
  try {
    // Using MCP Elasticsearch search to check if index exists
    try {
      await mcp_elasticsearch_search({
        index: 'universities',
        queryBody: { query: { match_all: {} }, size: 1 }
      });
      console.log('Index "universities" already exists.');
    } catch (error) {
      if (error.message.includes('index_not_found_exception')) {
        // Create index with mappings
        const mapping = {
          settings: {
            analysis: {
              normalizer: {
                lowercase: {
                  type: 'custom',
                  filter: ['lowercase']
                }
              }
            }
          },
          mappings: {
            properties: {
              name: {
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              public: { type: 'boolean' },
              location: { type: 'text' },
              rank: { type: 'keyword' },
              rankNumber: { type: 'integer' },
              isLiberal: { type: 'boolean' },
              avg_annual_cost: { type: 'integer' },
              degree_types: { type: 'keyword' },
              graduation_rate: { type: 'float' },
              median_earnings: { type: 'integer' },
              school_size: { type: 'integer' },
              school_type: { type: 'keyword', normalizer: 'lowercase' },
              urbanicity: { type: 'keyword', normalizer: 'lowercase' },
              computerScienceRank: { type: 'integer' },
              aerospaceRanking: { type: 'integer' },
              artificialIntelligenceRank: { type: 'integer' },
              businessRank: { type: 'integer' },
              nursingRank: { type: 'integer' },
              engineeringRank: { type: 'integer' },
              economicsRank: { type: 'integer' },
              financeRank: { type: 'integer' },
              managementRank: { type: 'integer' },
              marketingRank: { type: 'integer' },
              psychologyRank: { type: 'integer' },
              images: { type: 'object' },
              graduation_rate_display: { type: 'keyword' },
              SATMAT25: { type: 'double' },
              SATMAT75: { type: 'double' },
              SATVR25: { type: 'double' },
              SATVR75: { type: 'double' },
              preference_vector: {
                type: 'dense_vector',
                dims: 12,
                index: true,
                similarity: 'l2_norm'
              }
            }
          }
        };

        // Create index using MCP Elasticsearch
        await mcp_elasticsearch_create_index({
          index: 'universities',
          body: mapping
        });
        console.log('Created index "universities" with extended mapping.');
      }
    }
  } catch (err) {
    console.error('Error checking/creating index:', err);
  }
}

app.get('/knn-recommendations', async (req, res) => {
  try {
    const userSATV = Number(req.query.SATV || req.query.SATVR75);
    const userSATM = Number(req.query.SATM || req.query.SATMAT75);
    console.log("✅ Received SAT scores → Verbal:", userSATV, "Math:", userSATM);

    const careerWeight = Number(req.query.careerWeight) || 0.3;
    const sportsWeight = Number(req.query.sportsWeight) || 0.2;
    const careerField = req.query.Career;
    const sportsField = req.query.Sports;

    const results = await getSATRangeMatches({
      satMath: userSATM,
      satVerbal: userSATV,
      careerField,
      careerWeight,
      sportsField,
      sportsWeight,
      size: 15
    });

    const maxResults = 15;
    const uniqueUniversities = [];
    const seen = new Set();

    for (const hit of results) {
      const uni = hit._source;
      const key = uni.name;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueUniversities.push(uni);
      }

      if (seen.size >= maxResults) break;
    }

    res.json({ recommendations: uniqueUniversities.slice(0, maxResults) });
  } catch (error) {
    console.error('❌ Error in /knn-recommendations:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// Enhanced API endpoint for filtered recommendations
app.post('/api/filtered-recommendations', async (req, res) => {
  try {
    const {
      location,
      maxRank,
      minGraduationRate,
      maxCost,
      isPublic,
      urbanicity,
      majorInterests = []
    } = req.body;

    const results = await getRecommendations({
      location,
      maxRank,
      minGraduationRate,
      maxCost,
      isPublic,
      urbanicity,
      majorInterests,
      size: 15
    });

    const universities = results.map(hit => hit._source);
    res.json({ recommendations: universities });
  } catch (error) {
    console.error('Error fetching filtered recommendations:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// API endpoint to get similar universities
app.get('/api/similar-universities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const size = Number(req.query.size) || 5;

    const results = await getSimilarUniversities({
      universityId: id,
      size
    });

    const similarUniversities = results.map(hit => hit._source);
    res.json({ similarUniversities });
  } catch (error) {
    console.error('Error fetching similar universities:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// API endpoint for advanced matching with overall scores
app.post('/api/advanced-match', async (req, res) => {
  try {
    const userPreferences = req.body;
    
    // Validate required fields
    if (!userPreferences) {
      return res.status(400).json({ error: 'User preferences are required' });
    }
    
    // Build query to get universities
    let query = { match_all: {} };
    let filterClauses = [];
    
    // Apply any filters if provided
    if (userPreferences.maxCost) {
      filterClauses.push({ range: { avg_annual_cost: { lte: Number(userPreferences.maxCost) } } });
    }
    
    if (userPreferences.minGraduationRate) {
      filterClauses.push({ 
        range: { 
          graduation_rate: { 
            gte: Number(userPreferences.minGraduationRate) / 100 
          } 
        } 
      });
    }
    
    if (userPreferences.isPublic !== undefined) {
      filterClauses.push({ term: { public: userPreferences.isPublic } });
    }
    
    if (userPreferences.urbanicity) {
      filterClauses.push({ term: { urbanicity: userPreferences.urbanicity.toLowerCase() } });
    }
    
    // Add filters to query if any
    if (filterClauses.length > 0) {
      query = {
        bool: {
          must: [{ match_all: {} }],
          filter: filterClauses
        }
      };
    }
    
    // Get universities that match filters
    const result = await mcp_elasticsearch_search({
      index: 'universities',
      queryBody: {
        query,
        size: 50 // Get more results than needed for better matching
      }
    });
    
    // Calculate match scores for each university
    const scoredUniversities = result.hits.hits.map(hit => {
      const university = hit._source;
      const matchScore = calculateOverallScore({
        satVerbal: userPreferences.SATV,
        satMath: userPreferences.SATM,
        maxBudget: userPreferences.maxCost,
        careerInterest: userPreferences.Career
      }, university);
      
      return {
        ...university,
        matchScore
      };
    });
    
    // Sort by match score (descending)
    scoredUniversities.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top 15 matches
    res.json({ 
      recommendations: scoredUniversities.slice(0, 15),
      totalMatches: scoredUniversities.length
    });
    
  } catch (error) {
    console.error('Error in advanced matching:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// API endpoint to get university details by ID
app.get('/api/university/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await mcp_elasticsearch_search({
      index: 'universities',
      queryBody: {
        query: {
          term: { _id: id }
        }
      }
    });

    if (result.hits.hits.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }

    const university = result.hits.hits[0]._source;
    
    // Get similar universities for this university
    const similarResults = await getSimilarUniversities({
      universityId: id,
      size: 3
    });
    
    const similarUniversities = similarResults.map(hit => ({
      id: hit._id,
      name: hit._source.name,
      rank: hit._source.rank,
      location: hit._source.location,
      image: hit._source.images?.thumb || hit._source.images?.medium
    }));

    res.json({
      ...university,
      similarUniversities
    });
  } catch (error) {
    console.error('Error fetching university details:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// API endpoint for map data
app.get('/api/university/:id/map', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await mcp_elasticsearch_search({
      index: 'universities',
      queryBody: {
        query: {
          term: { _id: id }
        }
      }
    });

    if (result.hits.hits.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }

    const university = result.hits.hits[0]._source;
    
    // Return map data
    // Since we don't want to add new fields to the schema, we'll use the university name and location
    // for geocoding on the client side
    res.json({
      name: university.name,
      location: university.location,
      // Using University of Toledo as default fallback coordinates
      fallbackCoordinates: {
        lng: -83.606667,
        lat: 41.658889
      }
    });
  } catch (error) {
    console.error('Error fetching university map data:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

app.post('/api/universities', async (req, res) => {
  try {
    const query = req.body;
    const result = await mcp_elasticsearch_search({
      index: 'universities',
      queryBody: {
        query: query.searchQuery || { match_all: {} },
        size: 10
      }
    });

    const universities = result.hits.hits.map(hit => hit._source);
    res.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// API endpoint for searching universities by location
app.get('/api/universities/search/location', async (req, res) => {
  try {
    const { query } = req.query;
    
    const result = await mcp_elasticsearch_search({
      index: 'universities',
      queryBody: {
        query: {
          multi_match: {
            query: query,
            fields: ['location^2', 'name'],
            type: 'best_fields',
            fuzziness: 'AUTO'
          }
        },
        size: 20,
        sort: [
          { rankNumber: { order: 'asc' } }
        ]
      }
    });

    const universities = result.hits.hits.map(hit => ({
      ...hit._source,
      id: hit._id
    }));

    res.json(universities);
  } catch (error) {
    console.error('Error searching universities by location:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  createIndexIfNotExists();
});

// Commented out delete index endpoint for safety
/*
app.get('/delete-index', async (req, res) => {
  try {
    await esClient.indices.delete({ index: 'universities' });
    res.send('🗑️ Index "universities" deleted successfully!');
  } catch (err) {
    console.error('Error deleting index:', err);
    res.status(500).send('❌ Failed to delete index');
  }
});
*/