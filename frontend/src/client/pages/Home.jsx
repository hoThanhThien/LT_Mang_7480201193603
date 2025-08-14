// src/client/pages/Home.jsx
import React from "react";
import Hero from "../components/Hero";
import Destinations from "../components/Destinations";
import PopularTours from "../components/PopularTours";
import About from "../components/About";
import Blog from "../components/Blog";

const Home = () => {
  return (
    <>
      <Hero />
      <Destinations />
      <PopularTours />
      <About />
      <Blog />
    </>
  );
};

export default Home;
