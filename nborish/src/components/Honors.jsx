import React from "react";
import { Award } from "lucide-react";
import { Frame, SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";

export default function Honors({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <section id="honors" className="shell">
      <SectionHead index="05" title="Honors &amp; Activities" sub="Competitions and recognitions." />
      <div ref={ref} className={`honors-grid reveal${visible ? " revealed" : ""}`}>
        {profile.honors.map((h, i) => (
          <Frame className="honor-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="honor-icon-wrap">
              <Award size={20} aria-hidden="true" />
            </div>
            <h4>{h.title}</h4>
            {h.org && <div className="org">{h.org}</div>}
            {h.note && <div className="note">{h.note}</div>}
          </Frame>
        ))}
      </div>
    </section>
  );
}
