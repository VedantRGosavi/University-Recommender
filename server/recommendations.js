// // recommendations.js

// // Disable TLS certificate verification for development (not for production)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// const { Client } = require('@elastic/elasticsearch');

// // Elasticsearch client configuration
// const esClient = new Client({
//   node: 'https://localhost:9200',
//   auth: {
//     username: 'elastic',
//     password: '8d3Vcwhx4ya_DjEtyQsQ' // Replace with your actual password, e.g., "8d3Vcwhx4ya_DjEtyQsQ"
//   },
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// /**
//  * Get university recommendations based on provided filters.
//  * @param {string} location - The location to filter by (e.g., "Commerce, TX").
//  * @param {number} [maxRank] - Optional: maximum rank number (if rank is numeric).
//  */
// async function getRecommendations({ location, maxRank }) {
//   try {
//     // Build the query
//     let query = {
//       bool: {
//         must: [
//           {
//             match: { location: location }
//           }
//         ]
//       }
//     };

//     // If a maxRank filter is provided, add a range query on rankNumber.
//     if (maxRank !== undefined) {
//       query.bool.filter = [
//         {
//           range: { rankNumber: { lte: maxRank } }
//         }
//       ];
//     }

//     // Execute the search query against the "universities" index.
//     const result = await esClient.search({
//       index: 'universities',
//       query: query,
//       size: 50 // You can adjust the size to get more or fewer results.
//     });

//     // Log the number of hits and the hits array.
//     console.log(`Found ${result.hits.total.value} recommendations.`);
//     result.hits.hits.forEach((hit, index) => {
//       console.log(`${index + 1}. ${hit._source.name} - ${hit._source.location}, Rank: ${hit._source.rank}`);
//     });

//     return result.hits.hits;
//   } catch (error) {
//     console.error('Error fetching recommendations:', error);
//     return [];
//   }
// }

// // Example usage:
// (async () => {
//   // For example, get recommendations for universities in "Commerce, TX"
//   // Optionally, you can filter by rank by including maxRank: e.g., maxRank: 400
//   await getRecommendations({ location: "Commerce, TX", maxRank: 400 });
// })();
// //C:\Users\mutha\OneDrive - University of Toledo\Desktop\Elastic Search\elasticsearch-8.17.3\bin>elasticsearch.bat

// recommendations.js

// Disable TLS certificate verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: '8d3Vcwhx4ya_DjEtyQsQ'
  },
  ssl: { rejectUnauthorized: false }
});

/**
 * Get university recommendations based on provided filters
 * @param {Object} params - Parameters for filtering recommendations
 * @param {string} params.location - The location to filter by (optional)
 * @param {number} params.maxRank - Maximum rank number (optional)
 * @param {number} params.minGraduationRate - Minimum graduation rate (optional)
 * @param {number} params.maxCost - Maximum annual cost (optional)
 * @param {boolean} params.isPublic - Whether university is public (optional)
 * @param {string} params.urbanicity - Urban, suburban, or rural (optional)
 * @param {Array} params.majorInterests - Array of major interests (optional)
 * @param {number} params.size - Number of results to return (optional, default 15)
 */
async function getRecommendations(params = {}) {
  try {
    // Destructure and set defaults
    const {
      location,
      maxRank,
      minGraduationRate = 0,
      maxCost,
      isPublic,
      urbanicity,
      majorInterests = [],
      size = 15
    } = params;

    // Build the main bool query
    let query = {
      bool: {
        must: [],
        filter: []
      }
    };

    // Add location filter if provided
    if (location) {
      query.bool.must.push({
        match: { location: location }
      });
    }

    // Add rank filter if provided
    if (maxRank !== undefined) {
      query.bool.filter.push({
        range: { rankNumber: { lte: Number(maxRank) } }
      });
    }

    // Add graduation rate filter if provided
    if (minGraduationRate > 0) {
      query.bool.filter.push({
        range: { graduation_rate: { gte: minGraduationRate } }
      });
    }

    // Add cost filter if provided
    if (maxCost !== undefined) {
      query.bool.filter.push({
        range: { avg_annual_cost: { lte: Number(maxCost) } }
      });
    }

    // Add public/private filter if provided
    if (isPublic !== undefined) {
      query.bool.filter.push({
        term: { public: isPublic }
      });
    }

    // Add urbanicity filter if provided
    if (urbanicity) {
      query.bool.filter.push({
        term: { urbanicity: urbanicity.toLowerCase() }
      });
    }

    // Boost universities with strong programs in major interests
    const functionScores = [];
    const majorFields = {
      'ComputerSci': 'computerScienceRank',
      'Engineering': 'engineeringRank',
      'Business': 'businessRank',
      'Nursing': 'nursingRank',
      'Psychology': 'psychologyRank',
      'Finance': 'financeRank',
      'Economics': 'economicsRank',
      'Management': 'managementRank',
      'Marketing': 'marketingRank',
      'AI': 'artificialIntelligenceRank',
      'Aerospace': 'aerospaceRanking'
    };

    // Add function scores for each major interest
    majorInterests.forEach(major => {
      const field = majorFields[major];
      if (field) {
        functionScores.push({
          field_value_factor: {
            field: field,
            modifier: 'reciprocal',
            factor: 1,
            missing: 999
          },
          weight: 1.5
        });
      }
    });

    // Add overall ranking function score with lower weight
    functionScores.push({
      field_value_factor: {
        field: 'rankNumber',
        modifier: 'reciprocal',
        factor: 1,
        missing: 9999
      },
      weight: 0.5
    });

    // Build the final search request
    const searchRequest = {
      index: 'universities',
      body: {
        size,
        query: functionScores.length > 0 ? {
          function_score: {
            query: query,
            functions: functionScores,
            score_mode: 'sum',
            boost_mode: 'multiply'
          }
        } : query,
        sort: [
          { '_score': { order: 'desc' } }
        ]
      }
    };

    // Execute the search
    const result = await esClient.search(searchRequest);

    console.log(`Found ${result.hits.total.value} recommendations.`);
    
    // Return the results
    return result.hits.hits;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

/**
 * Get similar universities based on a reference university
 * @param {Object} params - Parameters for finding similar universities
 * @param {string} params.universityId - The reference university ID
 * @param {number} params.size - Number of results to return (optional, default 5)
 */
async function getSimilarUniversities(params = {}) {
  try {
    const { universityId, size = 5 } = params;

    // First get the reference university
    const referenceResult = await esClient.get({
      index: 'universities',
      id: universityId
    });

    const reference = referenceResult._source;

    // Build a query to find similar universities
    const query = {
      bool: {
        must_not: [
          { term: { _id: universityId } } // Exclude the reference university
        ],
        should: [
          // Location match with lower boost
          { match: { location: { query: reference.location, boost: 1.0 } } },
          
          // Similar rank with higher boost
          { 
            range: { 
              rankNumber: { 
                gte: (reference.rankNumber || 999) * 0.7, 
                lte: (reference.rankNumber || 999) * 1.3,
                boost: 2.0 
              } 
            } 
          },
          
          // Same public/private status
          { term: { public: { value: reference.public, boost: 1.5 } } },
          
          // Similar cost
          reference.avg_annual_cost ? {
            range: {
              avg_annual_cost: {
                gte: reference.avg_annual_cost * 0.8,
                lte: reference.avg_annual_cost * 1.2,
                boost: 1.2
              }
            }
          } : null,
          
          // Similar size
          reference.school_size ? {
            term: { school_size: { value: reference.school_size, boost: 1.0 } }
          } : null,
          
          // Similar urbanicity
          reference.urbanicity ? {
            term: { urbanicity: { value: reference.urbanicity, boost: 1.0 } }
          } : null
        ].filter(Boolean) // Remove null values
      }
    };

    // Add program rank comparisons if available
    const rankFields = [
      'computerScienceRank', 'engineeringRank', 'businessRank', 'nursingRank', 
      'psychologyRank', 'financeRank', 'economicsRank', 'managementRank', 
      'marketingRank', 'artificialIntelligenceRank', 'aerospaceRanking'
    ];

    for (const field of rankFields) {
      if (reference[field]) {
        query.bool.should.push({
          range: {
            [field]: {
              gte: reference[field] * 0.7,
              lte: reference[field] * 1.3,
              boost: 1.5
            }
          }
        });
      }
    }

    // Execute the search
    const result = await esClient.search({
      index: 'universities',
      body: {
        query,
        size
      }
    });

    return result.hits.hits;
  } catch (error) {
    console.error('Error finding similar universities:', error);
    return [];
  }
}

/**
 * Get SAT score range matches
 * @param {Object} params - Parameters for matching
 * @param {number} params.satMath - User's SAT Math score
 * @param {number} params.satVerbal - User's SAT Verbal score
 * @param {string} params.careerField - Career interest field (optional)
 * @param {number} params.careerWeight - Weight for career ranking (optional)
 * @param {string} params.sportsField - Sports interest field (optional)
 * @param {number} params.sportsWeight - Weight for sports ranking (optional)
 * @param {number} params.size - Number of results to return (optional)
 */
async function getSATRangeMatches(params = {}) {
  try {
    const {
      satMath,
      satVerbal,
      careerField,
      careerWeight = 0.3,
      sportsField,
      sportsWeight = 0.2,
      size = 15
    } = params;

    // Map career fields to their ranking fields
    const careerRankField = {
      'ComputerSci': 'computerScienceRank',
      'Engineering': 'engineeringRank',
      'Business': 'businessRank',
      'Nursing': 'nursingRank',
      'Psychology': 'psychologyRank',
      'Finance': 'financeRank',
      'Economics': 'economicsRank',
      'Management': 'managementRank',
      'Marketing': 'marketingRank',
      'AI': 'artificialIntelligenceRank',
      'Aerospace': 'aerospaceRanking'
    }[careerField];

    // Map sports fields (example - could be expanded)
    const sportsRankField = {
      'Basketball': 'basketballRank',
      'Soccer': 'soccerRank',
      'Tennis': 'tennisRank'
    }[sportsField];

    // Build script score query to calculate SAT score match
    const searchQuery = {
      function_score: {
        score_mode: 'sum',
        boost_mode: 'replace',
        functions: [
          {
            script_score: {
              script: {
                source: `
                // Helper function to safely get values
                double get(Map d, String f) {
                  return (d.containsKey(f) && d[f].size()!=0) ? d[f].value : -1;
                }

                // Get SAT score ranges
                double minM = get(doc, 'SATMAT25');
                double maxM = get(doc, 'SATMAT75');
                double minV = get(doc, 'SATVR25');
                double maxV = get(doc, 'SATVR75');

                // Check for valid data
                if (minM < 0 || maxM <= minM || minV < 0 || maxV <= minV) return 0.01;

                // Calculate midpoints and spans
                double midM = (minM + maxM) / 2.0;
                double spanM = (maxM - minM) / 2.0;
                double midV = (minV + maxV) / 2.0;
                double spanV = (maxV - minV) / 2.0;

                // Calculate distance from midpoints normalized by span
                double dM = Math.abs(params.uM - midM) / spanM;
                double dV = Math.abs(params.uV - midV) / spanV;

                // Convert to compatibility scores (higher is better)
                double compM = 1.0 - Math.min(dM, 1.0);
                double compV = 1.0 - Math.min(dV, 1.0);

                // Return average compatibility score
                return ((compM + compV) / 2.0) * 100;
                `,
                params: {
                  uM: satMath,
                  uV: satVerbal
                }
              }
            },
            weight: 1.0
          },
          {
            field_value_factor: {
              field: 'rankNumber',
              modifier: 'reciprocal',
              missing: 9999
            },
            weight: 0.05
          }
        ]
      }
    };

    // Add career field score if provided
    if (careerRankField) {
      searchQuery.function_score.functions.push({
        field_value_factor: {
          field: careerRankField,
          modifier: 'reciprocal',
          missing: 999
        },
        weight: careerWeight
      });
    }

    // Add sports field score if provided
    if (sportsRankField) {
      searchQuery.function_score.functions.push({
        field_value_factor: {
          field: sportsRankField,
          modifier: 'reciprocal',
          missing: 999
        },
        weight: sportsWeight
      });
    }

    // Execute the search
    const result = await esClient.search({
      index: 'universities',
      body: {
        query: searchQuery,
        size
      }
    });

    return result.hits.hits;
  } catch (error) {
    console.error('Error in SAT range matching:', error);
    return [];
  }
}

module.exports = {
  getRecommendations,
  getSimilarUniversities,
  getSATRangeMatches
};
