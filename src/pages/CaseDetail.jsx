import React, { useState, useEffect } from 'react';
import {
  Typography, Container, Box, Button, Paper, Alert, CircularProgress,
  AppBar, Toolbar, IconButton, Grid, Divider, TextField, Card, CardContent,
  List, ListItem, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Send as SendIcon, AudioFile as AudioIcon,
  Description as DocumentIcon, Person as PersonIcon, Schedule as ScheduleIcon,
  MedicalServices as MedicalIcon, Assignment as ReportIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CaseDetail() {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reportText, setReportText] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const navigate = useNavigate();
  const { caseId } = useParams();

 console.log("caseId as string:", caseId, "parsed:", parseInt(caseId));	
  const fetchCaseDetails = async () => {
    console.log("Fetching case with ID:", caseId); 
    setLoading(true);
    setError('');

   try {
  const token = localStorage.getItem('doctor_access_token');
    console.log("Token available:", !!token);
  if (!token) {
    console.log("Token preview:", token.substring(0, 20) + "...");
    navigate('/');
    return;
  }
  console.log("Request URL:", `${API_BASE_URL}/api/patients/cases`);

  const response = await axios.get(`${API_BASE_URL}/api/patients/cases`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const allCases = response.data.cases || [];
  const foundCase = allCases.find(c => c.id === parseInt(caseId));

  if (!foundCase) {
    setError(`Case #${caseId} not found or you do not have access.`);
    setCaseData(null);
    return;
  }

  setCaseData(foundCase);
} catch (err) {
  console.error('Error fetching case details:', err);
  
  if (err.response?.status === 401) {
    localStorage.removeItem('doctor_access_token');
    navigate('/');
  } else if (err.response?.status === 403) {
    setError('Access denied. You are not authorized to view this case.');
  } else if (err.response?.status === 404) {
    setError('Case not found on the server.');
  } else {
    setError('Failed to load case details. Please check your connection.');
  }
  setCaseData(null);
   } finally {
  setLoading(false); // ✅ ضمان إنهاء التحميل
  }
};

  const handleSubmitReport = async () => {
  if (!reportText.trim()) {
    setError('Please provide a medical report before submitting.');
    return;
  }

  setSubmitting(true);
  setError('');

  try {
    const token = localStorage.getItem('doctor_access_token');
     console.log("Token available:", !!token);
    if (!token) {
      navigate('/');
      return;
    }

    await axios.post(`${API_BASE_URL}/api/doctors/case/${caseId}/report`, {
      report_text: reportText,
      diagnosis: diagnosis.trim() || null
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    alert('Medical report submitted successfully!');
    navigate('/dashboard');

  } catch (error) {
    console.error('Error submitting report:', error);

    if (error.response?.status === 401) {
      localStorage.removeItem('doctor_access_token');
      navigate('/');
    } else if (error.response?.status === 404) {
      setError('Case not found. It may have been deleted or moved.');
    } else {
      setError('Failed to submit report. Please try again.');
    }
  } finally {
    setSubmitting(false);
  }
};
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  useEffect(() => {
    if (caseId) {
      console.log("caseId as string:", caseId, "parsed:", parseInt(caseId));
      fetchCaseDetails();
    }
  }, [caseId]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading case details...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button onClick={() => navigate('/dashboard')} variant="contained">
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  if (!caseData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="info">No case data available.</Alert>
          <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Case #{caseData.id} - Patient {caseData.patient_id}
          </Typography>
          <Chip
            label={caseData.status || 'Pending'}
            color={getStatusColor(caseData.status)}
            variant="filled"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <MedicalIcon sx={{ mr: 2 }} />
                Case Information
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Patient ID:</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {caseData.patient_id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Created:</Typography>
                  </Box>
                  <Typography variant="body1">
                    {new Date(caseData.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Description</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">
                  {caseData.description || 'No description provided'}
                </Typography>
              </Paper>

              {caseData.audio_transcript && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Audio Transcript</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'blue.50' }}>
                    <Typography variant="body1">
                      {caseData.audio_transcript}
                    </Typography>
                  </Paper>
                </>
              )}
            </Paper>

            {/* Submit Report */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <ReportIcon sx={{ mr: 2 }} />
                Medical Report
              </Typography>

              <TextField
                fullWidth
                label="Diagnosis (Optional)"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                margin="normal"
                placeholder="Primary diagnosis or condition"
                disabled={submitting}
              />

              <TextField
                fullWidth
                multiline
                rows={8}
                label="Medical Report *"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                margin="normal"
                placeholder="Please provide your detailed assessment..."
                disabled={submitting}
                required
              />

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  * Required field
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={handleSubmitReport}
                  disabled={submitting || !reportText.trim()}
                  sx={{ px: 4 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Patient Files
              </Typography>
              <Alert severity="info">
                File attachments are not implemented in this demo version.
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default CaseDetail;
