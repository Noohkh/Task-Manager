import React, { useState } from 'react';

// --- Portfolio Data ---
const portfolioData = {
  name: "John Doe",
  title: "Full Stack Developer",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  about: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
  skills: [
    "JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL"
  ],
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-featured online shopping platform with payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"]
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity application for teams to manage projects and tasks.",
      technologies: ["React", "Express", "PostgreSQL", "Socket.io"]
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather forecasting application with interactive maps.",
      technologies: ["React", "D3.js", "OpenWeather API"]
    }
  ],
  experience: [
    {
      id: 1,
      company: "Tech Innovations Inc.",
      position: "Senior Full Stack Developer",
      duration: "2020 - Present",
      description: "Led development of customer-facing applications serving 100k+ users."
    },
    {
      id: 2,
      company: "Digital Solutions LLC",
      position: "Frontend Developer",
      duration: "2018 - 2020",
      description: "Developed responsive web applications using React and Redux."
    }
  ]
};

// --- Components ---

const Header = () => (
  <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <img 
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80" 
        alt="Profile" 
        className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-2">{portfolioData.name}</h1>
      <p className="text-xl md:text-2xl opacity-90 mb-4">{portfolioData.title}</p>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <a href={`mailto:${portfolioData.email}`} className="flex items-center hover:underline">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {portfolioData.email}
        </a>
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {portfolioData.location}
        </span>
      </div>
    </div>
  </header>
);

const AboutSection = () => (
  <section className="py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-200">About Me</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        {portfolioData.about}
      </p>
    </div>
  </section>
);

const SkillsSection = () => (
  <section className="py-12 px-4 bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-200">Skills</h2>
      <div className="flex flex-wrap gap-3">
        {portfolioData.skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section className="py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-200">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {portfolioData.projects.map(project => (
          <div key={project.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ExperienceSection = () => (
  <section className="py-12 px-4 bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-200">Experience</h2>
      <div className="space-y-8">
        {portfolioData.experience.map(exp => (
          <div key={exp.id} className="border-l-4 border-indigo-500 pl-4 py-1">
            <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
            <p className="text-lg text-indigo-600">{exp.company} • {exp.duration}</p>
            <p className="text-gray-600 mt-2">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-200">Contact Me</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your message here..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          {submitSuccess && (
            <div className="text-green-600 text-center py-2">
              Thank you for your message! I'll get back to you soon.
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <p className="mb-4">© {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
      <div className="flex justify-center space-x-6">
        <a href="#" className="hover:text-indigo-300 transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-indigo-300 transition-colors">GitHub</a>
        <a href="#" className="hover:text-indigo-300 transition-colors">Twitter</a>
      </div>
    </div>
  </footer>
);

function Portfolio() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Portfolio;