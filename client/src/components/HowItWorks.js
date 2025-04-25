import React from "react";
import { Typography } from "@material-tailwind/react";
import matchingImg from "../res/landingPage.png";
import aiImg from "../res/landingPage.png";
import resultsImg from "../res/landingPage.png";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Input Your Preferences",
      description:
        "Start by entering your SAT scores, career interests, and sports preferences. Our system uses these inputs to understand your academic profile and aspirations.",
      image: matchingImg,
    },
    {
      title: "AI-Powered Matching",
      description:
        "Our advanced algorithm processes your information using multiple factors including academic performance, program rankings, and your specific interests to find the best matches.",
      image: aiImg,
    },
    {
      title: "Get Personalized Results",
      description:
        "Receive a curated list of universities that best match your profile. Each recommendation comes with detailed information about programs, rankings, and why it's a good fit for you.",
      image: resultsImg,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-400 py-20">
        <div className="container mx-auto px-4">
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-bold text-white text-center mb-6"
          >
            How UniMatch Works
          </Typography>
          <Typography
            variant="paragraph"
            className="text-xl text-white text-center max-w-3xl mx-auto"
          >
            Discover how our intelligent matching system helps you find the perfect university fit through a simple, data-driven process.
          </Typography>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="h-48 mb-6 overflow-hidden rounded-xl bg-blue-50 flex items-center justify-center">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <Typography
                variant="h3"
                className="text-2xl font-bold text-gray-800 mb-4"
              >
                {step.title}
              </Typography>
              <Typography
                variant="paragraph"
                className="text-gray-600"
              >
                {step.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Typography
            variant="h2"
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Key Features
          </Typography>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Smart Matching",
                description: "AI-powered algorithm that considers multiple factors",
                icon: "🎯",
              },
              {
                title: "Comprehensive Data",
                description: "Detailed information about programs and universities",
                icon: "📊",
              },
              {
                title: "Career Focused",
                description: "Recommendations aligned with your career goals",
                icon: "💼",
              },
              {
                title: "Sports Integration",
                description: "Consider athletic programs in university matching",
                icon: "🏆",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <Typography
                  variant="h4"
                  className="text-xl font-semibold text-gray-800 mb-2"
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-gray-600"
                >
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <Typography
          variant="h2"
          className="text-3xl font-bold text-gray-800 text-center mb-12"
        >
          Frequently Asked Questions
        </Typography>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "How accurate are the university matches?",
              answer:
                "Our matching algorithm uses real data from universities and considers multiple factors including academic performance, program rankings, and your specific interests to provide highly accurate recommendations.",
            },
            {
              question: "Is my information secure?",
              answer:
                "Yes, we take data privacy seriously. Your information is encrypted and only used for generating university recommendations.",
            },
            {
              question: "How often is university data updated?",
              answer:
                "Our university database is regularly updated to ensure you receive the most current information about programs, rankings, and admission requirements.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Typography
                variant="h5"
                className="text-xl font-semibold text-gray-800 mb-2"
              >
                {faq.question}
              </Typography>
              <Typography
                variant="paragraph"
                className="text-gray-600"
              >
                {faq.answer}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 