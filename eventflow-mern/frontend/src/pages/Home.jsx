import React from "react";
import Hero from "../components/Hero";
import RecentEvents from "../components/RecentEvents";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <RecentEvents />
      <HowItWorks />
      <Features />
      <Stats />
      <Testimonials />
      <Newsletter />
    </>
  );
}
