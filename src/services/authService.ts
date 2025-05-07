
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/config/firebase";

// Register new user
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login user
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  return signOut(auth);
};

// Observer for auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};
