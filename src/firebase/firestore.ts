import type { calendarEventProps } from "@/components/calendar";
import type { FoodItemProps } from "@/components/restaurant_mobile/editMenu";
// import { FirebaseError } from "firebase/app";
import { type User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  type DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  initializeFirestore,
  limit,
  orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { app } from "./firebase";
import { deleteMenuItemImage } from "./firebase_storage";
import { AddToCart } from "@/components/restaurant_mobile/editMenu";
import { generateReceiptId } from "./firestore.utils";
import { format } from "date-fns";
import { CardType as KanbanCardType } from "@/components/ui/kanbanBoard";

//export const db = getFirestore(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: 200000000, // Example cache size, adjust as needed
    tabManager: persistentMultipleTabManager(),
  }),
});

// Function to create a new user document
export async function enterUserDocument(uid: string, email: string, photoURL?: string | null) {
  const userRef = doc(db, "users", uid);
  const user = {
    uid,
    email,
    photoURL, // If photoURL is undefined or null, it will be null
    firstName: "",
    lastName: "",
    phoneNumber: "",
    department: "",
    role: "employee", // Default role
    isProfileComplete: false, // New field to track if the profile is complete
  };
  await setDoc(userRef, user);
}

export function getCurrentUserDetails(): Promise<User | null> {
  const auth = getAuth();

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      unsubscribe();
      resolve(currentUser);
    });
  });
}

export async function getAllUsers(): Promise<DocumentData[]> {
  const usersRef = collection(db, "users");
  const userSnapshot = await getDocs(usersRef);
  const users = userSnapshot.docs.map((doc) => doc.data());
  // console.log(users);
  return users;
}

export async function isUserProfileComplete(): Promise<boolean> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData ? userData.isProfileComplete : false;
    } else {
      throw new Error("User document does not exist");
    }
  } else {
    throw new Error("No user is currently logged in");
  }
}

export async function completeProfileInformation(
  uid: string,
  profileInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    department: string;
    photoURL: string;
  }
) {
  const userRef = doc(db, "users", uid);

  const updatedUser = {
    ...profileInfo,
    isProfileComplete: true, // Set isProfileComplete to true
  };

  await updateDoc(userRef, updatedUser);
}

export async function getCurrentUserDocumentDetails(): Promise<DocumentData | null> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // console.log("line 113", userDoc.data); // Log the user data

      return userDoc.data();
    } else {
      throw new Error("User document does not exist");
    }
  } else {
    throw new Error("No user is currently logged in");
  }
}

export async function editUserDetails(updatedDetails: {
  uid: string; // Include uid as part of the updatedDetails object
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  department?: string;
  role?: string;
}): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No user is currently logged in");
  }

  // Get the current user's document
  const currentUserRef = doc(db, "users", currentUser.uid);
  const currentUserDoc = await getDoc(currentUserRef);

  if (!currentUserDoc.exists()) {
    throw new Error("Current user document does not exist");
  }

  const currentUserData = currentUserDoc.data();

  // Check if the current user has the required role
  if (currentUserData.role.toLowerCase() !== "admin" && currentUserData.role.toLowerCase() !== "owner") {
    throw new Error("Only admins or owners can edit user details");
  }

  // Extract uid from updatedDetails
  const { uid, ...detailsToUpdate } = updatedDetails;

  // Get the target user's document
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User document does not exist");
  }

  const userData = userDoc.data();

  // Merge the updated details with the existing data
  const updatedUserData = {
    ...userData, // Preserve existing data
    ...detailsToUpdate, // Overwrite with updated details
  };

  try {
    // Update the user document with the merged data
    await updateDoc(userRef, updatedUserData);
    console.log(`User with UID ${uid} has been updated successfully.`);
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details.");
  }
}

export async function deleteUser(uidToDelete: string): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No user is currently logged in");
  }

  if (currentUser.uid === uidToDelete) {
    throw new Error("You cannot delete your own account");
  }

  const userRef = doc(db, "users", uidToDelete);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User document does not exist");
  }

  const userData = userDoc.data();

  if (userData.role.toLowerCase() === "admin" || userData.role.toLowerCase() === "owner") {
    throw new Error("Admin or Owner accounts cannot be deleted");
  }

  try {
    await deleteDoc(userRef);
    console.log(`User with UID ${uidToDelete} has been deleted`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function getKanbanCardDocument() {
  const cardRef = doc(db, "kanban", "allItems");
  const cardSnap = await getDoc(cardRef);

  if (cardSnap.exists()) {
    return cardSnap.data().items;
  } else {
    return null;
  }
}

export async function enterKanbanCardDocument(items: KanbanCardType[]) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const itemsWithMarker = items.map((item) => ({
      ...item,
    })); // Add uid to each item
    const cardRef = doc(db, "kanban", "allItems");
    await setDoc(cardRef, { items: itemsWithMarker }, { merge: true }); // Store the items with uid
  }
}

export function listenToKanbanCardDocument(callback: (items: KanbanCardType[]) => void) {
  const unsub = onSnapshot(doc(db, "kanban", "allItems"), (docSnap) => {
    if (docSnap.exists()) {
      const items: KanbanCardType[] = docSnap.data().items || [];

      callback(items); // Pass the entire items array back
    } else {
      callback([]); // No data = empty array
    }
  });

  return unsub; // Let the component handle cleanup
}

export async function getCalendarEventDocument(): Promise<calendarEventProps[]> {
  const eventsRef = doc(db, "calendarEvents", "allEvents");
  const eventsSnap = await getDoc(eventsRef);

  if (eventsSnap.exists()) {
    const data = eventsSnap.data();

    if (data && data.event) {
      data.event = data.event.map((item: calendarEventProps[] & { uid: string }) => {
        const { uid, ...rest } = item; // Extract uid and the rest of the properties
        return rest; // Return the rest of the properties
      });
    }

    return data.event;
  } else {
    return [];
  }
}

export async function enterCalendarEvent(event: calendarEventProps[]) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const eventWithUid = event.map((e) => ({ ...e, uid: user.displayName })); // Add uid to each event object
    const eventsRef = doc(db, "calendarEvents", "allEvents"); // Reference to the 'allEvents' document
    await setDoc(eventsRef, { event: eventWithUid }, { merge: true }); // Store the event under the user's uid
  }
}

export async function getFoodItems(): Promise<FoodItemProps[]> {
  const foodItemsRef = doc(db, "menu", "allFoodItems");
  const foodItemsSnap = await getDoc(foodItemsRef);

  if (foodItemsSnap.exists()) {
    const data = foodItemsSnap.data();

    if (data && data.foodItems) {
      data.foodItems = data.foodItems.map((item: FoodItemProps & { uid: string }) => {
        const { uid, ...rest } = item; // Extract uid and the rest of the properties
        return rest; // Return the rest of the properties
      });
    }

    return data.foodItems;
  } else {
    return [] as FoodItemProps[];
  }
}

export async function enterFoodItem(foodItem: FoodItemProps) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const foodItemWithUid = { ...foodItem, uid: user.displayName }; // Add uid to the food item object
    // console.log("food item with uid", foodItemWithUid);
    const foodItemsRef = doc(db, "menu", "allFoodItems"); // Reference to the 'allFoodItems' document

    // Get the existing data
    const docSnap = await getDoc(foodItemsRef);

    let foodItems = [];
    if (docSnap.exists()) {
      foodItems = docSnap.data().foodItems || [];
    }

    // Append the new food item
    foodItems.push(foodItemWithUid);

    // Update the document
    try {
      await setDoc(foodItemsRef, { foodItems }, { merge: true });
    } catch (error) {
      throw new Error(`Failed to update document: ${error}`);
    }
  }
}

export async function editFoodItem(foodItem: FoodItemProps) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const foodItemWithUid = { ...foodItem, uid: user.displayName! }; // Add uid to the food item object
    const foodItemsRef = doc(db, "menu", "allFoodItems"); // Reference to the 'allFoodItems' document

    // Get the existing data
    const docSnap = await getDoc(foodItemsRef);

    if (!docSnap.exists()) {
      return; // End the function if docSnap does not exist
    }

    const foodItems: (FoodItemProps & { uid: string })[] = docSnap.data().foodItems || [];

    // Find the index of the food item with the matching id
    const index = foodItems.findIndex((item) => item.foodId === foodItem.foodId);

    if (index === -1) {
      return; // End the function if foodId does not exist in the document
    }
    foodItems[index] = foodItemWithUid;

    // Update the document
    try {
      await setDoc(foodItemsRef, { foodItems }, { merge: true });
    } catch (error) {
      throw new Error(`Failed to update document: ${error}`);
    }
  }
}

export async function deleteFoodItem(foodIdToDelete: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  const foodItemsRef = doc(db, "menu", "allFoodItems");

  try {
    const docSnap = await getDoc(foodItemsRef);

    if (!docSnap.exists()) {
      console.error("No food items document found.");
      return;
    }

    const foodItems: (FoodItemProps & { uid: string })[] = docSnap.data().foodItems || [];

    // Remove the food item with the given foodId
    const updatedFoodItems = foodItems.filter((item) => item.foodId !== foodIdToDelete);

    // Update Firestore
    await setDoc(foodItemsRef, { foodItems: updatedFoodItems }, { merge: true });

    // Delete associated image
    try {
      await deleteMenuItemImage(foodIdToDelete);
    } catch (error) {
      console.error(`Failed to delete menu item image for foodId ${foodIdToDelete}:`, error);
    }
  } catch (error) {
    console.error("Failed to delete food item:", error);
  }
}

export async function createOrderDocument(orderDetails: AddToCart) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("No authenticated user found");

  const processedBy = user.displayName || user.email || "unknown";
  const receiptId = generateReceiptId(); // e.g., "CAKE-X8F4L9"
  const receiptDate = new Date().toISOString();

  const orderData = {
    ...orderDetails,
    processedBy,
    receiptId,
    receiptDate,
  };

  const formattedDate = format(new Date(), "dd-MMM-yyyy-HH_mm_ss");
  const docId = `${formattedDate}_${receiptId}`;

  const orderRef = doc(collection(db, "orderHistory"), docId);

  try {
    await setDoc(orderRef, orderData);
    console.log("Order successfully created:", receiptId);
  } catch (error) {
    console.error("Error creating order document:", error);
    throw error;
  }
}

export async function getAllOrders(): Promise<
  (AddToCart & {
    processedBy: string;
    receiptDate: string;
    receiptId: string;
  })[]
> {
  try {
    const ordersRef = collection(db, "orderHistory");
    const querySnapshot = await getDocs(ordersRef);

    const orders = querySnapshot.docs.map(
      (doc) =>
        doc.data() as AddToCart & {
          processedBy: string;
          receiptDate: string;
          receiptId: string;
        }
    );

    console.log("Orders retrieved successfully:", orders);
    return orders;
  } catch (error) {
    console.error("Error retrieving orders:", error);
    throw error;
  }
}

export async function getLastNOrders(n: number): Promise<
  (AddToCart & {
    processedBy: string;
    receiptDate: string;
    receiptId: string;
  })[]
> {
  const orderHistoryRef = collection(db, "orderHistory");
  const q = query(orderHistoryRef, orderBy("receiptDate", "desc"), limit(n));

  try {
    const querySnapshot = await getDocs(q);
    const lastNOrders = querySnapshot.docs.map(
      (doc) =>
        doc.data() as AddToCart & {
          processedBy: string;
          receiptDate: string;
          receiptId: string;
        }
    );

    console.log("Last N Orders:", lastNOrders);
    return lastNOrders;
  } catch (error) {
    console.error("Error fetching last N orders:", error);
    throw error;
  }
}

export async function getOrdersInRange(
  from: string,
  to: string
): Promise<
  (AddToCart & {
    processedBy: string;
    receiptDate: string;
    receiptId: string;
  })[]
> {
  const ordersCollection = collection(db, "orderHistory");
  const startDate = new Date(from).toISOString();
  const endDate = new Date(new Date(to).setDate(new Date(to).getDate() + 1)).toISOString();

  const q = query(ordersCollection, where("receiptDate", ">=", startDate), where("receiptDate", "<", endDate));

  try {
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(
      (doc) =>
        doc.data() as AddToCart & {
          processedBy: string;
          receiptDate: string;
          receiptId: string;
        }
    );

    console.log("Orders in range:", orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders in range:", error);
    throw error;
  }
}
