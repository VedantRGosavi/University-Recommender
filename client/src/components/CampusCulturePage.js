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
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const CampusCulturePage = () => {
  const [loading, setLoading] = useState(false);
  const [studentPreferences, setStudentPreferences] = useState({
    socialPreferences: '',
    activityInterests: '',
    campusEnvironment: '',
    diversityImportance: ''
  });
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/campus-culture-match', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentPreferences)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get recommendations');
      }

      const data = await response.json();
      setResults({
        cultureMatches: data.matches
      });
    } catch (error) {
      console.error('Error:', error);
      setResults({
        error: error.message || 'Failed to fetch recommendations. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setStudentPreferences({
      ...studentPreferences,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Campus Culture & Student Life
        </Typography>
        <Typography variant="body1" paragraph>
          Get personalized university recommendations based on your preferences.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Social Life Preferences"
                name="socialPreferences"
                multiline
                rows={3}
                value={studentPreferences.socialPreferences}
                onChange={handleInputChange}
                placeholder="What kind of social environment are you looking for? (e.g., active campus life, quiet study groups, etc.)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Activity Interests"
                name="activityInterests"
                multiline
                rows={3}
                value={studentPreferences.activityInterests}
                onChange={handleInputChange}
                placeholder="What activities interest you? (e.g., sports, arts, clubs, research)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Campus Environment"
                name="campusEnvironment"
                multiline
                rows={3}
                value={studentPreferences.campusEnvironment}
                onChange={handleInputChange}
                placeholder="What type of campus setting do you prefer? (e.g., urban, rural, suburban)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Diversity Importance"
                name="diversityImportance"
                multiline
                rows={3}
                value={studentPreferences.diversityImportance}
                onChange={handleInputChange}
                placeholder="How important is campus diversity to you? What aspects of diversity matter most?"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Get Recommendations'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {results && (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {results.error ? 'Error' : 'Your Personalized Recommendations'}
            </Typography>
            {results.error ? (
              <Card>
                <CardContent>
                  <Typography color="error">
                    {results.error}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                    {results.cultureMatches}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default CampusCulturePage; 