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

const API_BASE_URL = 'https://8000-i1csmgelwq595e3wt1acg-c7c750f2.manusvm.computer';

function CaseDetail() {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reportText, setReportText] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const navigate = useNavigate();
  const { caseId } = useParams();

  const fetchCaseDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('doctor_access_token');
      if (!token) {
        navigate('/');
        return;
      }

      const _response = await axios.get(`${API_BASE_URL}/doctor/cases/${caseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setCaseData(_response.data);
    } catch (error) {
      console.error('Error fetching case details:', error);
      
      if (error._response?.status === 401) {
        localStorage.removeItem('doctor_access_token');
        navigate('/');
      } else if (error._response?.status === 404) {
        setError('Case not found or you do not have access to this case.');
      } else {
        setError('Failed to fetch case details. Please try again.');
      }
    } finally {
      setLoading(false);
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
      
      const _response = await axios.post(`${API_BASE_URL}/doctor/cases/${caseId}/report`, {
        report_text: reportText,
        diagnosis: diagnosis.trim() || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      alert('Medical report submitted successfully! The patient will be notified.');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      
      if (error._response?.status === 401) {
        localStorage.removeItem('doctor_access_token');
        navigate('/');
      } else {
        setError('Failed to submit report. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'primary';
      case 'in_progress': return 'warning';
      case 'report_submitted': return 'success';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'report_submitted': return 'Report Submitted';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [caseId, navigate]);

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

  if (!caseData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error">
            Case not found or you do not have access to this case.
          </Alert>
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
            label={getStatusText(caseData.status)} 
            color={getStatusColor(caseData.status)}
            variant="filled"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Case Information */}
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
                    {new Date(caseData.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Medical History</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">
                  {caseData.medical_history || 'No medical history provided'}
                </Typography>
              </Paper>

              {caseData.ai_transcript && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>AI-Processed Audio Transcript</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'blue.50' }}>
                    <Typography variant="body1">
                      {caseData.ai_transcript}
                    </Typography>
                  </Paper>
                </>
              )}

              {caseData.ai_questions && caseData.ai_questions.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>AI-Generated Questions</Typography>
                  <List>
                    {caseData.ai_questions.map((question, index) => (
                      <ListItem key={index} sx={{ bgcolor: 'warning.50', mb: 1, borderRadius: 1 }}>
                        <ListItemText primary={question} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Paper>

            {/* Report Submission */}
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
                disabled={submitting || caseData.status === 'report_submitted' || caseData.status === 'completed'}
              />

              <TextField
                fullWidth
                multiline
                rows={8}
                label="Medical Report *"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                margin="normal"
                placeholder="Please provide your detailed medical assessment, recommendations, and treatment plan..."
                disabled={submitting || caseData.status === 'report_submitted' || caseData.status === 'completed'}
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
                  disabled={submitting || !reportText.trim() || caseData.status === 'report_submitted' || caseData.status === 'completed'}
                  sx={{ px: 4 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </Box>

              {(caseData.status === 'report_submitted' || caseData.status === 'completed') && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Medical report has been submitted successfully.
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Attachments */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Patient Files
              </Typography>

              {/* Audio File */}
              {caseData.audio_file_path && (
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AudioIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2">Audio Recording</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Patient's audio description of symptoms
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      fullWidth
                      onClick={() => window.open(`${API_BASE_URL}/files/${caseData.audio_file_path}`, '_blank')}
                    >
                      Play Audio
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Document Files */}
              {caseData.document_file_paths && caseData.document_file_paths.length > 0 && (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DocumentIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="subtitle2">Medical Documents</Typography>
                    </Box>
                    <List dense>
                      {caseData.document_file_paths.map((filePath, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <DocumentIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`Document ${index + 1}`}
                            secondary={filePath.split('/').pop()}
                          />
                          <Button 
                            size="small" 
                            onClick={() => window.open(`${API_BASE_URL}/files/${filePath}`, '_blank')}
                          >
                            View
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {(!caseData.audio_file_path && (!caseData.document_file_paths || caseData.document_file_paths.length === 0)) && (
                <Alert severity="info">
                  No files attached to this case.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default CaseDetail;

