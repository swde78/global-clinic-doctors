import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Button, AppBar, Toolbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, CircularProgress, Alert
} from '@mui/material';
import { LocalHospital as HospitalIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'https://8000-i1csmgelwq595e3wt1acg-c7c750f2.manusvm.computer';

function Dashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('doctor_access_token');
    const userId = localStorage.getItem('doctor_user_id');
    const role = localStorage.getItem('doctor_role');
    
    if (!token || !userId || role !== 'doctor') {
      // Redirect to login if not authenticated
      window.location.href = '/';
      return;
    }
    
    setUser({ id: userId, role, token });
    fetchCases(token);
  }, []);

  const fetchCases = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctor/cases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        handleLogout();
      } else {
        setError('Failed to load cases. Please try refreshing the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctor_access_token');
    localStorage.removeItem('doctor_user_id');
    localStorage.removeItem('doctor_role');
    localStorage.removeItem('doctor_authenticated');
    window.location.href = '/';
  };

  const handleRefresh = () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('doctor_access_token');
    fetchCases(token);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading cases...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <HospitalIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Global Clinic - Doctor Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patient Cases
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Review and manage your assigned patient consultations
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Cases
                </Typography>
                <Typography variant="h4">
                  {cases.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Review
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {cases.filter(c => c.status === 'pending').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h4" color="info.main">
                  {cases.filter(c => c.status === 'in_progress').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" color="success.main">
                  {cases.filter(c => c.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Cases Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Case Management
              </Typography>
              <Button variant="outlined" onClick={handleRefresh}>
                Refresh
              </Button>
            </Box>

            {cases.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <HospitalIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No Cases Assigned
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  You currently have no patient cases assigned to you. New cases will appear here when assigned.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Case ID</strong></TableCell>
                      <TableCell><strong>Patient ID</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Priority</strong></TableCell>
                      <TableCell><strong>Created</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell>{caseItem.id}</TableCell>
                        <TableCell>{caseItem.patient_id}</TableCell>
                        <TableCell>
                          <Chip 
                            label={caseItem.status || 'Pending'} 
                            color={getStatusColor(caseItem.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={caseItem.priority || 'Normal'} 
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(caseItem.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => window.location.href = `/case/${caseItem.id}`}
                          >
                            View Case
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Dashboard;

