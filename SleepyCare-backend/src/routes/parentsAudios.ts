import { Router, Request, Response, NextFunction } from "express";

import {saveAudio,getAudioById} from '../controllers/parentAudios';
import checkParent from  "../middlewares/checkParent";
import { uploadAudio } from "../middlewares/multer";
import checkUser from "../middlewares/checkUser";

const router =Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.get('/stream/:audioId',checkUser,getAudioById as RouteHandler);
router.post('/upload',checkParent,uploadAudio, saveAudio as RouteHandler);

export default router;