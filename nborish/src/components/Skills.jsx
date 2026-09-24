import React from "react";
import { SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";

// Category icons and accent colors
const CAT_META = {
  "AI/ML & Research":   { icon: "🤖", color: "var(--accent)" },
  "Technical Writing":  { icon: "✍️", color: "var(--accent-2)" },
  "Programming":        { icon: "💻", color: "#a78bfa" },
  "Web Development":    { icon: "🌐", color: "#f472b6" },
  "Database & Tools":   { icon: "🛠️", color: "#34d399" },
};

export default function Skills({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <section id="skills" className="shell">
      <SectionHead index="04" title="Skills" sub="Technical competencies across AI, web, and systems." />
      <div ref={ref} className={`skills-grid reveal${visible ? " revealed" : ""}`}>
        {Object.entries(profile.skills).map(([cat, list], catIdx) => {
          const meta = CAT_META[cat] || { icon: "⚡", color: "var(--accent)" };
          return (
            <div
              className="skill-cat"
              key={cat}
              style={{ "--cat-color": meta.color, animationDelay: `${catIdx * 0.08}s` }}
            >
              <h4>
                <span className="skill-cat-icon" aria-hidden="true">{meta.icon}</span>
                {" "}{cat}
                <span className="skill-cat-count mono">{list.length}</span>
              </h4>
              <div className="skill-chips">
                {list.map((s) => (
                  <span className="skill-chip" key={s}>{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
