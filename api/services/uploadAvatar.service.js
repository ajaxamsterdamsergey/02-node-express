import { Storage } from "@google-cloud/storage";
import Promise from "bluebird";
import fs from "fs";

const GoogleStorage = Promise.promisifyAll(Storage);

const storage = new GoogleStorage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "/keys/shining-wharf-276013-f51946772c3a.json" /* "keys/shining-wharf-276013-f51946772c3a.json" */,
});

const AVATAR_BUCKET_NAME = "goit-storage";

const avatarBucket = storage.bucket(AVATAR_BUCKET_NAME);

/* const getPublicLinkForUploadedFile = (fileName) => {
  return `https://storage.cloud.google.com/goit-storage/${fileName}`;
}; */

export const uploadAvatarFileToStorage = async (path) => {
  const file = await avatarBucket.uploadAsync(path, { public: true });
  /*  await fs.unlink(path, () => {});
  return getPublicLinkForUploadedFile(file.metadata.name); */
  console.log(file);
  return path;
};
