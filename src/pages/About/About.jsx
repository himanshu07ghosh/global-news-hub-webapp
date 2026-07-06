import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiGlobe, FiZap, FiShield, FiUsers } from 'react-icons/fi';
import './About.css';

const VALUES = [
  { icon: FiGlobe, title: 'Global Coverage', desc: 'Stories aggregated from trusted sources across every continent.' },
  { icon: FiZap, title: 'Real-Time Updates', desc: 'Headlines refresh live so you are always reading the latest version of the story.' },
  { icon: FiShield, title: 'Source Transparency', desc: 'Every article links back to its original publisher — nothing is rewritten.' },
  { icon: FiUsers, title: 'Built For Everyone', desc: 'A clean, distraction-free reading experience on any device.' },
];

function About() {
  return (
    <motion.div
      className="container about-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>About Us | Global News Hub</title>
      </Helmet>

      <div className="about-page__hero">
        <span className="section-eyebrow">Our Story</span>
        <h1>One Place. Every Story.</h1>
        <p>
          Global News Hub was built to solve a simple problem: keeping up with the world
          shouldn&apos;t mean juggling a dozen different apps and tabs. We pull top headlines,
          breaking news, and in-depth coverage from trusted publishers into a single, fast,
          beautifully designed feed — so you can stay informed without the noise.
        </p>
      </div>

      <div className="about-page__values">
        {VALUES.map((v) => (
          <div className="about-page__value-card" key={v.title}>
            <v.icon size={26} />
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="about-page__team">
        <h2>Built By</h2>
        <p>
          Global News Hub is an independent project designed and developed by{' '}
          <strong>Himanshu Ghosh</strong>, a Computer Science Engineering student based in
          Dehradun, Uttarakhand, India. It was built as a portfolio-grade full-stack project
          to demonstrate modern React architecture, clean UI/UX design, and real-world API
          integration.
        </p>
      </div>
    </motion.div>
  );
}

export default About;
