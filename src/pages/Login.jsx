import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Container, Box, Alert, CircularProgress, Paper 
} from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, LocalHospital as HospitalIcon } from '@mui/icons-material';
// Using native fetch API instead of axios

const API_BASE_URL = 'https://8000-i1csmgelwq595e3wt1acg-c7c750f2.manusvm.computer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login_id: email,
          password_or_otp: password,
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Doctor Login Response:', data);
      
      // Store authentication data
      localStorage.setItem('doctor_access_token', data.access_token);
      localStorage.setItem('doctor_user_id', data.user_id.toString());
      localStorage.setItem('doctor_role', data.role);
      localStorage.setItem('doctor_authenticated', 'true');
      
      // Force page reload to dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.detail || 'Server error occurred';
        if (error.response.status === 401) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError(errorMessage);
        }
      } else if (error.request) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HospitalIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Global Clinic
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Doctor Portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
          
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            Secure access for medical professionals
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;

