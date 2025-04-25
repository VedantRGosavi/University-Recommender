// src/components/CompareUniversities.js
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Typography, Button } from "@material-tailwind/react";

export const CompareUniversities = () => {
  const location = useLocation();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would get IDs from query params
    // const params = new URLSearchParams(location.search);
    // const ids = params.getAll('id');
    
    const fetchUniversities = async () => {
      try {
        // Simulate API call with dummy data
        // const response = await axios.post('http://localhost:5001/api/universities/compare', { ids });
        
        // Dummy data for demonstration
        const dummyData = [
          {
            id: "1",
            name: "University A",
            location: "City A, State A",
            rank: "#75",
            rankNumber: 75,
            public: true,
            avg_annual_cost: 25000,
            graduation_rate: 0.82,
            acceptance_rate: 0.35,
            median_earnings: 68000,
            student_faculty_ratio: "16:1",
            images: {
              medium: "https://via.placeholder.com/150?text=Uni+A",
            },
            rankings: {
              computerScience: 80,
              engineering: 65,
              business: 90,
              nursing: 70
            }
          },
          {
            id: "2",
            name: "University B",
            location: "City B, State B",
            rank: "#120",
            rankNumber: 120,
            public: false,
            avg_annual_cost: 52000,
            graduation_rate: 0.89,
            acceptance_rate: 0.18,
            median_earnings: 75000,
            student_faculty_ratio: "8:1",
            images: {
              medium: "https://via.placeholder.com/150?text=Uni+B",
            },
            rankings: {
              computerScience: 45,
              engineering: 38,
              business: 55,
              nursing: 60
            }
          },
          {
            id: "3",
            name: "University C",
            location: "City C, State C",
            rank: "#210",
            rankNumber: 210,
            public: true,
            avg_annual_cost: 18000,
            graduation_rate: 0.71,
            acceptance_rate: 0.65,
            median_earnings: 58000,
            student_faculty_ratio: "20:1",
            images: {
              medium: "https://via.placeholder.com/150?text=Uni+C",
            },
            rankings: {
              computerScience: 150,
              engineering: 120,
              business: 180,
              nursing: 90
            }
          }
        ];
        
        setUniversities(dummyData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Typography variant="h4" className="text-gray-800 mb-4">
          No universities selected for comparison
        </Typography>
        <Link to="/results">
          <Button className="bg-blue-600">Select Universities</Button>
        </Link>
      </div>
    );
  }

  const metrics = [
    { label: "Overall Ranking", key: "rankNumber", formatter: val => `#${val}` },
    { label: "Type", key: "public", formatter: val => val ? "Public" : "Private" },
    { label: "Annual Cost", key: "avg_annual_cost", formatter: val => `$${val?.toLocaleString() || 'N/A'}` },
    { label: "Graduation Rate", key: "graduation_rate", formatter: val => `${Math.round(val * 100)}%` },
    { label: "Acceptance Rate", key: "acceptance_rate", formatter: val => `${Math.round(val * 100)}%` },
    { label: "Median Earnings", key: "median_earnings", formatter: val => `$${val?.toLocaleString() || 'N/A'}` },
    { label: "Student-Faculty Ratio", key: "student_faculty_ratio", formatter: val => val },
    { label: "Computer Science Rank", key: "rankings.computerScience", formatter: val => val ? `#${val}` : 'N/A' },
    { label: "Engineering Rank", key: "rankings.engineering", formatter: val => val ? `#${val}` : 'N/A' },
    { label: "Business Rank", key: "rankings.business", formatter: val => val ? `#${val}` : 'N/A' },
    { label: "Nursing Rank", key: "rankings.nursing", formatter: val => val ? `#${val}` : 'N/A' },
  ];

  // Helper function to get nested properties
  const getNestedValue = (obj, path) => {
    const parts = path.split('.');
    return parts.reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Typography variant="h1" className="text-3xl md:text-4xl font-bold text-gray-800">
          Compare Universities
        </Typography>
        <Typography variant="paragraph" className="text-gray-600 mt-2">
          Side-by-side comparison of selected universities to help you make the best choice.
        </Typography>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          {/* Header row with university names and images */}
          <thead>
            <tr>
              <th className="p-4 text-left w-48 bg-gray-50 border-b"></th>
              {universities.map((uni, index) => (
                <th key={index} className="p-4 bg-white border-b">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={uni.images?.medium || "https://via.placeholder.com/150"}
                        alt={uni.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Typography variant="h4" className="text-lg font-bold text-gray-800">
                      {uni.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {uni.location}
                    </Typography>
                    <Link 
                      to={`/university/${uni.id}`} 
                      className="mt-2 text-blue-600 text-xs hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Metrics rows */}
          <tbody>
            {metrics.map((metric, mIndex) => (
              <tr key={mIndex} className={mIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-4 font-medium text-gray-700 border-b">
                  {metric.label}
                </td>
                {universities.map((uni, uIndex) => {
                  const value = getNestedValue(uni, metric.key);
                  const formattedValue = metric.formatter(value);
                  
                  // Determine if this is the best value among compared universities
                  let isBest = false;
                  if (metric.key === "rankNumber" || metric.key.includes("Rank")) {
                    // For rankings, lower is better
                    isBest = value === Math.min(...universities.map(u => getNestedValue(u, metric.key) || Number.MAX_SAFE_INTEGER));
                  } else if (metric.key === "avg_annual_cost") {
                    // For cost, lower is better
                    isBest = value === Math.min(...universities.map(u => getNestedValue(u, metric.key) || Number.MAX_SAFE_INTEGER));
                  } else if (metric.key === "graduation_rate" || metric.key === "median_earnings" || metric.key === "acceptance_rate") {
                    // For these metrics, higher is better (except acceptance rate which could go either way)
                    isBest = value === Math.max(...universities.map(u => getNestedValue(u, metric.key) || 0));
                  }
                  
                  return (
                    <td 
                      key={uIndex} 
                      className={`p-4 text-center border-b ${isBest ? "font-semibold" : ""}`}
                    >
                      <div className="flex flex-col items-center">
                        {isBest && (
                          <span className="text-xs text-blue-600 mb-1">Best</span>
                        )}
                        <span className={isBest ? "text-blue-800" : "text-gray-800"}>
                          {formattedValue}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions section */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link to="/results">
          <Button variant="outlined" color="blue" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Results
          </Button>
        </Link>
        <Button className="bg-blue-600 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Comparison
        </Button>
        <Button variant="outlined" color="blue" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Comparison
        </Button>
      </div>
    </div>
  );
};