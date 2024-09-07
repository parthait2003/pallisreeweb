import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import Trainee from '@/models/Trainee';
import dbConnect from '@/lib/dbConnect'; // Assuming you have a Mongoose connection handler

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const config = () => ({
  api: {
    bodyParser: false, // Disables body parsing, allowing multer to handle the request body
  },
});

export async function POST(req, { params }) {
  await dbConnect(); // Ensure database connection is established

  try {
    // Ensure the user is authenticated
    const session = await getServerSession(req, authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Multer middleware for file handling
    await new Promise((resolve, reject) => {
      upload.fields([{ name: 'file' }, { name: 'documentfile' }, { name: 'adharfile' }])(req, {}, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });

    const { file, documentfile, adharfile } = req.files;

    if (!file && !documentfile && !adharfile) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedFiles = {};

    const uploadFileToS3 = async (file, filename) => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Make the file publicly readable
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
    };

    // Upload image file
    if (file && file[0]) {
      const imageName = `images/${uuidv4()}-${file[0].originalname}`;
      await uploadFileToS3(file[0], imageName);
      uploadedFiles.image = imageName;
    }

    // Upload document file
    if (documentfile && documentfile[0]) {
      const documentName = `documents/${uuidv4()}-${documentfile[0].originalname}`;
      await uploadFileToS3(documentfile[0], documentName);
      uploadedFiles.document = documentName;
    }

    // Upload Aadhaar file
    if (adharfile && adharfile[0]) {
      const adharName = `aadhaar/${uuidv4()}-${adharfile[0].originalname}`;
      await uploadFileToS3(adharfile[0], adharName);
      uploadedFiles.adhar = adharName;
    }

    console.log('Uploaded Files:', uploadedFiles);

    // Now, update the database with the new file paths
    const updatedTrainee = await updateTraineeFiles(id, uploadedFiles);

    if (!updatedTrainee) {
      return NextResponse.json({ error: 'Failed to update trainee' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Files uploaded successfully', trainee: updatedTrainee });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await dbConnect(); // Ensure database connection is established

  try {
    const id = params.id;

    // Fetch the trainee's information from the database
    const trainee = await Trainee.findById(id);

    if (!trainee) {
      return NextResponse.json({ error: 'Trainee not found' }, { status: 404 });
    }

    // Prepare the file URLs (assuming they are stored as paths in the database)
    const fileUrls = {
      image: trainee.image ? `https://pallisree.blr1.cdn.digitaloceanspaces.com/${trainee.image}` : null,
      document: trainee.document ? `https://pallisree.blr1.cdn.digitaloceanspaces.com/${trainee.document}` : null,
      adhar: trainee.adhar ? `https://pallisree.blr1.cdn.digitaloceanspaces.com/${trainee.adhar}` : null,
    };

    return NextResponse.json({ trainee, fileUrls });
  } catch (error) {
    console.error('Error fetching trainee data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateTraineeFiles(id, uploadedFiles) {
  try {
    // Ensure uploadedFiles contains only the fields that need to be updated
    const updateData = {};

    if (uploadedFiles.image) {
      updateData.image = uploadedFiles.image;
    }

    if (uploadedFiles.document) {
      updateData.document = uploadedFiles.document;
    }

    if (uploadedFiles.adhar) {
      updateData.adhar = uploadedFiles.adhar;
    }

    console.log('Updating Trainee with data:', updateData);

    // Update the trainee in the database
    const updatedTrainee = await Trainee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTrainee) {
      throw new Error('Trainee not found or update failed');
    }

    console.log('Update successful:', updatedTrainee);

    return updatedTrainee;
  } catch (error) {
    console.error('Error updating trainee files:', error);
    return null;
  }
}

export const runtime = 'nodejs';
