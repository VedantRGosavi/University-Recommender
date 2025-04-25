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

async function getRecommendations({ location, maxRank }) {
  try {
    let query = {
      bool: {
        must: [
          { match: { location: location } }
        ]
      }
    };

    if (maxRank !== undefined) {
      query.bool.filter = [
        { range: { rankNumber: { lte: Number(maxRank) } } }
      ];
    }

    const result = await esClient.search({
      index: 'universities',
      query: query,
      size: 50
    });

    console.log(`Found ${result.hits.total.value} recommendations.`);
    result.hits.hits.forEach((hit, index) => {
      console.log(`${index + 1}. ${hit._source.name} - ${hit._source.location}, Rank: ${hit._source.rank}`);
    });

    return result.hits.hits;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

// Example usage:
(async () => {
  await getRecommendations({ location: "Commerce, TX", maxRank: 400 });
})();
