import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  DocumentData,
  collection,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { app } from "./firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { calendarEventProps } from "@/components/calendar";
import { FoodItemProps } from "@/components/restaurant/restaurant";
import { deleteMenuItemImage } from "./firebase_storage";
import { OrderProps } from "@/components/restaurant/orders";
import { FirebaseError } from "firebase/app";

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

export async function getKanbanCardDocument() {
  const cardRef = doc(db, "kanban", "allItems");
  const cardSnap = await getDoc(cardRef);

  if (cardSnap.exists()) {
    return cardSnap.data().items;
  } else {
    return null;
  }
}

export async function enterKanbanCardDocument(
  items: Array<{
    title: string;
    id: string;
    column: "inStock" | "runningLow" | "outOfStock" | "restocked";
  }>
) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const itemsWithMarker = items.map((item) => ({
      ...item,
      uid: user.displayName,
    })); // Add uid to each item
    const cardRef = doc(db, "kanban", "allItems");
    await setDoc(cardRef, { items: itemsWithMarker }, { merge: true }); // Store the items with uid
  }
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

    let foodItems: (FoodItemProps & { uid: string })[] = docSnap.data().foodItems || [];

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

export async function createOrderHistoryEntry(orderDetails: OrderProps) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const orderHistoryEntry = {
      ...orderDetails,
      processedBy: user.displayName,
    };

    const orderHistoryRef = doc(collection(db, "orderHistory"));

    try {
      await setDoc(orderHistoryRef, orderHistoryEntry);
      console.log("Order history entry created successfully");
    } catch (error) {
      console.error(`Failed to create order history entry: ${error}`);
      throw new Error(`Failed to create order history entry: ${error}`);
    }
  } else {
    console.error("No authenticated user found");
    throw new Error("No authenticated user found");
  }
}

export async function getLastNOrders(n: number) {
  const orderHistoryRef = collection(db, "OrderHistory");
  const q = query(orderHistoryRef, orderBy("receiptDate", "desc"), limit(n));

  try {
    const querySnapshot = await getDocs(q);
    const lastNOrders: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      lastNOrders.push(doc.data());
    });
    return lastNOrders;
  } catch (error) {
    console.error("Error fetching last N orders: ", error);
    throw new Error("Error fetching last N orders");
  }
}

export async function getOrdersInRange(from: string, to: string): Promise<any[]> {
  const ordersCollection = collection(db, "orderHistory");
  // Convert start date to ISO string directly
  const startDate = new Date(from).toISOString();
  // Add one day to the end date before converting to ISO string to include the entire day
  const endDate = new Date(new Date(to).setDate(new Date(to).getDate() + 1)).toISOString();

  const q = query(
    ordersCollection,
    where("receiptDate", ">=", startDate),
    where("receiptDate", "<", endDate) // Use "<" instead of "<=" to exclude the start of the next day
  );

  try {
    const querySnapshot = await getDocs(q);
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw new Error(`Failed to get orders in range: ${error}`);
  }
}
