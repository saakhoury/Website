'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import Image from 'next/image'
import ProjectCard from '@/components/ProjectCard'
import SearchBar from '@/components/SearchBar'
import YearFilter from '@/components/YearFilter'
import TypeFilter from '@/components/TypeFilter'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [selectedType, setSelectedType] = useState('all')

  const projects = [
    {
      title: "BlockFundr (BETA)",
      description: "Researched WEB3 adoption complexities, culminating in BlockFundr(BETA), a blockchain crowdfunding platform.",
      type: "project",
      tags: ["MetaMask", "Ethereum", "Solidity"],
      year: 2024,
      link: "#",
      image: "/projects/blockchain.png"
    },
    {
      title: "AI Summarizer",
      description: "An SEO tool developed to summarize text & generate embeddings for key-word identification",
      type: "project",
      tags: ["Word2Vec", "Byte Pair Encoding", "Sentence Transformers"],
      year: 2024,
      link: "#",
      image: "/ai-summarizer.png"
    },
    {
      title: "Pathfinding Neural Network",
      description: "Self-Driving car with NN (no libraries) + Genetic Algorithms, A* Pathfinding, & Dijkstra's Algorithm",
      type: "project",
      tags: ["Python", "Lessons"],
      year: 2024,
      link: "#",
      image: "/pathfinding.png"
    },
    {
      title: "Connect",
      description: "A full stack social media platform with authentication, explore features and a user-friendly UI for 300+ users",
      type: "project",
      tags: ["React", "Typescript", "Shadcn"],
      year: 2024,
      link: "#",
      image: "/connect.png"
    },
    {
      title: "Quant Trading Model",
      description: "Developed a trading strategy using unsupervised learning techniques to optimize investment decisions.",
      type: "project",
      tags: ["Portfolio Optimization", "NLTK", "Scikit-learn"],
      year: 2024,
      link: "#",
      image: "/quant-trading.png"
    },
    {
      title: "Guardian",
      description: "Wearable AI system integrating real-time video and audio streaming with emotion and object detection analytics.",
      type: "project",
      tags: ["Convolution Neural Networks", "Tensorflow"],
      year: 2024,
      link: "#",
      image: "/guardian.png"
    },
    {
      title: "Résuview",
      description: "An AR environment that displays individuals' résumes next to their faces at networking events.",
      type: "project",
      tags: ["AR Development", "Networking"],
      year: 2024,
      link: "#",
      image: "/resuview.png"
    },
    {
      title: "Pixel (Dall-E Clone)",
      description: "An AI image generator MERN app with responsive React.js design, MongoDB indexing & more.",
      type: "project",
      tags: ["OPENAI", "MongoDB", "RTK Query"],
      year: 2024,
      link: "#",
      image: "/pixel.png"
    },
    {
      title: "OCR from Scratch",
      description: "Built an Optical Character Recognition system from scratch in PyTorch, implementing the CNN architecture, data preprocessing, and training pipeline.",
      type: "project",
      tags: ["PyTorch", "Lessons"],
      year: 2024,
      link: "#",
      image: "/ocr-no-imports.png"
    },
    {
      title: "VLM from Scratch",
      description: "Built a Multimodal Vision Language Model in PyTorch, coding the Contrastive Learning, Vision Transformer, and multi-head attention mechanisms from scratch.",
      type: "project",
      tags: ["PyTorch", "Lessons"],
      year: 2024,
      link: "#",
      image: "/vlm-scratch.png"
    },
    {
      title: "Stable Diffusion from Scratch",
      description: "Developed Stable Diffusion from scratch in PyTorch, implementing the Variational Autoencoder (VAE), CLIP model, and UNet architecture.",
      type: "project",
      tags: ["PyTorch", "Lessons"],
      year: 2024,
      link: "#",
      image: "/stable-diffusion.png"
    },
    {
      title: "UnderThetoque",
      description: "TD-sponsored online resource platform serving 15,000+ immigrants, expats, & refugees. Combined UI/UX research and prioritizing user stories in designing the interface.",
      tags: ["UI/UX", "Leadership", "Social Impact"],
      type: "company",
      year: 2021,
      link: "#"
    },
    {
      title: "DECA Chapter President",
      description: "Led Bloor Collegiate Chapter. Competed against 120,000 students worldwide, achieving 4th place at ICDC. Qualified through role-play performances and cluster exams.",
      tags: ["Leadership", "Public Speaking", "Competition"],
      type: "volunteer",
      year: 2021,
      link: "#"
    },
    {
      title: "StemFellowship Leadership",
      description: "Mentored 30+ teams leading to three international wins. Taught data analytics, computational thinking, and scientific writing. Led Physics Match discussions.",
      tags: ["Leadership", "Data Analytics", "Scientific Writing"],
      type: "volunteer",
      year: 2021,
      link: "#"
    },
    {
      title: "Programming Instructor",
      description: "Python, C++, Arduino, Java instructor at theCubeStemSchool. Taught programming fundamentals, robotics, and computer science concepts with hands-on learning approach.",
      tags: ["Teaching", "Programming", "Robotics"],
      type: "volunteer",
      year: 2021,
      link: "#"
    },
    {
      title: "Youth Leadership Program",
      description: "Founded and led Toastmasters youth program with Executive Dave Bachan. Provided Toronto Youth POC with leadership and public speaking mentorship.",
      tags: ["Leadership", "Public Speaking", "Program Development"],
      type: "volunteer",
      year: 2021,
      link: "#"
    },
    {
      title: "InLoop",
      description: "Led development of Deloitte-backed gaming platform incentivizing news literacy. Generated $30K+ pipeline interest.",
      tags: ["React", "Stripe", "Docker"],
      type: "company",
      year: 2021,
      link: "#"
    },
    {
      title: "Flourish",
      description: "Built a web platform for mental health professionals to streamline practice management, improve client engagement, and enhance therapeutic outcomes.",
      tags: ["Mental Health", "SaaS", "Full Stack"],
      type: "company",
      year: 2022,
      link: "#"
    },
    {
      title: "American Idol",
      description: "Season 6 contestant. Performed in front of millions, reaching top rounds through vocal performances and stage presence.",
      tags: ["Vocal Performance", "Television", "Competition"],
      type: "music",
      year: 2023,
      link: "#"
    },
    {
      title: "International Indian Icon",
      description: "Winner of Season 1. Showcased versatility in both Western and Indian classical styles, judged by industry professionals.",
      tags: ["Vocal Performance", "Competition", "Winner"],
      type: "music",
      year: 2022,
      link: "#"
    },
    {
      title: "Self-Driving Rover",
      description: "(In-Progress) An autonomous vehicle using PID controllers and sensors.",
      type: "project",
      tags: ["Perception", "World Modelling"],
      year: 2024,
      link: "#"
    },
    {
      title: "AutoRithm",
      description: "Developed a robotic arm solution for precise food packaging & algorithms to optimize delivery routes",
      type: "project",
      tags: ["PHP", "EV3", "Robot-C", "Ultrasonic Sensors"],
      year: 2024,
      link: "#"
    },
    {
      title: "NN Lessons",
      description: "Learning About Backpropagation, Classification, Gradient_Descent, K-Means Clustering, NN from Scratch, Optimizers, Regularization, & RNNs",
      type: "project",
      tags: ["Python", "Lessons"],
      year: 2024,
      link: "#"
    },
    {
      title: "Contrastive Loss",
      description: "Compute the contrastive loss introduced by Yann LeCun et al. in the paper 'Dimensionality Reduction by Learning an Invariant Mapping.'",
      type: "project",
      tags: ["Tensorflow", "NumPy", "Lessons"],
      year: 2024,
      link: "#"
    }
  ]

  // Get unique years from projects and sort them in descending order
  const availableYears = Array.from(
    new Set(projects.map(project => project.year).filter((y): y is number => typeof y === 'number'))
  ).sort((a, b) => b - a)

  // Update filtered projects logic to include tag filtering
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    
    const matchesYear = selectedYear === 'all' || (typeof project.year === 'number' && project.year === selectedYear)
    
    const matchesType = selectedType === 'all' || project.type === selectedType
    
    return matchesSearch && matchesYear && matchesType
  })

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <main className="flex flex-col">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full p-8 sm:p-10 lg:p-16 min-h-screen
                     bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0F] to-[#0A0A0B]"
        >
          <div className="max-w-4xl mx-auto">
          <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-20">
              <motion.div
              initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <Image
                  src="/logos/image2.png"
                  alt="Sanskriti Akhoury - Handwritten Signature"
                  width={200}
                  height={60}
                  className="w-auto h-8 sm:h-10 lg:h-12"
                  priority
                />
              </motion.div>
              
              <div className="space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl text-[#E1E1E3]">
                    Software Engineering @ UWaterloo.
                  </h2>
                  <h2 className="text-md text-[#9A9AA2] max-w-4xl leading-relaxed">
                    Developing ML & infrastructure tools to enhance enterprise product offerings.
                  </h2>
                </div>
                <p className="text-md text-[#9A9AA2] max-w-3xl leading-relaxed">
                  Singer. American Idol S6. International Indian Icon Winner S1. <br/>
                  3x Startup Founder sponsored by TD, IFDS, & Deloitte.
                </p>
              
              {/* Socials */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex space-x-6"
              >
                <motion.a
                  href="https://www.linkedin.com/in/sanskriti-akhoury/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A9AA2] hover:text-white transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <FaLinkedin size={20} />
                </motion.a>
                <motion.a
                  href="https://github.com/saakhoury"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A9AA2] hover:text-white transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <FaGithub size={20} />
                </motion.a>
                <motion.a
                  href="https://x.com/akhourysa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A9AA2] hover:text-white transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <FaTwitter size={20} />
                </motion.a>
              </motion.div>
              </div>
              
              <div className="flex-shrink-0 flex items-center justify-center">
                <Image
                  src="/logos/goose.png"
                  alt="Goose reading a book"
                  width={140}
                  height={140}
                  className="mt-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] transition-all duration-300"
                />
              </div>
            </motion.div>
              </div>
          </div>

          <div className="mt-11 text-[#000000]">
          </div>
            {/* New Experience Section - Resume Style */}
          <div className="space-y-6 mt-25">
            <h3 className="text-sm tracking-[0.2em] text-[#9A9AA2] uppercase flex items-center gap-6">
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-[1px] bg-gradient-to-r from-[#9A9AA2] to-[#9A9AA2]/50"
              />
                WORK EXPERIENCE
            </h3>
              
              <div className="space-y-6">
                {/* Coinbase */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/17 hover:via-red-500/17 hover:to-purple-600/17 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/coinbase.png"
                        alt="Coinbase logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          Coinbase
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">incoming</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        Incoming SWE Intern
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        software engineering • internship
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Coinbase AM */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/4 hover:via-red-500/4 hover:to-purple-600/4 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/cbam.png"
                        alt="Coinbase AM logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          Coinbase AM
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">2024</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        SWE Intern
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        software engineering • internship
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* HammingAI */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/4 hover:via-red-500/4 hover:to-purple-600/4 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/hamming.png"
                        alt="HammingAI logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          HammingAI
                        </h4>
                        <span className="text-sm font-light text-gray-400 group-hover:text-gray-300 transition-colors">present</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        Undergraduate ML Researcher
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        machine learning • research
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* NGen Canada */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/4 hover:via-red-500/4 hover:to-purple-600/4 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/ngen.png"
                        alt="NGen Canada logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          NGen Canada
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">2024</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        Data Engineer Intern
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        software engineering • internship
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* UW Blueprint */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/4 hover:via-red-500/4 hover:to-purple-600/4 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/blueprint.png"
                        alt="UW Blueprint logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          UW Blueprint
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">2024</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        Software Developer
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        software development • social good
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Front Row Ventures */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/4 hover:via-red-500/4 hover:to-purple-600/4 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/frv.png"
                        alt="Front Row Ventures logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          Front Row Ventures
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">2024</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        Data Associate
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        data analysis • fellowship
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* InLoop */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="relative group hover:bg-gradient-to-br hover:from-pink-400/4 hover:via-red-500/4 hover:to-purple-600/4 p-3 rounded-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Glowing gradient border */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-pink-400/60 via-red-500/60 to-purple-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:shadow-[0_0_25px_rgba(236,72,153,1)] group-hover:w-full w-0" />
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-800/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-gray-700/50 transition-colors">
                      <Image
                        src="/logos/inloop.png"
                        alt="InLoop logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-light text-gray-300 group-hover:text-white transition-colors">
                          InLoop
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">2023</span>
                      </div>
                      <p className="text-sm font-light text-gray-300 mt-1 leading-tight group-hover:text-gray-200 transition-colors">
                        Software Engineer & Co-founder
                      </p>
                      <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                        software engineering • startup • co-founder
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Simple Divider */}
        <div className="w-full px-8 sm:px-10 lg:px-16 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-[1px] bg-[#1A1A1C]" />
          </div>
        </div>

        {/* Projects Section */}
        <motion.section 
          className="w-full p-8 sm:p-10 lg:p-16 min-h-screen
                     bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0F] to-[#0A0A0B]"
        >
          <div className="max-w-4xl mx-auto mt-1">
            <div className="relative">
              <div className="absolute -inset-x-4 -inset-y-6 bg-white/[0.02] rounded-lg -z-10" />
              <h3 className="text-sm tracking-[0.2em] text-[#9A9AA2] uppercase mb-6 flex items-center gap-3">
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: 24 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-[1px] bg-gradient-to-r from-gray-400 to-gray-400/50"
              />
              FEATURED WORK
            </h3>
            <div className="flex gap-4 mb-4">
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
              >
                <ProjectCard project={{ ...project, image: project.image || "" }} />
              </motion.div>
            ))}
            </div>
          </div>
        </motion.section>

        {/* Footer Section */}
        <footer className="w-full p-8 sm:p-12 lg:p-16 border-t border-[#1A1A1C]
                     bg-gradient-to-b from-[#0A0A0B] to-[#0A0A0B]"
        >
          <div className="max-w-4xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="space-y-6">
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Image
                    src="/logos/footertext1.png"
                    alt="Always glad to meet someone new"
                    width={450}
                    height={68}
                    className="w-full max-w-[450px] h-auto"
                    priority
                  />
                  <Image
                    src="/logos/goose2.png"
                    alt="Goose with flower"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                </div>
                
                {/* Social Links in Footer */}
                <div className="flex justify-center space-x-8 pt-4">
                  <a
                    href="https://www.linkedin.com/in/sanskriti-akhoury/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9A9AA2] hover:text-white transition-all duration-300 text-lg hover:scale-110 transform"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href="https://github.com/saakhoury"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9A9AA2] hover:text-white transition-all duration-300 text-lg hover:scale-110 transform"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href="https://x.com/akhourysa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9A9AA2] hover:text-white transition-all duration-300 text-lg hover:scale-110 transform"
                  >
                    <FaTwitter size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
