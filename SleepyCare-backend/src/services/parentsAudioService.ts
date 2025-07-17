import mongoose from 'mongoose';

import { audioModel } from '../models/parentsAudios';


// שמירת הקלטת הורה במסד הנתונים
export const saveParentAudio = async (file: Express.Multer.File, clientId: string): Promise<void> => {
  const newAudio = new audioModel({
    fileName: file.originalname,
    fileData: file.buffer,
    fileType: file.mimetype,
    client_id: new mongoose.Types.ObjectId(clientId),
  });

  await newAudio.save();
};

// שליפת הקלטה לפי מזהה הקלטה
export const getParentAudioById = async (audioId: string) => {
  return audioModel.findById(audioId).exec();
};

//בדיקת תקינות לקובץ השמע המתקבל מהלקוח
export const validateAudioFile = (file: Express.Multer.File | undefined): string | null => {
  if (!file) return 'Audio file is required';

  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'];
  if (!allowedTypes.includes(file.mimetype)) {
    return 'Unsupported audio format';
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return 'Audio file size exceeds 10MB';
  }

  return null;
};

//פונקציה המחזירה הקלטות הורים לפי client_id
export const getParentAudiosByClientId = async (
  clientId: string,
  dateRange?: { start_date?: string; end_date?: string }
): Promise<any> => {
  if (!mongoose.isValidObjectId(clientId)) {
    throw new Error("Invalid client ID format");
  }

  const filter: any = { client_id: new mongoose.Types.ObjectId(clientId) };

  if (dateRange?.start_date || dateRange?.end_date) {
    filter.createdAt = {};
    if (dateRange.start_date) {
      filter.createdAt.$gte = new Date(dateRange.start_date);
    }
    if (dateRange.end_date) {
      const end = new Date(dateRange.end_date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  try {
    const audios = await audioModel.find(filter).exec();

    const files = audios.map(audio => ({
      _id: audio._id.toString(),
      fileName: audio.fileName,
      fileType: audio.fileType,
      createdAt: audio.createdAt,
      streamUrl: `/api/parents-audios/stream/${audio._id}`
    }));

    return {
      message: `Found ${files.length} audio file${files.length !== 1 ? 's' : ''}`,
      files,
    };
  } catch (error: any) {
    console.error("Error fetching parent audios:", error);
    throw new Error(error.message || "Internal server error");
  }
};