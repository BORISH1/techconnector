import React from "react";
import "./styles/global.css";

import profile from "./data/profile.json";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Honors from "./components/Honors";
import Contact from "./components/Contact";
import ChatBot from "./components/ChatBot";
import CanvasBackground from "./components/CanvasBackground";

export default function App() {
  return (
    <div className="app" id="top">
      <CanvasBackground />
      <Nav />
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience profile={profile} />
      <Projects profile={profile} />
      <Skills profile={profile} />
      <Honors profile={profile} />
      <Contact profile={profile} />
      <ChatBot profile={profile} />
    </div>
  );
}
