import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCourses, Course } from "@/services/courseService";
import { addEnrollment } from "@/services/dbService";
import { auth } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Header from "@/components/Header";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  courseId: z.string().min(1, "Please select a course"),
});

type FormValues = z.infer<typeof formSchema>;

const Enroll = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      courseId: "",
    },
  });

  useEffect(() => {
    const checkAuth = () => {
      if (!auth.currentUser) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
    };

    checkAuth();

    const selectedCourseId = localStorage.getItem("selectedCourseId");
    
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        if (selectedCourseId) {
          form.setValue("courseId", selectedCourseId);
        }
      } catch (error) {
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [navigate, form]);

  const onSubmit = async (data: FormValues) => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to enroll");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      // Add enrollment to Firestore
      await addEnrollment({
        fullName: data.fullName,
        email: data.email,
        courseId: parseInt(data.courseId),
        userId: auth.currentUser.uid
      });

      // Store selected course for welcome page
      const selectedCourse = courses.find(c => c.id === parseInt(data.courseId));
      if (selectedCourse) {
        localStorage.setItem("selectedCourse", JSON.stringify(selectedCourse));
        localStorage.setItem("enrolledUser", data.fullName);
      }

      toast.success("Enrollment successful!");
      navigate("/welcome");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Enrollment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Course Enrollment</CardTitle>
              <CardDescription className="text-center">
                Complete the form below to enroll in your chosen course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Course</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Enrollment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Enroll;
