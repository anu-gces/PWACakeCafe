import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

// Initialize Firebase Storage
const storage = getStorage();

// Create a reference to the "profile pictures" folder
const profilePicturesRef = ref(storage, "profilePictures");
const menuItemsRef = ref(storage, "menuItems");

export const uploadProfilePicture = async (
  userId: string,
  file: File
): Promise<string> => {
  // Create a reference to the file to upload
  const fileRef = ref(profilePicturesRef, userId);

  // Upload the file
  await uploadBytes(fileRef, file);

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(fileRef);

  return downloadURL;
};

export const uploadMenuItemImage = async (
  foodId: string,
  foodPhoto: File
): Promise<string> => {
  // Create a reference to the file to upload
  const fileRef = ref(menuItemsRef, foodId);

  // Upload the file
  await uploadBytes(fileRef, foodPhoto);

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
