import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { getParentAudioById,saveParentAudio ,validateAudioFile} from '../services/parentsAudioService';
import { audioUploadValidationSchema } from '../validations/parentsAudio';


//פונקציה להעלאת הקלטה של הורה
export const saveAudio = async (req: Request, res: Response): Promise<void> => {
  const { error } = audioUploadValidationSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const fileError =validateAudioFile(req.file);
  if (fileError) {
    res.status(400).json({ message: fileError });
    return;
  }

  try {
    await saveParentAudio(req.file!, req.body.client_id);
    res.status(200).json({ message: 'File uploaded and saved successfully' });
  } catch (err: any) {
    console.error("Error saving audio:", err);
    res.status(500).json({ message: 'Error saving file', error: err.message });
  }
};

//פונקציה להחזרת הקלטה לפי מזהה הקלטה
export const getAudioById = async (req: Request, res: Response): Promise<void> => {
  const { audioId } = req.params;

  if (!mongoose.isValidObjectId(audioId)) {
    res.status(400).json({ message: 'Invalid audio ID' });
    return;
  }

  try {
    const audio = await getParentAudioById(audioId);

    if (!audio || !audio.fileData) {
      res.status(404).json({ message: 'Audio not found' });
      return;
    }

    res.set({
      'Content-Type': audio.fileType || 'audio/mpeg',
      'Content-Disposition': `inline; filename="${encodeURIComponent(audio.fileName)}"`,
    });

    res.send(audio.fileData);
  } catch (err: any) {
    console.error("Error retrieving audio:", err);
    res.status(500).json({ message: 'Error retrieving audio file', error: err.message });
  }
};

//פונקצית מחיקה לפי מזהה הקלטה
// export const deleteAudio = async (req: Request, res: Response): Promise<void> => {
//   const { audioId } = req.params;

//   if (!mongoose.isValidObjectId(audioId)) {
//     res.status(400).json({ message: 'Invalid audio ID' });
//     return;
//   }

//   try {
//     const audio = await getParentAudioById(audioId);
//     if (!audio) {
//       res.status(404).json({ message: 'Audio not found' });
//       return;
//     }

//     await audioModel.findByIdAndDelete(audioId);

//     res.status(200).json({ message: 'Audio deleted successfully' });
//   } catch (err: any) {
//     console.error("Error deleting audio:", err);
//     res.status(500).json({ message: 'Error deleting audio file', error: err.message });
//   }
// };