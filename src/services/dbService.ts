
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  DocumentData 
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Course } from "@/services/courseService";

// Collection names
const COLLECTIONS = {
  ENROLLMENTS: "enrollments",
  COURSES: "courses"
};

// Add enrollment to Firestore
export const addEnrollment = async (enrollmentData: {
  fullName: string;
  email: string;
  courseId: number;
  userId: string;
}): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.ENROLLMENTS), {
    ...enrollmentData,
    createdAt: new Date()
  });
  return docRef.id;
};

// Get courses from Firestore
export const getFirestoreCourses = async (): Promise<Course[]> => {
  const coursesCollection = collection(db, COLLECTIONS.COURSES);
  const coursesSnapshot = await getDocs(coursesCollection);
  return coursesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: parseInt(doc.id),
      title: data.title,
      description: data.description,
      instructor: data.instructor,
      duration: data.duration,
      level: data.level,
      image: data.image
    };
  });
};

// Get enrollments by user ID
export const getUserEnrollments = async (userId: string): Promise<DocumentData[]> => {
  const enrollmentsCollection = collection(db, COLLECTIONS.ENROLLMENTS);
  const q = query(enrollmentsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Initialize courses in Firestore (run once when setting up the app)
export const initializeCoursesInFirestore = async (courses: Course[]): Promise<void> => {
  const coursesCollection = collection(db, COLLECTIONS.COURSES);
  const coursesSnapshot = await getDocs(coursesCollection);
  
  // Only add courses if collection is empty
  if (coursesSnapshot.empty) {
    for (const course of courses) {
      await addDoc(coursesCollection, course);
    }
  }
};
