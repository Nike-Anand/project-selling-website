import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";

interface Project {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  technologies: string[];
}

const AdminPage = () => {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    price: 0,
    category: "",
    technologies: [],
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
        console.error(error);
        alert("Error fetching projects");
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    const { error } = await supabase
      .from("projects")
      .insert([newProject]);

    if (error) {
      console.error(error);
      alert("Error adding project");
    } else {
      setProjects([...projects, newProject]);
      setNewProject({
        title: "",
        description: "",
        price: 0,
        category: "",
        technologies: [],
      });
    }
  };

  const handleRemoveProject = async (projectId?: string) => {
    if (!projectId) return; // Ensure projectId is defined

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error(error);
      alert("Error removing project");
    } else {
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  };

  if (!isAdmin) {
    return null; // Prevent rendering the page while checking admin status
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <aside>
        <h2>Project Management</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddProject(); }}>
          <label>
            Title:
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </label>
          <label>
            Description:
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              value={newProject.price}
              onChange={(e) => setNewProject({ ...newProject, price: Number(e.target.value) })}
            />
          </label>
          <label>
            Category:
            <select
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="AI">AI</option>
              <option value="IoT">IoT</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Blockchain">Blockchain</option>
            </select>
          </label>
          <label>
            Technologies:
            <input
              type="text"
              value={newProject.technologies.join(", ")}
              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(", ") })}
            />
          </label>
          <button type="submit">Add Project</button>
        </form>
        <ul>
          {projects.map((project) => (
            <li key={project.id || project.title}> {/* Ensure key is unique */}
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>Price: ${project.price}</p>
              <p>Category: {project.category}</p>
              <p>Technologies: {project.technologies.join(", ")}</p>
              <button onClick={() => handleRemoveProject(project.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </aside>
      <main>{/* Main content */}</main>
    </div>
  );
};

export default AdminPage;
