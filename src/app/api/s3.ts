import aws from 'aws-sdk';
import crypto, { randomBytes } from 'crypto';
import { promisify } from 'util';

const region = 'ap-south-1'
const bucketName = 'flexitimages'
const accessKeyId = process.env.AWS_ACCESS_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
     region,
     accessKeyId,
     secretAccessKey,
     signatureVersion: 'v4'
})

export async function generateUploadUrl() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex'); 

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}

