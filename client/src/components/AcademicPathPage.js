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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const AcademicPathPage = () => {
  const [loading, setLoading] = useState(false);
  const [careerPath, setCareerPath] = useState({
    major: '',
    careerGoal: ''
  });
  const [program, setProgram] = useState('');
  const [results, setResults] = useState(null);

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/career-university-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerPath)
      });
      const data = await response.json();
      setResults({
        ...results,
        careerSuggestions: data.suggestions
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrerequisiteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/prerequisites/${encodeURIComponent(program)}`);
      const data = await response.json();
      setResults({
        ...results,
        prerequisites: data.prerequisites
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
          Academic Path Planning
        </Typography>
        <Typography variant="body1" paragraph>
          Plan your academic journey and discover universities that align with your career goals.
        </Typography>

        <Grid container spacing={4}>
          {/* Career Path Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Career Path Planning
            </Typography>
            <form onSubmit={handleCareerSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Intended Major"
                    value={careerPath.major}
                    onChange={(e) => setCareerPath({ ...careerPath, major: e.target.value })}
                    placeholder="Enter your intended major"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Career Goal"
                    value={careerPath.careerGoal}
                    onChange={(e) => setCareerPath({ ...careerPath, careerGoal: e.target.value })}
                    placeholder="Enter your career goal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Get University Suggestions'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Prerequisites Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Program Prerequisites
            </Typography>
            <form onSubmit={handlePrerequisiteSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Program Name"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="Enter program name (e.g., Computer Science, Business Administration)"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Get Prerequisites'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          {/* Results Section */}
          {results && (
            <Grid item xs={12}>
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Results
                </Typography>
                <Grid container spacing={3}>
                  {results.careerSuggestions && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            University Suggestions
                          </Typography>
                          <Typography variant="body1">
                            {results.careerSuggestions}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {results.prerequisites && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Program Prerequisites
                          </Typography>
                          <Typography variant="body1">
                            {results.prerequisites}
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

export default AcademicPathPage; 