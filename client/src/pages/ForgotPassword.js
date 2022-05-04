// react
import { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider'
// material
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    Stack,
    Link,
    Container,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Button,
    Divider,
} from '@mui/material';

// others
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Logo from '../components/Logo';
import axios from 'axios';
import { setTokenHeader } from '../api'

// components ----------------------------------------------------------------------

const LoginForm = () => {
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate();

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: LoginSchema,
        onSubmit: values => {
            axios.post("http://localhost:6969/auth/forgot-password", values)
                .then(res => {
                    console.log(res.data.userExist)
                    // if (res.data.userExist) navigate("/verify_success")
                }).catch(err => console.log(err))
        }
    });

    const { errors, touched, values, handleSubmit, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    autoComplete="username"
                    type="email"
                    label="Email address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                />

                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
                    <Link component={RouterLink} variant="subtitle2" to="/login" underline="hover">
                        Back to login
                    </Link>
                </Stack>

                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    Submit
                </Button>
            </Form>
        </FormikProvider>
    );

}

// layout ----------------------------------------------------------------------
const AuthLayout = ({ children }) => {
    const HeaderStyle = styled('header')(({ theme }) => ({
        top: 0,
        zIndex: 9,
        lineHeight: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        padding: theme.spacing(3),
        justifyContent: 'space-between',
        [theme.breakpoints.up('md')]: {
            alignItems: 'flex-start',
            padding: theme.spacing(7, 5, 0, 7)
        }
    }));

    return (
        <HeaderStyle>
            <Logo />

            <Typography
                variant="body2"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    mt: { md: -2 }
                }}
            >
                {children}
            </Typography>
        </HeaderStyle>
    );
}


// styles ----------------------------------------------------------------------
const RootStyle = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
    return (
        <RootStyle title="Login | Minimal-UI">
            <AuthLayout>
                Don’t have an account? &nbsp;
                <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
                    Get started
                </Link>
            </AuthLayout>

            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{ mb: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Forgot password?
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Enter your email and we'll send you a reset link.</Typography>
                    </Stack>

                    <LoginForm />

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            mt: 3,
                            display: { sm: 'none' }
                        }}
                    >
                        Don’t have an account?&nbsp;
                        <Link variant="subtitle2" component={RouterLink} to="register" underline="hover">
                            Get started
                        </Link>
                    </Typography>
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
