import React from "react";
import { GraduationCap, Briefcase, FlaskConical, Code2, FolderKanban, Clock } from "lucide-react";
import { Frame, Chip, SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";

export default function About({ profile }) {
  const [ref, visible] = useReveal();

  const stats = [
    { icon: <FolderKanban size={18} />, value: profile.projects.length, label: "Projects" },
    { icon: <Briefcase size={18} />, value: profile.experience.length, label: "Internships" },
    { icon: <Code2 size={18} />, value: Object.values(profile.skills).flat().length, label: "Skills" },
    { icon: <Clock size={18} />, value: `${profile.education.expected}`, label: "Graduating" },
  ];

  return (
    <section id="about" className="shell">
      <SectionHead index="01" title="About" sub="Summary, education, and current research." />

      {/* Stats bar */}
      <div className={`about-stats reveal${visible ? " revealed" : ""}`}>
        {stats.map((s, i) => (
          <div className="about-stat" key={i}>
            <span className="about-stat-icon">{s.icon}</span>
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label mono">{s.label}</span>
          </div>
        ))}
      </div>

      <div ref={ref} className={`about-grid reveal${visible ? " revealed" : ""}`}>
        <div className="about-summary">
          <p>{profile.summary}</p>

          <div className="research-box">
            <Frame label={profile.research.status}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{profile.research.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>
                {profile.research.description}
              </p>
            </Frame>
          </div>
        </div>

        <Frame label="education">
          <div className="info-row">
            <GraduationCap size={16} aria-hidden="true" />
            <div>
              <span className="lbl">DEGREE</span>
              {profile.education.degree} — {profile.education.specialization}
            </div>
          </div>
          <div className="info-row">
            <Briefcase size={16} aria-hidden="true" />
            <div>
              <span className="lbl">INSTITUTION</span>
              {profile.education.institution}, {profile.education.location}
            </div>
          </div>
          <div className="info-row">
            <FlaskConical size={16} aria-hidden="true" />
            <div>
              <span className="lbl">EXPECTED</span>
              {profile.education.expected}
            </div>
          </div>
          <div className="coursework">
            {profile.education.coursework.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Frame>
      </div>
    </section>
  );
}
