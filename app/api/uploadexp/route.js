import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


const s3 = new S3Client({
  endpoint: 'https://blr1.digitaloceanspaces.com',
  region: 'blr1',
  credentials: {
    accessKeyId: 'DO00ZKVH67MAVWTMY433',
    secretAccessKey: 'kvXOFmo6fiJqNv/klNVZsMk7sCDxFhsE8CuMEg6uDE0',
  },
});

export async function POST(req) {
  if (!req.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
   
    const documentfile = formData.get('documentfile');
    
    const documentfilename = formData.get('documentfilename');

    const fileUploads = [];

    

    if (documentfile && documentfilename) {
      const arrayBuffer = await documentfile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const params = {
        Bucket: 'pallisree',
        Key: documentfilename,
        Body: buffer,
        ACL: 'public-read',
        ContentType: documentfile.type,
      };
      const command = new PutObjectCommand(params);
      fileUploads.push(s3.send(command));
      console.log(`Document saved as ${documentfilename}`);
    }

    await Promise.all(fileUploads);
    console.log('Files uploaded successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: `Something went wrong: ${error.message}` }, { status: 500 });
  }
}

export const runtime = 'nodejs';