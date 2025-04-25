// src/components/UniversityDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, Button } from "@material-tailwind/react";
import { UniversityMap } from "./UniversityMap";

export const UniversityDetails = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarUniversities, setSimilarUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        // In a real implementation, you would fetch by ID from the API
        const response = await axios.get(`http://localhost:5001/api/university/${id}`);
        setUniversity(response.data);
        
        if (response.data.similarUniversities) {
          setSimilarUniversities(response.data.similarUniversities);
        } else {
          // Fallback to fetch similar universities if not included in response
          const similarResponse = await axios.get(`http://localhost:5001/api/similar-universities/${id}`);
          setSimilarUniversities(similarResponse.data.similarUniversities || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching university details:", error);
        setLoading(false);
        
        // Fallback data for demo purposes
        if (!university) {
          setUniversity(getDummyUniversity());
        }
      }
    };

    fetchUniversityDetails();
  }, [id, university]);

  const getDummyUniversity = () => ({
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
    computerScienceRank: 75,
    engineeringRank: 68,
    businessRank: 92,
    nursingRank: 45
  });

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

  // Prepare rankings data for display
  const rankings = {
    overall: university.rankNumber,
    computerScience: university.computerScienceRank,
    engineering: university.engineeringRank,
    business: university.businessRank,
    nursing: university.nursingRank,
    psychology: university.psychologyRank,
    finance: university.financeRank,
    economics: university.economicsRank,
    management: university.managementRank,
    marketing: university.marketingRank,
    artificialIntelligence: university.artificialIntelligenceRank,
    aerospace: university.aerospaceRanking
  };

  // Filter out null or undefined rankings
  const filteredRankings = Object.entries(rankings)
    .filter(([_, value]) => value !== null && value !== undefined)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section with university name and image */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={university.images?.large || university.images?.medium || "https://via.placeholder.com/1200x400?text=University+Campus"}
          alt={university.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <Typography variant="h1" className="text-3xl md:text-5xl font-bold">
              {university.name}
            </Typography>
            <div className="flex items-center mt-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
                {university.public ? "Public" : "Private"}
              </span>
              <span className="text-white text-lg">{university.location}</span>
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
              {university.description || `${university.name} is a ${university.public ? 'public' : 'private'} university located in ${university.location}. It is ranked ${university.rank} by US News & World Report.`}
            </Typography>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Acceptance Rate</div>
                <div className="text-xl font-semibold text-gray-800">{university.acceptance_rate ? `${Math.round(university.acceptance_rate * 100)}%` : "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Graduation Rate</div>
                <div className="text-xl font-semibold text-gray-800">{university.graduation_rate ? `${Math.round(university.graduation_rate * 100)}%` : university.graduation_rate_display || "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Student-Faculty Ratio</div>
                <div className="text-xl font-semibold text-gray-800">{university.student_faculty_ratio || "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Annual Cost</div>
                <div className="text-xl font-semibold text-gray-800">{university.avg_annual_cost ? `$${university.avg_annual_cost.toLocaleString()}` : "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Median Earnings</div>
                <div className="text-xl font-semibold text-gray-800">{university.median_earnings ? `$${university.median_earnings.toLocaleString()}` : "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Overall Ranking</div>
                <div className="text-xl font-semibold text-gray-800">{university.rank || (university.rankNumber ? `#${university.rankNumber}` : "N/A")}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Setting</div>
                <div className="text-xl font-semibold text-gray-800">{university.urbanicity ? university.urbanicity.charAt(0).toUpperCase() + university.urbanicity.slice(1) : "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">School Type</div>
                <div className="text-xl font-semibold text-gray-800">{university.school_type || "N/A"}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">SAT Math Range</div>
                <div className="text-xl font-semibold text-gray-800">
                  {university.SATMAT25 && university.SATMAT75 
                    ? `${university.SATMAT25}-${university.SATMAT75}` 
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* University Map */}
          <UniversityMap university={university} />

          {/* Academic Programs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Academic Programs
            </Typography>
            
            <div className="space-y-4">
              <Typography variant="h3" className="text-xl font-semibold text-gray-800">
                Available Degree Types
              </Typography>
              <div className="flex flex-wrap gap-2">
                {university.degree_types?.map((degree, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {degree}
                  </span>
                )) || "N/A"}
              </div>
              
              <Typography variant="h3" className="text-xl font-semibold text-gray-800 mt-6">
                Program Rankings
              </Typography>
              {Object.keys(filteredRankings).length === 0 ? (
                <p className="text-gray-600">No specific program rankings available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(filteredRankings)
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
              )}
            </div>
          </div>

          {/* SAT Score Analysis */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              SAT Score Analysis
            </Typography>
            
            {university.SATMAT25 && university.SATMAT75 && university.SATVR25 && university.SATVR75 ? (
              <div>
                <div className="mb-6">
                  <Typography variant="h3" className="text-lg font-semibold mb-2">SAT Score Ranges</Typography>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Typography variant="h4" className="text-md font-semibold text-gray-700">Math Section</Typography>
                      <div className="flex justify-between mt-2">
                        <Typography variant="small" className="text-gray-600">25th Percentile</Typography>
                        <Typography variant="small" className="font-bold">{university.SATMAT25}</Typography>
                      </div>
                      <div className="flex justify-between mt-1">
                        <Typography variant="small" className="text-gray-600">75th Percentile</Typography>
                        <Typography variant="small" className="font-bold">{university.SATMAT75}</Typography>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Typography variant="h4" className="text-md font-semibold text-gray-700">Verbal Section</Typography>
                      <div className="flex justify-between mt-2">
                        <Typography variant="small" className="text-gray-600">25th Percentile</Typography>
                        <Typography variant="small" className="font-bold">{university.SATVR25}</Typography>
                      </div>
                      <div className="flex justify-between mt-1">
                        <Typography variant="small" className="text-gray-600">75th Percentile</Typography>
                        <Typography variant="small" className="font-bold">{university.SATVR75}</Typography>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Typography variant="h3" className="text-lg font-semibold mb-2">What These Scores Mean</Typography>
                  <Typography variant="paragraph" className="text-gray-700">
                    The ranges above represent the middle 50% of admitted students. Scores at or above the 75th 
                    percentile would strengthen your application, while scores below the 25th percentile might 
                    make admission more challenging.
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography variant="paragraph" className="text-gray-600">SAT score information not available for this university.</Typography>
            )}
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
                href={university.website || `https://www.google.com/search?q=${encodeURIComponent(university.name)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
              <button 
                onClick={() => navigate(-1)}
                className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Results
              </button>
            </div>
          </div>

          {/* Similar Universities */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h3" className="text-xl font-bold text-gray-800 mb-4">
              Similar Universities
            </Typography>
            {similarUniversities.length > 0 ? (
              <div className="space-y-4">
                {similarUniversities.map((similar, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <img 
                      src={similar.image || "https://via.placeholder.com/100"} 
                      alt={similar.name} 
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <Typography variant="small" className="font-medium text-gray-800">
                        {similar.name}
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {similar.rank || ""}
                      </Typography>
                    </div>
                  </div>
                ))}
                <Link 
                  to="/results" 
                  className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800"
                >
                  View all universities
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <Typography variant="paragraph" className="text-gray-600">No similar universities available.</Typography>
            )}
          </div>

          {/* Key Statistics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Typography variant="h3" className="text-xl font-bold text-gray-800 mb-4">
              Key Statistics
            </Typography>
            <div className="space-y-3">
              {[
                { label: "University Type", value: university.public ? "Public" : "Private" },
                { label: "Rank", value: university.rank || (university.rankNumber ? `#${university.rankNumber}` : "N/A") },
                { label: "Urbanicity", value: university.urbanicity ? university.urbanicity.charAt(0).toUpperCase() + university.urbanicity.slice(1) : "N/A" },
                { label: "School Size", value: university.school_size ? university.school_size.toLocaleString() : "N/A" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                  <Typography variant="small" className="text-gray-600">{item.label}</Typography>
                  <Typography variant="small" className="font-semibold">{item.value}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};