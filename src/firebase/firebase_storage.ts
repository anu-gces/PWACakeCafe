import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import imageCompression from "browser-image-compression";

// Initialize Firebase Storage
const storage = getStorage();

// Create a reference to the "profile pictures" folder
const profilePicturesRef = ref(storage, "profilePictures");
const menuItemsRef = ref(storage, "menuItems");

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  const compressedFile = await imageCompression(file, {
    initialQuality: 0.8,
    maxSizeMB: 0.3, // Maximum file size in MB
    maxWidthOrHeight: 256, // Maximum width or height
    useWebWorker: true, // Use a web worker for better performance
  });
  // Create a reference to the file to upload
  const fileRef = ref(profilePicturesRef, userId);

  // Upload the file
  await uploadBytes(fileRef, compressedFile);

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(fileRef);

  return downloadURL;
};

export const uploadMenuItemImage = async (foodId: string, foodPhoto: File): Promise<string> => {
  const compressedFoodPhoto = await imageCompression(foodPhoto, {
    initialQuality: 0.5,
    maxSizeMB: 0.5, // Maximum file size in MB
    maxWidthOrHeight: 512, // Maximum width or height
    useWebWorker: true, // Use a web worker for better performance
  });
  // Create a reference to the file to upload
  const fileRef = ref(menuItemsRef, foodId);

  // Upload the file
  await uploadBytes(fileRef, compressedFoodPhoto);

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(fileRef);

  return downloadURL;
};

export const deleteMenuItemImage = async (foodId: string): Promise<void> => {
  // Create a reference to the file to delete
  const fileRef = ref(menuItemsRef, foodId);

  // Check if the file exists
  const { items } = await listAll(menuItemsRef);
  const fileExists = items.some((item) => item.name === foodId);

  // If the file exists, delete it
  if (fileExists) {
    await deleteObject(fileRef);
  }
};
