import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import  Alert  from '../components/ui/alert';
import { default as AlertDescription } from '../components/ui/alert';
import { AlertCircle, Book } from "lucide-react";

// Updated interface to match working implementation
interface Project {
  id?: string;
  title: string;
  description: string;
  price: number;
  preview_image: string;
  difficulty_level: string;
  category: string;  // Changed back to string
  technologies: string[];
  rating: number;
  created_at?: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>("");
  
  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    price: 0,
    preview_image: "",
    difficulty_level: "Beginner",
    category: "",  // Changed back to string
    technologies: [],
    rating: 0
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.email === "nikeanand97@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        navigate("/login");
      }
    };

    checkAdminStatus();
  }, [navigate, setIsAdmin]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Error fetching projects: " + error.message);
      } else {
        setProjects(data || []);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "technologies") {
      // Split comma-separated values into array
      const techArray = value.split(",").map(tech => tech.trim()).filter(Boolean);
      setNewProject(prev => ({ ...prev, technologies: techArray }));
    } else {
      setNewProject(prev => ({
        ...prev,
        [name]: name === "price" || name === "rating" ? Number(value) : value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!newProject.title || !newProject.description || newProject.price < 0 || !newProject.category) {
      setError("Please fill in all required fields and ensure price is valid");
      return false;
    }
    if (newProject.rating < 0 || newProject.rating > 5) {
      setError("Rating must be between 0 and 5");
      return false;
    }
    if (!Array.isArray(newProject.technologies) || newProject.technologies.length === 0) {
      setError("Please add at least one technology");
      return false;
    }
    return true;
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const { error: submitError } = await supabase
        .from("projects")
        .insert({
          title: newProject.title,
          description: newProject.description,
          price: newProject.price,
          preview_image: newProject.preview_image,
          difficulty_level: newProject.difficulty_level,
          category: newProject.category,
          technologies: newProject.technologies,
          rating: newProject.rating
        });

      if (submitError) {
        console.error("Supabase error:", submitError);
        setError("Error adding project: " + submitError.message);
        return;
      }

      const { data: updatedData, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Project added but error refreshing list: " + fetchError.message);
      } else {
        setProjects(updatedData || []);
        setNewProject({
          title: "",
          description: "",
          price: 0,
          preview_image: "",
          difficulty_level: "Beginner",
          category: "",
          technologies: [],
          rating: 0
        });
        setError("");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred while adding the project");
    }
  };

  const handleRemoveProject = async (projectId?: string) => {
    if (!projectId) return;

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      setError("Error removing project: " + deleteError.message);
    } else {
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-6 h-6" />
            Admin Dashboard
          </CardTitle>
          
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddProject} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                  <input
                    type="text"
                    name="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={newProject.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                  <textarea
                    name="description"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={newProject.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                    <input
                      type="number"
                      name="price"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={newProject.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Difficulty Level
                    <select
                      name="difficulty_level"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={newProject.difficulty_level}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                  <select
                    name="category"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={newProject.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI">AI</option>
                    <option value="IoT">IoT</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Blockchain">Blockchain</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Technologies (comma-separated)
                  <input
                    type="text"
                    name="technologies"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={newProject.technologies.join(", ")}
                    onChange={handleInputChange}
                    placeholder="React, TypeScript, Node.js"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Preview Image URL
                  <input
                    type="text"
                    name="preview_image"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={newProject.preview_image}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Rating
                  <input
                    type="number"
                    name="rating"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={newProject.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setNewProject({
                  title: "",
                  description: "",
                  price: 0,
                  preview_image: "",
                  difficulty_level: "Beginner",
                  category: "",
                  technologies: [],
                  rating: 0
                })}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
          </form>

         
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;