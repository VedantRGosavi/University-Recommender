import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const IntegrationFeaturesPage = () => {
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({
    universityName: '',
    programName: '',
    applicationDate: '',
    status: 'pending'
  });
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [results, setResults] = useState(null);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/track-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });
      const data = await response.json();
      setResults({
        ...results,
        applicationTracking: data.tracking
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUniversitySelect = async (e) => {
    const universityId = e.target.value;
    setSelectedUniversity(universityId);
    setLoading(true);
    try {
      // Get Virtual Tour Info
      const tourResponse = await fetch(`/api/virtual-tour/${universityId}`);
      const tourData = await tourResponse.json();

      // Get Alumni Network Info
      const alumniResponse = await fetch(`/api/alumni-network/${universityId}`);
      const alumniData = await alumniResponse.json();

      setResults({
        ...results,
        virtualTour: tourData.tourInfo,
        alumniNetwork: alumniData.networkAnalysis
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Integration Features
        </Typography>
        <Typography variant="body1" paragraph>
          Track your applications, explore virtual tours, and connect with alumni networks.
        </Typography>

        <Grid container spacing={4}>
          {/* Application Tracking Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Application Tracking
            </Typography>
            <form onSubmit={handleApplicationSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="University Name"
                    value={applicationData.universityName}
                    onChange={(e) => setApplicationData({
                      ...applicationData,
                      universityName: e.target.value
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Program Name"
                    value={applicationData.programName}
                    onChange={(e) => setApplicationData({
                      ...applicationData,
                      programName: e.target.value
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Application Date"
                    value={applicationData.applicationDate}
                    onChange={(e) => setApplicationData({
                      ...applicationData,
                      applicationDate: e.target.value
                    })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={applicationData.status}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        status: e.target.value
                      })}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="submitted">Submitted</MenuItem>
                      <MenuItem value="under_review">Under Review</MenuItem>
                      <MenuItem value="accepted">Accepted</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Track Application'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Virtual Tour & Alumni Network Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Virtual Tour & Alumni Network
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select University</InputLabel>
                  <Select
                    value={selectedUniversity}
                    onChange={handleUniversitySelect}
                    label="Select University"
                  >
                    <MenuItem value="1">University 1</MenuItem>
                    <MenuItem value="2">University 2</MenuItem>
                    <MenuItem value="3">University 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Results Section */}
          {results && (
            <Grid item xs={12}>
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Results
                </Typography>
                <Grid container spacing={3}>
                  {results.applicationTracking && (
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Application Status
                          </Typography>
                          <Typography variant="body1">
                            {results.applicationTracking}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {results.virtualTour && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Virtual Tour Information
                          </Typography>
                          <Typography variant="body1">
                            {results.virtualTour}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {results.alumniNetwork && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Alumni Network Analysis
                          </Typography>
                          <Typography variant="body1">
                            {results.alumniNetwork}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default IntegrationFeaturesPage; 