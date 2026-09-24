import React from "react";
import { ExternalLink } from "lucide-react";
import { Frame, Chip, SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";

export default function Projects({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <section id="projects" className="shell">
      <SectionHead
        index="03"
        title="Projects"
        sub="Each tagged like a model prediction — class and confidence."
      />
      <div ref={ref} className={`project-grid reveal${visible ? " revealed" : ""}`}>
        {profile.projects.map((p, i) => (
          <Frame
            className="project-card"
            key={i}
            label={p.class}
            conf={p.confidence}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="project-tags">
              {p.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="project-actions">
              {p.link && (
                <a
                  className="project-link"
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${p.name} (opens in new tab)`}
                >
                  <ExternalLink size={12} aria-hidden="true" /> View project
                </a>
              )}
            </div>
          </Frame>
        ))}
      </div>
    </section>
  );
}
