// // working code for indexing universities from MongoDB to Elasticsearch with extended mappings
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// const { MongoClient } = require('mongodb');
// const { Client } = require('@elastic/elasticsearch');

// // 1. MongoDB Configuration
// const MONGO_URI = 'mongodb+srv://new_user:puAez1kxlxWVq27Y@cluster0.snw7nr1.mongodb.net/?retryWrites=true&w=majority';
// const MONGO_DB = 'Universities';          // e.g., "Universities"
// const MONGO_COLLECTION = 'universities';    // e.g., "universities"

// // 2. Elasticsearch Client Configuration
// const esClient = new Client({
//   node: 'https://localhost:9200',
//   auth: {
//     username: 'elastic',
//     password: '8d3Vcwhx4ya_DjEtyQsQ'  // Replace with your actual elastic password
//   },
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// // 3. Utility Function to Extract Numeric Rank from a rank string (e.g., "#9" => 9)
// function extractRankNumber(rankString) {
//   if (!rankString) return null;
//   const num = parseInt(rankString.replace(/[^0-9]/g, ''));
//   return isNaN(num) ? null : num;
// }

// // 4. Create (or ensure) the "universities" index with an extended mapping.
// async function createIndexIfNotExists() {
//   try {
//     const exists = await esClient.indices.exists({ index: 'universities' });
//     if (!exists.body) {
//       await esClient.indices.create({
//         index: 'universities',
//         body: {
//           mappings: {
//             properties: {
//               name: { type: 'text' },
//               public: { type: 'boolean' },
//               location: { type: 'text' },
//               rank: { type: 'keyword' },
//               rankNumber: { type: 'integer' },
//               isLiberal: { type: 'boolean' },
//               avg_annual_cost: { type: 'integer' },
//               degree_types: { type: 'keyword' },
//               graduation_rate: { type: 'float' },
//               median_earnings: { type: 'integer' },
//               school_size: { type: 'integer' },
//               school_type: { type: 'keyword' },
//               urbanicity: { type: 'keyword' },
//               // Major rankings:
//               computerScienceRank: { type: 'integer' },
//               aerospaceRanking: { type: 'integer' },
//               artificialIntelligenceRank: { type: 'integer' },
//               businessRank: { type: 'integer' },
//               nursingRank: { type: 'integer' },
//               engineeringRank: { type: 'integer' },
//               economicsRank: { type: 'integer' },
//               financeRank: { type: 'integer' },
//               managementRank: { type: 'integer' },
//               marketingRank: { type: 'integer' },
//               psychologyRank: { type: 'integer' },
//               // Additional fields:
//               images: { type: 'object' },
//               graduation_rate_display: { type: 'keyword' } // for frontend display if needed
//             }
//           }
//         }
//       });
//       console.log('Created index "universities" with extended mapping.');
//     } else {
//       console.log('Index "universities" already exists.');
//     }
//   } catch (err) {
//     console.error('Error checking/creating index:', err);
//   }
// }

// // 5. Main Function: Index Universities from MongoDB into Elasticsearch.
// async function indexUniversities() {
//   const mongoClient = new MongoClient(MONGO_URI);
//   try {
//     await mongoClient.connect();
//     console.log('Connected to MongoDB.');

//     const db = mongoClient.db(MONGO_DB);
//     const collection = db.collection(MONGO_COLLECTION);

//     // Ensure index exists with the correct mapping.
//     await createIndexIfNotExists();

//     // Fetch and index documents
//     const cursor = collection.find({});
//     let count = 0;
//     while (await cursor.hasNext()) {
//       const doc = await cursor.next();
//       // Process the rank field to get a numeric value.
//       const rankNumber = extractRankNumber(doc.rank);

//       // Build the document to be indexed in Elasticsearch.
//       // For fields that might be null, you could assign default values here if desired.
//       const esDoc = {
//         name: doc.name,
//         public: doc.public,
//         location: doc.location,
//         rank: doc.rank,
//         rankNumber: rankNumber,
//         isLiberal: doc.isLiberal,
//         avg_annual_cost: doc.avg_annual_cost ? Number(doc.avg_annual_cost) : null,
//         degree_types: doc.degree_types && doc.degree_types.length > 0 ? doc.degree_types : ["Bachelor's Degree", "Master's Degree", "Doctoral Degree"],
//         graduation_rate: doc.graduation_rate !== undefined && doc.graduation_rate !== null ? Number(doc.graduation_rate) : 0.4,
//         median_earnings: doc.median_earnings ? Number(doc.median_earnings) : 0,
//         school_size: doc.school_size ? Number(doc.school_size) : 0,  // assume 0 means small if missing
//         school_type: doc.school_type || null,
//         urbanicity: doc.urbanicity || null,
//         computerScienceRank: doc.computerScienceRank ? Number(doc.computerScienceRank) : null,
//         aerospaceRanking: doc.aerospaceRanking ? Number(doc.aerospaceRanking) : null,
//         artificialIntelligenceRank: doc.artificialIntelligenceRank ? Number(doc.artificialIntelligenceRank) : null,
//         businessRank: doc.businessRank ? Number(doc.businessRank) : null,
//         nursingRank: doc.nursingRank ? Number(doc.nursingRank) : null,
//         engineeringRank: doc.engineeringRank ? Number(doc.engineeringRank) : null,
//         economicsRank: doc.economicsRank ? Number(doc.economicsRank) : null,
//         financeRank: doc.financeRank ? Number(doc.financeRank) : null,
//         managementRank: doc.managementRank ? Number(doc.managementRank) : null,
//         marketingRank: doc.marketingRank ? Number(doc.marketingRank) : null,
//         psychologyRank: doc.psychologyRank ? Number(doc.psychologyRank) : null,
//         images: doc.images || {},
//         // Optionally, you could add a display field for graduation_rate:
//         graduation_rate_display: doc.graduation_rate !== undefined && doc.graduation_rate !== null ? (Number(doc.graduation_rate)*100).toFixed(0) + "%" : "N/A"
//       };

//       await esClient.index({
//         index: 'universities',
//         document: esDoc
//       });
//       count++;
//       if (count % 50 === 0) {
//         console.log(`${count} documents indexed...`);
//       }
//     }

//     // Refresh the index so documents are immediately searchable.
//     await esClient.indices.refresh({ index: 'universities' });
//     console.log(`Indexing complete. Total documents indexed: ${count}`);
//   } catch (error) {
//     console.error('Error during indexing:', error);
//   } finally {
//     await mongoClient.close();
//   }
// }

// indexUniversities();


// // new code for testing the indexing function 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { MongoClient } = require('mongodb');
const { Client } = require('@elastic/elasticsearch');

// 1. MongoDB Configuration
const MONGO_URI = 'mongodb+srv://new_user:puAez1kxlxWVq27Y@cluster0.snw7nr1.mongodb.net/?retryWrites=true&w=majority';
const MONGO_DB = 'Universities';
const MONGO_COLLECTION = 'universities';

// 2. Elasticsearch Client Configuration
const esClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: '8d3Vcwhx4ya_DjEtyQsQ'
  },
  ssl: {
    rejectUnauthorized: false
  }
});

// 3. Utility Function to Extract Numeric Rank
function extractRankNumber(rankString) {
  if (!rankString) return null;
  const num = parseInt(rankString.replace(/[^0-9]/g, ''));
  return isNaN(num) ? null : num;
}

// 4. Create or ensure index with extended mapping (including vector)
async function createIndexIfNotExists() {
  try {
    const exists = await esClient.indices.exists({ index: 'universities' });
    if (!exists.body) {
      await esClient.indices.create({
        index: 'universities',
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' }  // For sorting
                }
              }
              ,
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
              school_type: { type: "keyword", normalizer: "lowercase" },
              urbanicity: { type: 'keyword' },
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
              // ✅ NEW VECTOR FIELD
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
      console.log('Created index "universities" with extended mapping including preference_vector.');
    } else {
      console.log('Index "universities" already exists.');
    }
  } catch (err) {
    console.error('Error checking/creating index:', err);
  }
}

// 5. Main Function to Index Universities
async function indexUniversities() {
  const mongoClient = new MongoClient(MONGO_URI);
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB.');

    const db = mongoClient.db(MONGO_DB);
    const collection = db.collection(MONGO_COLLECTION);

    await createIndexIfNotExists();

    const cursor = collection.find({});
    let count = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const rankNumber = extractRankNumber(doc.rank);

      // ✅ Build the 12-dimensional preference vector
      const preferenceVector = [
        rankNumber ?? 999,
        Number(doc.SATMAT75) || 0,
        Number(doc.SATVR75) || 0,
        Number(doc.engineeringRank) || 999,
        Number(doc.businessRank) || 999,
        Number(doc.computerScienceRank) || 999,
        Number(doc.nursingRank) || 999,
        Number(doc.psychologyRank) || 999,
        Number(doc.soccerRank) || 999,
        Number(doc.basketballRank) || 999,
        Number(doc.median_earnings) || 0,
        Number(doc.graduation_rate) || 0.4
      ];

      const esDoc = {
        name: doc.name,
        public: doc.public,
        location: doc.location,
        rank: doc.rank,
        rankNumber,
        isLiberal: doc.isLiberal,
        avg_annual_cost: doc.avg_annual_cost ? Number(doc.avg_annual_cost) : null,
        degree_types: doc.degree_types && doc.degree_types.length > 0
          ? doc.degree_types
          : ["Bachelor's Degree", "Master's Degree", "Doctoral Degree"],
        graduation_rate: doc.graduation_rate !== undefined && doc.graduation_rate !== null
          ? Number(doc.graduation_rate)
          : 0.4,
        median_earnings: doc.median_earnings ? Number(doc.median_earnings) : 0,
        school_size: doc.school_size ? Number(doc.school_size) : 0,
        school_type: doc.school_type || null,
        urbanicity: doc.urbanicity || null,
        computerScienceRank: Number(doc.computerScienceRank) || null,
        aerospaceRanking: Number(doc.aerospaceRanking) || null,
        artificialIntelligenceRank: Number(doc.artificialIntelligenceRank) || null,
        businessRank: Number(doc.businessRank) || null,
        nursingRank: Number(doc.nursingRank) || null,
        engineeringRank: Number(doc.engineeringRank) || null,
        economicsRank: Number(doc.economicsRank) || null,
        financeRank: Number(doc.financeRank) || null,
        managementRank: Number(doc.managementRank) || null,
        marketingRank: Number(doc.marketingRank) || null,
        psychologyRank: Number(doc.psychologyRank) || null,
        images: doc.images || {},
        graduation_rate_display: doc.graduation_rate !== undefined && doc.graduation_rate !== null
          ? (Number(doc.graduation_rate) * 100).toFixed(0) + "%"
          : "N/A",
        preference_vector: preferenceVector // ✅ Add vector here
      };

      await esClient.index({
        index: 'universities',
        document: esDoc
      });

      count++;
      if (count % 50 === 0) {
        console.log(`${count} documents indexed...`);
      }
    }

    await esClient.indices.refresh({ index: 'universities' });
    console.log(`Indexing complete. Total documents indexed: ${count}`);
  } catch (error) {
    console.error('Error during indexing:', error);
  } finally {
    await mongoClient.close();
  }
}

indexUniversities();
