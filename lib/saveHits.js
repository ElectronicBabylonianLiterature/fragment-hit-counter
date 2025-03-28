const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

module.exports = async function saveHits(data, useSsl = true, output, uri, database) {
  try {
    if (!output) {
      // Save to MongoDB
      if (!uri || !database) {
        console.error('MongoDB URI and database must be provided');
        return;
      }

      const client = await MongoClient.connect(uri, {
        ssl: useSsl,
        sslValidate: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const db = client.db(database);
      const fragments = db.collection('fragments');

      const operations = _.map(data, (references, id) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { uncuratedReferences: references } },
        },
      }));

      const result = await fragments.bulkWrite(operations, { ordered: false });
      console.log('MongoDB update result:', result);

      await client.close();
    } else {
      // Save to local file
      const docs = _.map(data, (references, id) => ({ _id: id, uncuratedReferences: references }));
      const stringifiedJSON = JSON.stringify(docs, null, 2);
      await writeFileAsync(output, stringifiedJSON);
      console.log(`JSON saved to file: ${output}`);
    }
  } catch (error) {
    console.error('Error in saveHits:', error);
  }
};