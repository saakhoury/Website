'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import ExperienceCard from '@/components/ExperienceCard'
import ProjectCard from '@/components/ProjectCard'
import SearchBar from '@/components/SearchBar'
import Modal from '@/components/Modal'
import YearFilter from '@/components/YearFilter'
import ProjectModal from '@/components/ProjectModal'
import TypeFilter from '@/components/TypeFilter'

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  year: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('all')

  const experiences = [
    {
      title: "Software Engineer Intern",
      company: "Coinbase AM",
      period: "Present",
      shortDescription: "Building enterprise-scale blockchain solutions",
      longDescription: "Working on enterprise-scale blockchain solutions and infrastructure development. Contributing to cryptocurrency trading and wallet management systems.",
      skills: ["Blockchain", "Distributed Systems", "Go", "React", "AWS"],
      logo: "/logos/coinbase.png",
      projects: [
        {
          title: "Cryptocurrency Infrastructure",
          description: "Developing and maintaining critical blockchain infrastructure components",
          tags: ["Blockchain", "Go", "Infrastructure"]
        },
        {
          title: "Trading Systems",
          description: "Contributing to high-performance cryptocurrency trading systems",
          tags: ["Trading", "Performance", "Distributed Systems"]
        }
      ]
    },
    {
      title: "Machine Learning Engineer",
      company: "HammingAI",
      period: "2023",
      shortDescription: "Developing AI/ML solutions for enterprise",
      longDescription: "Developing and implementing machine learning solutions for enterprise applications. Focus on natural language processing and computer vision systems.",
      skills: ["Machine Learning", "Python", "PyTorch", "Computer Vision", "NLP"],
      logo: "/logos/hamming.png",
      projects: [
        {
          title: "ML Pipeline Development",
          description: "Built scalable machine learning pipelines for data processing and model training",
          tags: ["ML Ops", "Pipeline", "Python"]
        },
        {
          title: "Computer Vision Systems",
          description: "Implemented computer vision solutions for enterprise applications",
          tags: ["Computer Vision", "Deep Learning", "PyTorch"]
        },
        {
          title: "NLP Models",
          description: "Developed natural language processing models for text analysis and generation",
          tags: ["NLP", "Transformers", "Machine Learning"]
        }
      ]
    },
    {
      title: "Data Engineering Intern",
      company: "NGen Canada",
      period: "Jan 2022 - Present",
      shortDescription: "Worked on advanced manufacturing and AI initiatives.",
      longDescription: "Focused on data engineering and analytic tasks such as building data pipelines and ML models. Completed and contributed to 16 projects accelerating impact.",
      skills: ["Data Engineering", "Machine Learning", "Project Management"],
      logo: "/logos/ngen.png",
      projects: [
        {
          title: "MERN Dashboard",
          description: "A dashboard with GDP forecasting & dynamic maps, analyzing ridings vs. investments to optimize project funding nationally.",
          tags: ["ARIMA", "SVMs", "Government"]
        },
        {
          title: "Recommender System",
          description: "Engineered a self-supervised GNN-based recommender system with custom message aggregations & NADAM.",
          tags: ["Graph Neural Networks", "LLMs", "FP-Growth"]
        },
        {
          title: "Salesforce Pipeline",
          description: "Built a Salesforce pipeline & reconciliation framework with automated schema handling via Airflow & Snowflake.",
          tags: ["Airflow", "BulkAPI", "Snowflake"]
        },
        {
          title: "LLM Framework",
          description: "Developed an LLM framework to improve chatbot data retrieval for an ISED report on 'AI Use Cases in Advanced Manufacturing'.",
          tags: ["Control Flow Graphs", "RAG", "RL"]
        }
      ]
    },
    {
      title: "Infrastructure Project Developer",
      company: "UW Blueprint",
      period: "Jun 2021 - Dec 2021",
      shortDescription: "Tech for social good",
      longDescription: "Tech for social good. Specialized in infrastructure development, utilizing tools like Kubernetes, AWS, Docker, Prisma, Terraform, and Heroku to enhance project efficiency and deployment processes.",
      skills: ["Kubernetes", "AWS", "Docker", "Prisma", "Terraform", "Heroku"],
      logo: "/logos/blueprint.png",
      projects: [
        {
          title: "Entity Service Migration",
          description: "Migrated entity service to Prisma, refactored queries, verified & validated functionality of table updates with Postman/PSQL.",
          tags: ["Prisma", "Postman", "PSQL"]
        },
        {
          title: "Heroku Deployment",
          description: "Automated Heroku deployment with Terraform, cutting setup time by 50% and ensuring consistent environment configuration.",
          tags: ["Heroku", "Terraform"]
        },
        {
          title: "Token Generation",
          description: "Developed a CLI tool with Firebase Admin SDK for automated token generation, streamlining local testing and workflow integration.",
          tags: ["Firebase", "Typescript"]
        }
      ]
    },
    {
      title: "Data Analyst & Webmaster",
      company: "Front Row Ventures",
      period: "Mar 2020 - May 2021",
      shortDescription: "Optimized funding processes through data-driven strategies",
      longDescription: "Optimized funding processes through data-driven strategies, managed web content, and analyzed key performance metrics to support investment decisions. Completed two-month venture capital bootcamp, gaining exclusive insights from local VCs and founders.",
      skills: ["Data Analysis", "Web Development", "Venture Capital"],
      logo: "/logos/frv1.png",
      projects: [
        {
          title: "Field-Trip FRV Training",
          description: "Produced detailed memos on private companies, offering recommendations on risk mitigation, market entry strategies",
          tags: ["Venture Capital", "Economics"]
        },
        {
          title: "Airtable Automations",
          description: "Automated cleaning & consolidation of duplicated entries on Airtable, reducing manual cleanup time & ensuring integrity.",
          tags: ["Airtable", "Data"]
        }
      ]
    },
    {
      title: "CoFounder & Vice President",
      company: "InLoop",
      period: "Mar 2020 - May 2021",
      shortDescription: "Led development of Deloitte-backed gaming platform",
      longDescription: "Led the development of a fullstack Deloitte-backed digital gaming platform incentivizing news literacy. Implemented a React leaderboard and optimized workflows using Agile and Jira, raising user engagement. Engineered an ecommerce app using Stripe, Payload CMS, & Docker, optimizing client interaction. Commanded a team of 30+ members & generated a pipeline interest of $30K+, with $7K net revenue.",
      skills: ["React", "Stripe", "Docker", "Agile", "Team Leadership"],
      logo: "/logos/inloop.png",
      projects: [
        {
          title: "Digital Gaming Platform",
          description: "Led the development of a fullstack Deloitte-backed digital gaming platform incentivizing news literacy",
          tags: ["React", "Gaming", "News Literacy"]
        },
        {
          title: "React Leaderboard",
          description: "Implemented a React leaderboard and optimized workflows using Agile and Jira, raising user engagement",
          tags: ["React", "Agile", "Jira"]
        },
        {
          title: "Ecommerce Application",
          description: "Engineered an ecommerce app using Stripe, Payload CMS, & Docker, optimizing client interaction",
          tags: ["Stripe", "Payload CMS", "Docker"]
        },
        {
          title: "Team Leadership",
          description: "Commanded a team of 30+ members & generated a pipeline interest of $30K+, with $7K net revenue",
          tags: ["Leadership", "Revenue Generation"]
        }
      ]
    }
  ]

  const projects = [
    {
      title: "BlockFundr (BETA)",
      description: "Researched WEB3 adoption complexities, culminating in BlockFundr(BETA), a blockchain crowdfunding platform.",
      type: "project",
      tags: ["MetaMask", "Ethereum", "Solidity"],
      link: "#",
      image: "/projects/blockchain.png"
    },
    {
      title: "AI Summarizer",
      description: "An SEO tool developed to summarize text & generate embeddings for key-word identification",
      type: "project",
      tags: ["Word2Vec", "Byte Pair Encoding", "Sentence Transformers"],
      link: "#",
      image: "/ai-summarizer.png"
    },
    {
      title: "Pathfinding Neural Network",
      description: "Self-Driving car with NN (no libraries) + Genetic Algorithms, A* Pathfinding, & Dijkstra's Algorithm",
      type: "project",
      tags: ["Python", "Lessons"],
      link: "#",
      image: "/pathfinding.png"
    },
    {
      title: "Connect",
      description: "A full stack social media platform with authentication, explore features and a user-friendly UI for 300+ users",
      type: "project",
      tags: ["React", "Typescript", "Shadcn"],
      link: "#",
      image: "/connect.png"
    },
    {
      title: "Quant Trading Model",
      description: "Developed a trading strategy using unsupervised learning techniques to optimize investment decisions.",
      type: "project",
      tags: ["Portfolio Optimization", "NLTK", "Scikit-learn"],
      link: "#",
      image: "/quant-trading.png"
    },
    {
      title: "Guardian",
      description: "Wearable AI system integrating real-time video and audio streaming with emotion and object detection analytics.",
      type: "project",
      tags: ["Convolution Neural Networks", "Tensorflow"],
      link: "#",
      image: "/guardian.png"
    },
    {
      title: "Résuview",
      description: "An AR environment that displays individuals' résumes next to their faces at networking events.",
      type: "project",
      tags: ["AR Development", "Networking"],
      link: "#",
      image: "/resuview.png"
    },
    {
      title: "Pixel (Dall-E Clone)",
      description: "An AI image generator MERN app with responsive React.js design, MongoDB indexing & more.",
      type: "project",
      tags: ["OPENAI", "MongoDB", "RTK Query"],
      link: "#",
      image: "/pixel.png"
    },
    {
      title: "UnderThetoque",
      description: "TD-sponsored online resource platform serving 15,000+ immigrants, expats, & refugees. Combined UI/UX research and prioritizing user stories in designing the interface.",
      tags: ["UI/UX", "Leadership", "Social Impact"],
      type: "company",
      link: "#",
      year: 2021
    },
    {
      title: "DECA Chapter President",
      description: "Led Bloor Collegiate Chapter. Competed against 120,000 students worldwide, achieving 4th place at ICDC. Qualified through role-play performances and cluster exams.",
      tags: ["Leadership", "Public Speaking", "Competition"],
      type: "volunteer",
      image: "/logos/deca.png",
      link: "#",
      year: 2021
    },
    {
      title: "StemFellowship Leadership",
      description: "Mentored 30+ teams leading to three international wins. Taught data analytics, computational thinking, and scientific writing. Led Physics Match discussions.",
      tags: ["Mentorship", "Data Analytics", "Scientific Writing"],
      type: "volunteer",
      image: "/logos/stemfellowship.png",
      link: "#",
      year: 2021
    },
    {
      title: "Programming Instructor",
      description: "Python, C++, Arduino, Java instructor at theCubeStemSchool. Taught programming fundamentals, robotics, and computer science concepts with hands-on learning approach.",
      tags: ["Teaching", "Programming", "Robotics"],
      type: "volunteer",
      image: "/logos/cube.png",
      link: "#",
      year: 2021
    },
    {
      title: "Youth Leadership Program",
      description: "Founded and led Toastmasters youth program with Executive Dave Bachan. Provided Toronto Youth POC with leadership and public speaking mentorship.",
      tags: ["Leadership", "Public Speaking", "Program Development"],
      type: "volunteer",
      image: "/logos/toastmasters.png",
      link: "#",
      year: 2021
    },
    {
      title: "InLoop",
      description: "Led development of Deloitte-backed gaming platform incentivizing news literacy. Generated $30K+ pipeline interest.",
      tags: ["React", "Stripe", "Docker"],
      type: "company",
      link: "#",
      year: 2021
    },
    {
      title: "Flourish",
      description: "Built a web platform for mental health professionals to streamline practice management, improve client engagement, and enhance therapeutic outcomes.",
      tags: ["Mental Health", "SaaS", "Full Stack"],
      type: "company",
      link: "#",
      year: 2022
    },
    {
      title: "American Idol",
      description: "Season 6 contestant. Performed in front of millions, reaching top rounds through vocal performances and stage presence.",
      tags: ["Vocal Performance", "Television", "Competition"],
      type: "music",
      link: "#",
      year: 2023
    },
    {
      title: "International Indian Icon",
      description: "Winner of Season 1. Showcased versatility in both Western and Indian classical styles, judged by industry professionals.",
      tags: ["Vocal Performance", "Competition", "Winner"],
      type: "music",
      link: "#",
      year: 2022
    },
    {
      title: "Self-Driving Rover",
      description: "(In-Progress) An autonomous vehicle using PID controllers and sensors.",
      type: "project",
      tags: ["Perception", "World Modelling"],
      link: "#",
      image: "/self-driving-rover.png"
    },
    {
      title: "AutoRithm",
      description: "Developed a robotic arm solution for precise food packaging & algorithms to optimize delivery routes",
      type: "project",
      tags: ["PHP", "EV3", "Robot-C", "Ultrasonic Sensors"],
      link: "#",
      image: "/autorithm.png"
    },
    {
      title: "NN Lessons",
      description: "Learning About Backpropagation, Classification, Gradient_Descent, K-Means Clustering, NN from Scratch, Optimizers, Regularization, & RNNs",
      type: "project",
      tags: ["Python", "Lessons"],
      link: "#",
      image: "/nn-lessons.png"
    },
    {
      title: "Contrastive Loss",
      description: "Compute the contrastive loss introduced by Yann LeCun et al. in the paper 'Dimensionality Reduction by Learning an Invariant Mapping.'",
      type: "project",
      tags: ["Tensorflow", "NumPy", "Lessons"],
      link: "#",
      image: "/contrastive-loss.png"
    },
    {
      title: "OCR No-Imports",
      description: "Developed an OCR system from scratch in Python using the k-nearest neighbors algorithm to classify images from the MNIST and Fashion-MNIST datasets",
      type: "project",
      tags: ["Python", "Lessons"],
      link: "#",
      image: "/ocr-no-imports.png"
    },
    {
      title: "VLM from Scratch",
      description: "Built a Multimodal Vision Language Model in PyTorch, coding the Contrastive Learning, Vision Transformer, and multi-head attention mechanisms from scratch.",
      type: "project",
      tags: ["PyTorch", "Lessons"],
      link: "#",
      image: "/vlm-scratch.png"
    },
    {
      title: "Stable Diffusion from Scratch",
      description: "Developed Stable Diffusion from scratch in PyTorch, implementing the Variational Autoencoder (VAE), CLIP model, and UNet architecture.",
      type: "project",
      tags: ["PyTorch", "Lessons"],
      link: "#",
      image: "/stable-diffusion.png"
    }
  ]

  // Get unique years from projects and sort them in descending order
  const availableYears = Array.from(
    new Set(projects.map(project => project.year))
  ).sort((a, b) => b - a)

  // Get all unique tags from projects
  const availableTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort()

  // Update filtered projects logic to include tag filtering
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    
    const matchesYear = selectedYear === 'all' || project.year === selectedYear
    
    const matchesType = selectedType === 'all' || project.type === selectedType
    
    return matchesSearch && matchesYear && matchesType
  })

  const openModal = (experience) => {
    setSelectedExperience(experience)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedExperience(null)
  }

  const openProjectModal = (project) => {
    setSelectedProject(project)
    setIsProjectModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsProjectModalOpen(false)
    setSelectedProject(null)
  }

  const cursorColors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    'transparent'
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <main className="flex flex-col lg:flex-row">
        {/* Left Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-16 min-h-screen lg:h-screen lg:overflow-y-auto
                     bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0F] to-[#0A0A0B]"
        >
          <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 2 }}
              className="text-xs tracking-[0.2em] text-[#9A9AA2] uppercase"
            >
              SANSKRITI.AKHOURY
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent 
                          bg-gradient-to-r from-white via-[#EDEDEF] to-[#DCDCE0]"
                whileHover={{ 
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" 
                }}
              >
                SANSKRITI AKHOURY
              </motion.h1>
              <div className="space-y-2">
                <h2 className="text-2xl text-[#E1E1E3]">
                  Software Engineering @ University of Waterloo.
                </h2>
                <h2 className="text-md text-[#9A9AA2] max-w-xl leading-relaxed">
                  Developing AI/ML/infrastructure tools to enhance enterprise product offerings.
                  Interested in developing robust, well-designed products.
                </h2>
              </div>
              <p className="text-md text-[#9A9AA2] max-w-md leading-relaxed">
                Machine Learning Engineer @ HammingAI.<br />
                Software Engineer Intern @ Coinbase Asset Management.
              </p>
              <p className="text-md text-[#9A9AA2] max-w-lg leading-relaxed">
                Singer. American Idol S6. International Indian Icon Winner S1.
              </p>
            </motion.div>
            
            {/* Socials */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-6"
            >
              {['linkedin', 'github', 'twitter', 'devpost', 'mail', 'se-webring'].map((platform) => (
                <motion.a
                  key={platform}
                  href="#"
                  className="text-[#9A9AA2] hover:text-white transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  {platform === 'github' && <FaGithub size={20} />}
                  {platform === 'linkedin' && <FaLinkedin size={20} />}
                  {platform === 'twitter' && <FaTwitter size={20} />}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Experience Section */}
          <div className="space-y-6">
            <h3 className="text-sm tracking-[0.2em] text-[#9A9AA2] uppercase flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#9A9AA2]"></span>
              LATEST EXPERIENCES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[98%]">
              {experiences.map((experience, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => openModal(experience)}
                >
                  <ExperienceCard experience={experience} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Right Section */}
        <motion.section 
          className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-16 min-h-screen lg:h-screen lg:overflow-y-auto 
                     border-t lg:border-t-0 lg:border-l border-[#1A1A1C]
                     bg-gradient-to-b from-[#0D0D0F] via-[#0F0F11] to-[#0D0D0F]"
        >
          {/* About Me Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mb-16 relative group"
          >
            {/* Decorative background elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute -inset-x-4 -inset-y-6 bg-gradient-to-br from-blue-600/[0.07] via-indigo-600/[0.05] to-purple-600/[0.03] -z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl -z-10"
            />

            {/* Header with animated line */}
            <div className="relative">
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-3"
              >
                <motion.span 
                  initial={{ width: 0 }}
                  whileInView={{ width: 24 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="h-[1px] bg-gradient-to-r from-gray-400 to-gray-400/50"
                />
                ABOUT ME
              </motion.h3>
            </div>

            {/* Content with animated border */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative p-6 border border-white/5
                        before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r 
                        before:from-transparent before:via-white/10 before:to-transparent 
                        before:opacity-0 before:-z-10
                        group-hover:before:opacity-100 before:transition-opacity"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-400/90 leading-relaxed font-light">
                  Recent Projects<br />
                  Built a Self-Supervised GNN Recommender System as an internal tool for NGen Canada<br />
                  Developed an AI-Driven GDP Forecasting Tool for Industry Analysis with NGen Canada<br />
                  Learning Complex ML/AI Concepts from BackPropagation to Quant Strategies<br />
                  Currently Building a Self-Driving Rover & Learning VLMs + Stable Diffusion from Scratch
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Projects Section */}
          <div className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 bg-white/[0.02] rounded-lg -z-10" />
            <h3 className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-gray-400"></span>
              FEATURED WORK
            </h3>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
              <YearFilter 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                availableYears={availableYears}
              />
              <TypeFilter
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mb-6"
                onClick={() => openProjectModal(project)}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Modal for Experience Details */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        experience={selectedExperience}
        cursorColors={cursorColors}
      />

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        project={selectedProject}
      />
    </div>
  )
}
