// src/components/UniversityDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Typography, Button } from "@material-tailwind/react";

export const UniversityDetails = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        // In a real implementation, you would fetch by ID
        const response = await axios.get(`http://localhost:5001/api/university/${id}`);
        setUniversity(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching university details:", error);
        setLoading(false);
      }
    };

    fetchUniversityDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Typography variant="h4" className="text-gray-800 mb-4">
          University not found
        </Typography>
        <Link to="/results">
          <Button className="bg-blue-600">Back to Results</Button>
        </Link>
      </div>
    );
  }

  // For demo purposes
  const dummyUniversity = {
    name: "University of Example",
    location: "Example City, EX",
    rank: "#120",
    public: true,
    description: "A comprehensive research university founded in 1890, known for its strong programs in STEM fields and liberal arts. The campus spans over 1,200 acres with state-of-the-art facilities.",
    avg_annual_cost: 28500,
    graduation_rate: 0.85,
    median_earnings: 72000,
    acceptance_rate: 0.22,
    student_faculty_ratio: "14:1",
    popular_majors: ["Computer Science", "Business Administration", "Engineering", "Psychology", "Biology"],
    campus_life: "Vibrant campus life with over 200 student organizations, Division I athletics, and modern residence halls.",
    notable_alumni: ["Jane Doe, Nobel Prize Winner", "John Smith, Tech CEO", "Alex Johnson, Pulitzer Prize Winner"],
    website: "https://www.example.edu",
    images: {
      medium: "https://www.usnews.com/dims4/USNEWS/c9c9473/17177859217/thumbnail/336x336/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2F73%2F572381fc3b005a0cc3313798904bbf%2FStock_Campus_Drone_23AUG19_00008.jpg",
      large: "https://www.usnews.com/dims4/USNEWS/c9c9473/17177859217/thumbnail/336x336/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2F73%2F572381fc3b005a0cc3313798904bbf%2FStock_Campus_Drone_23AUG19_00008.jpg",
    },
    rankings: {
      overall: 120,
      computerScience: 75,
      engineering: 68,
      business: 92,
      nursing: 45
    }
  };

  const uni = university || dummyUniversity;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section with university name and image */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={uni.images?.large || uni.images?.medium || "https://via.placeholder.com/1200x400?text=University+Campus"}
          alt={uni.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <Typography variant="h1" className="text-3xl md:text-5xl font-bold">
              {uni.name}
            </Typography>
            <div className="flex items-center mt-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
                {uni.public ? "Public" : "Private"}
              </span>
              <span className="text-white text-lg">{uni.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Overview
            </Typography>
            <Typography variant="paragraph" className="text-gray-700">
              {uni.description}
            </Typography>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Acceptance Rate</div>
                <div className="text-xl font-semibold text-gray-800">{Math.round(uni.acceptance_rate * 100)}%</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Graduation Rate</div>
                <div className="text-xl font-semibold text-gray-800">{Math.round(uni.graduation_rate * 100)}%</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Student-Faculty Ratio</div>
                <div className="text-xl font-semibold text-gray-800">{uni.student_faculty_ratio}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Annual Cost</div>
                <div className="text-xl font-semibold text-gray-800">${uni.avg_annual_cost?.toLocaleString()}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Median Earnings</div>
                <div className="text-xl font-semibold text-gray-800">${uni.median_earnings?.toLocaleString()}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Overall Ranking</div>
                <div className="text-xl font-semibold text-gray-800">#{uni.rankings?.overall || uni.rankNumber}</div>
              </div>
            </div>
          </div>

          {/* Academic Programs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Academic Programs
            </Typography>
            
            <div className="space-y-4">
              <Typography variant="h3" className="text-xl font-semibold text-gray-800">
                Popular Majors
              </Typography>
              <div className="flex flex-wrap gap-2">
                {uni.popular_majors?.map((major, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {major}
                  </span>
                ))}
              </div>
              
              <Typography variant="h3" className="text-xl font-semibold text-gray-800 mt-6">
                Program Rankings
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(uni.rankings || {})
                  .filter(([key]) => key !== 'overall')
                  .map(([program, rank], index) => {
                    // Convert camelCase to Title Case (e.g., computerScience -> Computer Science)
                    const formattedProgram = program
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{formattedProgram}</span>
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-md">#{rank}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Campus Life */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Campus Life
            </Typography>
            <Typography variant="paragraph" className="text-gray-700 mb-6">
              {uni.campus_life}
            </Typography>
            
            {/* Campus Images - This would be a gallery in a real implementation */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-32 rounded-lg overflow-hidden bg-gray-200">
                  <img 
                    src={`https://via.placeholder.com/300x200?text=Campus+${item}`} 
                    alt={`Campus view ${item}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h3" className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </Typography>
            <div className="space-y-3">
              <a 
                href={uni.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
              <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save to Favorites
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Similar Universities */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h3" className="text-xl font-bold text-gray-800 mb-4">
              Similar Universities
            </Typography>
            <div className="space-y-4">
              {[
                {
                  name: "University of Comparison",
                  rank: "#135",
                  image: "https://via.placeholder.com/100"
                },
                {
                  name: "Example State University",
                  rank: "#142",
                  image: "https://via.placeholder.com/100"
                },
                {
                  name: "Another Tech University",
                  rank: "#118",
                  image: "https://via.placeholder.com/100"
                }
              ].map((similar, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <img 
                    src={similar.image} 
                    alt={similar.name} 
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <Typography variant="small" className="font-medium text-gray-800">
                      {similar.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      Ranked {similar.rank}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/results" 
              className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800"
            >
              View all similar universities
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Notable Alumni */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h3" className="text-xl font-bold text-gray-800 mb-4">
              Notable Alumni
            </Typography>
            <ul className="space-y-2">
              {uni.notable_alumni?.map((alumnus, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {alumnus}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};