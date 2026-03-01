import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  color: string;
}

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/data/projects.json");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="projects" className="projects">
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Loading projects...</p>
        </div>
      ) : (
        <motion.div
          className="projects-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants}>Featured Projects</motion.h2>

          <div className="projects-grid">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={itemVariants}
                onHoverStart={() => setHoveredId(project.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="project-header">
                  <div
                    className="project-icon"
                    style={{ borderColor: project.color }}
                  >
                    <motion.div
                      className="icon-inner"
                      animate={
                        hoveredId === project.id
                          ? { rotate: 360 }
                          : { rotate: 0 }
                      }
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <h3>{project.title}</h3>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="tech-tag"
                      style={{ borderColor: project.color }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <motion.a
                    href={project.link}
                    className="project-link"
                    style={{ color: project.color, borderColor: project.color }}
                    whileHover={{ x: 5 }}
                  >
                    View Project →
                  </motion.a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
