import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/images');
    },
    filename: function (req, file, cb) {
      cb(null, (req.query.userId as any));
    },
  });

  const fileFilter = (req:any, file:any, cb:any) => {
    // todo: typescript ok
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
      cb(null, true);
    else 
      cb(null, false);
  };
  
  export const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 2, // 2mb limit on profile photo uploading
    },
    fileFilter: fileFilter,
  }).single('file');