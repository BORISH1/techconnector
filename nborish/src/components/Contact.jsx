import React from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { FaLinkedin as Linkedin } from "react-icons/fa";
import { SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";

export default function Contact({ profile }) {
  const [ref, visible] = useReveal();
  const year = new Date().getFullYear();

  return (
    <footer id="contact">
      <div className="shell">
        <SectionHead
          index="06"
          title="Contact"
          sub="Reach out for research collaborations, internships, or full-stack work."
        />

        <div ref={ref} className={`contact-inner reveal${visible ? " revealed" : ""}`}>
          <div className="contact-left">
            <div className="contact-links" role="list">
              <a href={`mailto:${profile.contact.email}`} role="listitem" aria-label="Email address">
                <Mail size={16} aria-hidden="true" />
                <span>{profile.contact.email}</span>
              </a>
              <a href={profile.contact.linkedinUrl} target="_blank" rel="noreferrer" role="listitem" aria-label="LinkedIn profile">
                <Linkedin size={16} aria-hidden="true" />
                <span>{profile.contact.linkedin}</span>
              </a>
              <div className="contact-location" role="listitem" aria-label="Location">
                <MapPin size={16} aria-hidden="true" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="contact-availability">
              <span className="pulse" aria-hidden="true" />
              <span>Available for internships &amp; collaborations</span>
            </div>
          </div>

          <div className="contact-form" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem' }}>
            <h3 className="contact-form-title">
              <Send size={16} aria-hidden="true" /> Send a Message
            </h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. 
              Click the button below to send me an email directly.
            </p>
            <a href={`mailto:${profile.contact.email}`} className="btn primary contact-submit" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              <Send size={15} /> Open Email App
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-note mono">
            // built with React &amp; Vite · {year} · {profile.name}
          </p>
          <a href="#top" className="footer-top mono" aria-label="Back to top">back_to_top ↑</a>
        </div>
      </div>
    </footer>
  );
}
