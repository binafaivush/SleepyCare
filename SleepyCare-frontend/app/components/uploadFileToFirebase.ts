import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

export const uploadFileToFirebase = async (uri: string, name: string): Promise<string> => {
  try {
    console.log('Reading file from URI...');
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(`Failed to fetch the file. Status: ${response.status}`);
    }

    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error('Blob is empty or invalid.');
    }

    const storageRef = ref(storage, `content/${name}`);
    console.log(`Uploading file to: content/${name}...`);

    await uploadBytes(storageRef, blob, {
      contentType: blob.type || 'application/octet-stream',
    });

    console.log('File uploaded successfully!');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);

    return downloadURL;
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred during upload.';
    console.error('Upload failed:', message);
    throw new Error(`Upload failed: ${message}`);
  }
};
