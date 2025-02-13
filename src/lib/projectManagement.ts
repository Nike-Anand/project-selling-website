import { supabase } from "./supabase";

export const handleRemoveProject = async (projectId: string, setProjects: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
        setError("Error removing project: " + error.message);
    } else {
        setProjects((projects) => projects.filter((project) => project.id !== projectId));
    }
};
