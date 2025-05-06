
export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  image: string;
}

// Mock course data
const courses: Course[] = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites.",
    instructor: "Sarah Johnson",
    duration: "8 weeks",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React concepts like hooks, context, and custom hooks.",
    instructor: "Michael Chen",
    duration: "6 weeks",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Introduction to data analysis, visualization, and basic machine learning concepts.",
    instructor: "Alex Rodriguez",
    duration: "10 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "UX/UI Design Principles",
    description: "Learn the core principles of user experience and interface design.",
    instructor: "Emma Watson",
    duration: "5 weeks",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native.",
    instructor: "David Kim",
    duration: "8 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    title: "Cloud Computing with AWS",
    description: "Master cloud infrastructure and services using Amazon Web Services.",
    instructor: "Priya Patel",
    duration: "7 weeks",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

export const getCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(courses);
    }, 500);
  });
};

export const getCourseById = (id: number): Promise<Course | undefined> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const course = courses.find(course => course.id === id);
      resolve(course);
    }, 300);
  });
};

export const enrollInCourse = (enrollmentData: {
  fullName: string;
  email: string;
  courseId: number;
}): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    // Simulate API delay and processing
    setTimeout(() => {
      // Store enrollment data in localStorage
      const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
      enrollments.push(enrollmentData);
      localStorage.setItem("enrollments", JSON.stringify(enrollments));
      
      // Store selected course
      const course = courses.find(c => c.id === enrollmentData.courseId);
      if (course) {
        localStorage.setItem("selectedCourse", JSON.stringify(course));
        localStorage.setItem("enrolledUser", enrollmentData.fullName);
      }
      
      resolve({ 
        success: true, 
        message: "Enrollment successful" 
      });
    }, 1000);
  });
};
