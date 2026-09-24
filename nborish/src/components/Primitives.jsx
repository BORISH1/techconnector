import React from "react";

// Corner-bracket "viewfinder" frame — signature motif echoing both
// object-detection bounding boxes and engineering blueprint registration marks.
export function Frame({ children, className = "", label, conf, style }) {
  return (
    <div className={`frame ${className}`} style={style}>
      <span className="frame-corner tl" />
      <span className="frame-corner tr" />
      <span className="frame-corner bl" />
      <span className="frame-corner br" />
      {(label || conf !== undefined) && (
        <div className="frame-tag">
          {label && <span>{label}</span>}
          {conf !== undefined && <span className="frame-conf">{conf.toFixed(2)}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Chip({ children }) {
  return <span className="chip">{children}</span>;
}

export function SectionHead({ index, title, sub }) {
  return (
    <div className="section-head">
      <div className="section-eyebrow">
        <span className="section-index">{index}</span>
        <span className="section-line" />
      </div>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}
