import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const uri = process.env.MONGODB_URI;

export async function GET(req) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();

    const collections = await db.listCollections().toArray();
    let backupData = {};

    for (let collectionInfo of collections) {
      const collection = db.collection(collectionInfo.name);
      const data = await collection.find({}).toArray();
      backupData[collectionInfo.name] = data;
    }

    await client.close();

    const backupFilename = `backup_${Date.now()}.json`;
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Ensure the backups directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupPath = path.join(backupDir, backupFilename);
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    const fileStream = fs.createReadStream(backupPath);

    return new Response(fileStream, {
      headers: {
        'Content-Disposition': `attachment; filename=${backupFilename}`,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error creating backup:', error);
    return new Response(JSON.stringify({ error: 'Failed to create backup', details: error.message }), { status: 500 });
  }
}
