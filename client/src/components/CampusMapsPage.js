import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Input, Button, Card, CardBody, CardFooter, Tabs, TabsHeader, TabsBody, Tab, TabPanel } from '@material-tailwind/react';
import { UniversityMap } from './UniversityMap';

export const CampusMapsPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        // Fetch a list of universities for the map view
        const response = await axios.post('http://localhost:5001/api/universities', {
          searchQuery: { match_all: {} }
        });
        
        setUniversities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setError('Failed to load universities. Please try again later.');
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      
      let response;
      if (activeTab === 'location') {
        response = await axios.get(`http://localhost:5001/api/universities/search/location?query=${encodeURIComponent(searchQuery)}`);
        setUniversities(response.data);
      } else {
        response = await axios.post('http://localhost:5001/api/universities', {
          searchQuery: {
            multi_match: {
              query: searchQuery,
              fields: ['name^2', 'location']
            }
          }
        });
        setUniversities(response.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error searching universities:', error);
      setError('Failed to search universities. Please try again.');
      setLoading(false);
    }
  };

  const handleSelectUniversity = (university) => {
    setSelectedUniversity(university);
    
    // Scroll to map section
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <Typography variant="h1" className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          University Campus Maps
        </Typography>
        <Typography variant="paragraph" className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
          Explore interactive 3D maps of university campuses. Search by university name or location to get a better feel for their environment and surroundings.
        </Typography>
      </div>

      {/* Search Section */}
      <div className="mb-8 max-w-2xl mx-auto">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader>
            <Tab value="all">
              Search All
            </Tab>
            <Tab value="location">
              Search by Location
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="all">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  label="Search for a university"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-grow"
                />
                <Button 
                  className="bg-blue-600 text-white px-6"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </TabPanel>
            <TabPanel value="location">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  label="Enter a city, state, or region"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-grow"
                />
                <Button 
                  className="bg-blue-600 text-white px-6"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>

      {/* Map Section */}
      <div id="map-section" className="mb-12">
        <UniversityMap university={selectedUniversity || {
          name: "University of Toledo",
          location: "Toledo, OH",
          _id: "default",
          coordinates: {
            latitude: 41.657716,
            longitude: -83.61366
          }
        }} />
      </div>

      {/* Universities List Section */}
      <div className="mb-8">
        <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-6">
          {activeTab === 'location' ? 'Universities in Selected Location' : 'All Universities'}
        </Typography>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.length > 0 ? (
              universities.map((university, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardBody className="p-4">
                    <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
                      {university.name}
                    </Typography>
                    <Typography variant="paragraph" className="text-gray-600 mb-1">
                      {university.location}
                    </Typography>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {university.public ? 'Public' : 'Private'}
                      </span>
                      {university.rank && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {university.rank}
                        </span>
                      )}
                    </div>
                  </CardBody>
                  <CardFooter className="pt-0">
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white flex items-center gap-2"
                      onClick={() => handleSelectUniversity(university)}
                    >
                      View Campus Map
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">
                No universities found. Try a different search term.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 