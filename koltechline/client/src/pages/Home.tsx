import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Brain, Rocket, Users, Star, Zap, Target, TrendingUp, Award, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{prefix}{count}{suffix}</span>;
};

// Floating particles background component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary-400/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      <Header />
      
      {/* Dynamic background effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
        }}
      />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 relative">
        <FloatingParticles />
        <motion.div
          className="container mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="max-w-4xl mx-auto" variants={itemVariants}>
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Building the
              <motion.span
                className="gradient-text block mt-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Future of Technology
              </motion.span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              KolTech is an innovative platform for developing websites, mobile applications,
              and AI solutions. We transform your ideas into revolutionary digital products.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="btn-primary flex items-center justify-center neon-glow group min-w-[200px] h-[50px]"
                >
                  Get Started Now
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/portfolio" className="btn-secondary min-w-[200px] h-[50px] flex items-center justify-center">
                  View Our Work
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 tech-pattern relative">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Our Services
            </motion.h2>
            <motion.p
              className="text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Comprehensive IT services to bring your ambitious projects to life
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Code,
                title: 'Web Development',
                description: 'Modern websites and web applications using cutting-edge technologies',
                color: 'from-primary-500 to-primary-600',
                features: ['React & Next.js', 'Node.js Backend', 'Progressive Web Apps']
              },
              {
                icon: Smartphone,
                title: 'Mobile Applications',
                description: 'Native and cross-platform mobile apps for iOS and Android',
                color: 'from-accent-purple to-accent-pink',
                features: ['React Native', 'Swift & Kotlin', 'App Store Optimization']
              },
              {
                icon: Brain,
                title: 'AI Solutions',
                description: 'Intelligent systems and machine learning for business automation',
                color: 'from-accent-green to-primary-500',
                features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision']
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="glass-effect-dark p-8 rounded-2xl group cursor-pointer relative overflow-hidden"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10"
                  style={{
                    background: `linear-gradient(45deg, ${service.color.replace('from-', '').replace('to-', '').split(' ').map(color => {
                      const colorMap: {[key: string]: string} = {
                        'primary-500': '#6366f1',
                        'primary-600': '#4f46e5',
                        'accent-purple': '#8b5cf6',
                        'accent-pink': '#ec4899',
                        'accent-green': '#10b981'
                      };
                      return colorMap[color] || '#6366f1';
                    }).join(', ')})`,
                  }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 relative`}
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon className="w-8 h-8 text-white" />
                  
                  {/* Pulse effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-xl`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">{service.description}</p>
                
                {/* Feature list */}
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-500"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                    >
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-2"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: featureIndex * 0.2,
                        }}
                      />
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                className="text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                About KolTech
              </motion.h2>
              
              <motion.p
                className="text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                We are a team of information technology experts united by a common goal -
                creating innovative solutions that change the world for the better.
              </motion.p>
              
              <motion.p
                className="text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Our KolTechLine platform brings together clients, freelancers, and startups,
                creating an ecosystem for implementing the boldest technological ideas.
              </motion.p>
              
              <motion.div
                className="grid grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { number: 500, label: 'Projects', suffix: '+' },
                  { number: 100, label: 'Clients', suffix: '+' },
                  { number: 50, label: 'Experts', suffix: '+' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="text-2xl font-bold gradient-text group-hover:scale-110 transition-transform"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.2
                      }}
                    >
                      <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                    </motion.div>
                    <motion.div
                      className="text-gray-400 text-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="w-full h-96 glass-effect rounded-2xl flex items-center justify-center mesh-gradient relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Floating icons */}
                <div className="absolute inset-0">
                  {[Globe, Shield, Target, Award].map((Icon, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-white/20"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${15 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        rotate: [0, 180, 360],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                  ))}
                </div>

                <div className="text-center relative z-10">
                  <motion.div
                    animate={{
                      y: [-5, 5, -5],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Rocket className="w-24 h-24 text-white mx-auto mb-4" />
                  </motion.div>
                  <motion.p
                    className="text-white font-semibold text-lg"
                    animate={{
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    Innovation in Action
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(600px circle at 20% 40%, rgba(99, 102, 241, 0.1), transparent 40%)',
              'radial-gradient(600px circle at 80% 60%, rgba(139, 92, 246, 0.1), transparent 40%)',
              'radial-gradient(600px circle at 40% 80%, rgba(16, 185, 129, 0.1), transparent 40%)',
              'radial-gradient(600px circle at 20% 40%, rgba(99, 102, 241, 0.1), transparent 40%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            className="max-w-3xl mx-auto glass-effect-dark p-12 rounded-3xl neon-glow relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)"
            }}
          >
            {/* Animated particles inside CTA */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.3, 0.8, 0.3],
                    x: [-10, 10, -10],
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <motion.h2
              className="text-3xl font-bold text-white mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to Start Your Project?
            </motion.h2>
            
            <motion.p
              className="text-gray-300 mb-8 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join KolTechLine and get access to the best specialists and innovative solutions
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="btn-primary min-w-[160px] h-[50px] flex items-center justify-center"
                >
                  Get Started
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  borderColor: "rgba(99, 102, 241, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/auth"
                  className="btn-secondary min-w-[160px] h-[50px] flex items-center justify-center"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;