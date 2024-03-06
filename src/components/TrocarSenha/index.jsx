import React, { useState } from 'react';
import axiosFetch from '../../axios/config';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import BackArrow from '../../components/BackArrow/index';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function TrocarSenha() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = { email };

      const response = await axiosFetch.post('/reset-password/request', requestData);

      if (response.status === 200) {
        toast.success('E-mail enviado com sucesso!');
        setEmailSent(true);
      } else {
        toast.error('Falha ao enviar o e-mail. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar o e-mail. Tente novamente mais tarde.');
    }

    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (newPassword !== confirmPassword) {
        toast.error('As senhas não coincidem. Por favor, verifique e tente novamente.');
        setLoading(false);
        return; 
      }
  
      let requestData = {
        email,
        novaSenha: newPassword,
        confirmSenha: confirmPassword,
        codigo: verificationCode,
        updateType: 'senha'
      };
  
      const response = await axiosFetch.put('/user/update-profile', requestData);
  
      if (response.status === 200) {
        if (codeVerified) {
          toast.success('Senha atualizada com sucesso!');
          setEmail('');
          setVerificationCode('');
          setNewPassword('');
          setConfirmPassword('');
          setEmailSent(false);
          setCodeVerified(false);
        } else {
          toast.success('Senha alterada com sucesso!');
          setCodeVerified(true);
          window.location.reload();
        }
      } else {
        toast.error('Falha ao processar a solicitação. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao processar a solicitação. Tente novamente.');
    }
  
    setLoading(false);
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
          <BackArrow style={{ marginRight: '30px' }} />
          <Typography component="h1" variant="h5" style={{ marginRight: '30px' }}>
            Troque sua senha
          </Typography>
        </Box>

        <Box component="form" onSubmit={emailSent ? handleFormSubmit : handleEmailFormSubmit} noValidate sx={{ mt: 4 }}>
          {!emailSent && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail de verificação"
              name="email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={codeVerified}
            />
          )}

          {emailSent && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="verificationCode"
                label="Digite o código de verificação de 6 dígitos"
                name="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                inputProps={{ maxLength: 6 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="Nova senha"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                inputProps={{ minLength: 8, pattern: "(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirme a senha"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                inputProps={{ minLength: 8, pattern: "(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Processando...' : (emailSent ? 'Enviar' : 'Enviar E-mail')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TrocarSenha;