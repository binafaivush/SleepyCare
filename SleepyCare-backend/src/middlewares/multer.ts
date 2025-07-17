import multer from 'multer';


const storage = multer.memoryStorage();

//פונקקציה זו משמשת לאחסן את קבצי האודיו שהעולו בזכרון
export const uploadAudio = multer({ storage }).single('audioFile');
