import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { handleRemoveProject } from "../lib/projectManagement"; // Import the shared function
import { supabase } from "../lib/supabase";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import Alert from '../components/ui/alert';
import { AlertCircle } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  technologies: string[];
  rating: number;
}

const RemoveProjects = () => {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>("");

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

  // Remove the local handleRemoveProject function


  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Remove Projects</CardTitle>

        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              {error}
            </Alert>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Existing Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                        <div className="mt-2 space-y-1">
                          <p>Price: ${project.price}</p>
                          <p>Category: {project.category}</p>
                          <p>Rating: {project.rating}/5</p>
                          <p>Technologies: {project.technologies.join(", ")}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveProject(project.id, setProjects, setError)} // Use the shared function

                        className="px-3 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveProjects;
