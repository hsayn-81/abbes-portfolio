import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#080808]">
      <Hero />
      <Projects />
      <About />
      <Footer />
    </main>
  );
}