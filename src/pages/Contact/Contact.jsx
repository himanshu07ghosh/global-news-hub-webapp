import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiInstagram, FiFacebook, FiSend, FiMapPin, FiTwitter } from 'react-icons/fi';
import './Contact.css';

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <motion.div
      className="container contact-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Contact Us | Global News Hub</title>
      </Helmet>

      <div className="contact-page__header">
        <span className="section-eyebrow">Get In Touch</span>
        <h1>Contact Us</h1>
        <p>Questions, feedback, or a story tip? We&apos;d love to hear from you.</p>
      </div>

      <div className="contact-page__grid">
        <div className="contact-page__info">
          <div className="contact-page__info-item">
            <FiMail size={20} />
            <div>
              <h4>Email</h4>
              <a href="mailto:himanshu07ghosh@gmail.com">himanshu07ghosh@gmail.com</a>
            </div>
          </div>
          <div className="contact-page__info-item">
            <FiMapPin size={20} />
            <div>
              <h4>Location</h4>
              <span>Dehradun, Uttarakhand, India</span>
            </div>
          </div>
          <div className="contact-page__info-item">
            <FiInstagram size={20} />
            <div>
              <h4>Instagram</h4>
              <a href="https://instagram.com/himanshu_ghosh_" target="_blank" rel="noopener noreferrer">
                @himanshu_ghosh_
              </a>
            </div>
          </div>
          <div className="contact-page__info-item">
            <FiFacebook size={20} />
            <div>
              <h4>Facebook</h4>
              <a 
                href="https://www.facebook.com/people/Himanshu-Ghosh/100082314949941/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Himanshu Ghosh
              </a>
            </div>
          </div>
          <div className="contact-page__info-item">
            <FiTwitter size={20} />
            <div>
              <h4>Twitter / X</h4>
              <a 
                href="https://x.com/himanshughosh_" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                @himanshughosh_
              </a>
            </div>
          </div>
        </div>

        <form className="contact-page__form" onSubmit={handleSubmit}>
          <div className="contact-page__field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
          </div>
          <div className="contact-page__field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="contact-page__field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Message <FiSend size={15} />
          </button>
          {submitted && <p className="contact-page__success">Thanks for reaching out! We&apos;ll get back to you soon.</p>}
        </form>
      </div>
    </motion.div>
  );
}

export default Contact;