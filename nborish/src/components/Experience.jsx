import React from "react";
import { Chip, SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";

export default function Experience({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <section id="experience" className="shell">
      <SectionHead index="02" title="Experience" sub="Research, AI, and full-stack internships." />
      <div ref={ref} className={`timeline reveal${visible ? " revealed" : ""}`}>
        {profile.experience.map((job, i) => (
          <article className="tl-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="tl-dot" aria-hidden="true" />
            <div className="tl-head">
              <div>
                <div className="tl-role">{job.role}</div>
                <div className="tl-company">{job.company}</div>
                <div className="tl-loc">{job.location}</div>
              </div>
              <div className="tl-period mono">{job.period}</div>
            </div>
            <ul className="tl-bullets">
              {job.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
            <div className="tl-tags">
              {job.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
