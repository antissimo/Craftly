"use client";

import { useState } from "react";

interface Project {
  id: number;
  title: string;
}

export default function EditPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: "Portfolio Website" },
    { id: 2, title: "Branding Project" },
  ]);

  const deleteProject = (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (confirmed) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <section>
      <h1>Edit Portfolio</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ display: "flex", gap: "1rem" }}>
            {project.title}
            <button onClick={() => deleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
