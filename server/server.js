process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
 
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());  // Add JSON body parsing
 
const port = process.env.PORT || 5001;
 
// Elasticsearch client configuration
const esClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: '8d3Vcwhx4ya_DjEtyQsQ'
  },
  ssl: { rejectUnauthorized: false }
});
 
// Create index with mappings if it doesn't exist
async function createIndexIfNotExists() {
  try {
    const exists = await esClient.indices.exists({ index: 'universities' });
    if (!exists.body) {
      await esClient.indices.create({
        index: 'universities',
        body: {
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
              SATVR25:  { type: 'double' },
              SATVR75:  { type: 'double' },
              preference_vector: {
                type: 'dense_vector',
                dims: 12,
                index: true,
                similarity: 'l2_norm'
              }
            }
          }
        }
      });
      console.log('Created index "universities" with extended mapping.');
    } else {
      console.log('Index "universities" already exists.');
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
 
    const careerWeight = Number(req.query.careerWeight) || 0.3; // default to 0.3 if not provided
    const sportsWeight = Number(req.query.sportsWeight) || 0.2; // default to 0.2 if not provided
    const careerField = req.query.Career; // e.g., 'ComputerSci'
    const sportsField = req.query.Sports; // e.g., 'Basketball'
 
    const careerRankField = {
      ComputerSci: 'computerScienceRank',
      Engineering: 'engineeringRank',
      Business: 'businessRank',
      Nursing: 'nursingRank',
      Psychology: 'psychologyRank'
    }[careerField];
 
    const sportsRankField = {
      Basketball: 'basketballRank',
      Soccer: 'soccerRank'
    }[sportsField];
 
    const esQuery = {
      index: 'universities',
      body: {
        size: 10,
        query: {
          function_score: {
            score_mode: 'sum',
            boost_mode: 'replace',
            functions: [
              {
                script_score: {
                  script: {
                    source: `
                    double get(Map d, String f) {
                      return (d.containsKey(f) && d[f].size()!=0) ? d[f].value : -1;
                    }

                    double minM = get(doc, 'SATMAT25');
                    double maxM = get(doc, 'SATMAT75');
                    double minV = get(doc, 'SATVR25');
                    double maxV = get(doc, 'SATVR75');

                    if (minM < 0 || maxM <= minM || minV < 0 || maxV <= minV) return 0.01;

                    double midM  = (minM + maxM) / 2.0;
                    double spanM = (maxM - minM) / 2.0;
                    double midV  = (minV + maxV) / 2.0;
                    double spanV = (maxV - minV) / 2.0;

                    double dM = Math.abs(params.uM - midM) / spanM;     // 0 = centre, 1 = edge
                    double dV = Math.abs(params.uV - midV) / spanV;

                    double compM = 1.0 - Math.min(dM, 1.0);             // floor at 0
                    double compV = 1.0 - Math.min(dV, 1.0);

                    return ((compM + compV) / 2.0) * 100;               // 0 – 100
                    `,
                    params: {
                      uM: userSATM,   // Math that came in on the query string
                      uV: userSATV    // Verbal
                    }
                  }
                },
                weight: 1.0
              },
              {
                field_value_factor: {
                  field: 'rankNumber',
                  modifier: 'reciprocal',      // lower rank ⇒ bigger bonus
                  missing: 9999                // if no rank, tiny bonus
                },
                weight: 0.05                   // gentle tie-breaker
              },
              careerRankField && {
                field_value_factor: {
                  field: careerRankField,
                  modifier: 'reciprocal',
                  missing: 999
                },
                weight: 0.2
              },
              sportsRankField && {
                field_value_factor: {
                  field: sportsRankField,
                  modifier: 'reciprocal',
                  missing: 999
                },
                weight: 0.01
              }
            ].filter(Boolean)
          }
        }
      }
    };

    const maxResults = 15; // maximum number of unique universities to return
    const result = await esClient.search(esQuery);
    const hits = result.hits.hits;
 
    const uniqueUniversities = [];
    const seen = new Set();
    for (const hit of hits) {
      const uni = hit._source;
      console.log(`${uni.name} — score: ${hit._score}`);
      const key = uni.name; // or use `uni.id` if available
      const score = hit._score;
      if (uni.name.toLowerCase().includes("stanford")) {
        console.log("🔍 Stanford debug →", JSON.stringify(uni, null, 2));
      }
 
      console.log(`${uni.name} — score: ${score}`);
 
      if (!seen.has(key)) {
        seen.add(key);
        uniqueUniversities.push(uni);
      }
 
      if (seen.size >= maxResults) break;
    }
 
    res.json({ recommendations: uniqueUniversities.slice(0, maxResults) });
  } catch (error) {
    console.error('❌ Error in /knn-recommendations:');
    console.error("Elastic error body:", JSON.stringify(error.meta?.body?.error, null, 2));
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

app.post('/api/universities', async (req, res) => {
  try {
    const query = req.body;
    const result = await esClient.search({
      index: 'universities',
      body: {
        query: {
          match_all: {}  // For now, return all universities. We'll implement filtering later.
        },
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
 
// Initialize server
(async () => {
  await createIndexIfNotExists();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();

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