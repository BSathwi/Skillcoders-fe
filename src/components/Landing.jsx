import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Users, BookOpen, Award } from 'lucide-react';
import  CourseCard  from './CourseCard';
import { ContactForm } from './ContactForm';
import Navbar from './Navbar';

const featuredCourses = [
  {
    id: '1',
    title: 'Full Stack Web Development',
    description: 'Master modern web development with React, Node.js, and MongoDB',
    duration: '6 months',
    actualPrice: 49999,
    discountPrice: 29999,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1472&q=80',
    internshipAvailable: true,
  },
  {
    id: '2',
    title: 'Data Science & Analytics',
    description: 'Learn Python, Data Analysis, Machine Learning, and Statistics',
    duration: '4 months',
    actualPrice: 39999,
    discountPrice: 24999,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1470&q=80',
    internshipAvailable: true,
  },
  {
    id: '3',
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps with React Native',
    duration: '5 months',
    actualPrice: 44999,
    discountPrice: 27999,
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1470&q=80',
    internshipAvailable: true,
  },
];

export function Hero() {
  return (
    <>
    <Navbar />
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 md:px-12 lg:px-24 h-[92vh] mt-16">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-extrabold leading-tight">
              Elevate Your Tech Career with <span className="text-yellow-300">SkillCoders</span>
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Live interactive courses, guaranteed internships, and expert mentorship to fast-track your success.
            </p>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <Link
                to="/courses"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Browse Courses
              </Link>
              <Link
                to="/register"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1470&q=80"
              alt="Coding workspace"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Why Choose SkillCoders?</h2>
          <p className="mt-4 text-lg text-gray-600">Your gateway to a successful tech career with top-notch learning.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ icon: BookOpen, title: 'Live Sessions', desc: 'Engaging real-time classes with experts.' },
              { icon: Rocket, title: 'Internships', desc: 'Guaranteed placements with top companies.' },
              { icon: Users, title: '24/7 Support', desc: 'Round-the-clock assistance for students.' },
              { icon: Award, title: 'Certification', desc: 'Industry-recognized certification.' }].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
                <feature.icon className="h-12 w-12 text-indigo-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Courses</h2>
          <p className="mt-4 text-lg text-gray-600">Start your learning journey with our top courses.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="mt-12">
            <Link to="/courses" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              View All Courses
            </Link>
          </div>
        </div>
      </div>

      <ContactForm />
    </>
  );
}
