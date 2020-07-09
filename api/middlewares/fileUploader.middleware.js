import multer from "multer";

export const avatarUploader = () => {
  const storage = multer.diskStorage({
    destination:
      "files/avatars" /* "static" */ /* (req, file, cb) => {
      cb(null, "files/avatars");
    } */,
    filename: (req, file, cb) => {
      const userId = req.userInfo.id;
      /* console.log(userId);
      console.log('file',file); */

      cb(null, `${userId}.png`);
    },
  });

  return multer({ storage });
};
