
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Course } from "@/services/courseService";
import { toast } from "sonner";

const Welcome = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("currentUser");
    if (!username) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Get enrolled user and course
    const enrolledUser = localStorage.getItem("enrolledUser");
    const selectedCourse = localStorage.getItem("selectedCourse");

    if (!enrolledUser || !selectedCourse) {
      toast.error("Enrollment information not found");
      navigate("/courses");
      return;
    }

    setUserName(enrolledUser);
    setCourse(JSON.parse(selectedCourse));
  }, [navigate]);

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  if (!userName || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading enrollment information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-center">
                Welcome, {userName}!
              </CardTitle>
              <CardDescription className="text-lg text-center">
                You are now enrolled in:
              </CardDescription>
              <h2 className="text-2xl font-bold text-blue-600 text-center mt-2">
                {course.title}
              </h2>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="h-48 overflow-hidden rounded-md mx-auto max-w-sm">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="py-4 space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Instructor:</span> {course.instructor}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Duration:</span> {course.duration}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Level:</span> {course.level}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700">
                  Your course materials will be sent to your email shortly. 
                  We're excited to have you join our learning community!
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button 
                onClick={handleBrowseCourses}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse More Courses
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
