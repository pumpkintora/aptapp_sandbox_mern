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
import { Icon } from '@iconify/react'
import Logo from '../components/Logo';
import axios from 'axios';
import { setTokenHeader } from '../api'

// components ----------------------------------------------------------------------
const Iconify = ({ icon, sx, ...other }) => {
    return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

const LoginForm = () => {
    // const { user, setUser } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false);
    const [np, setNP] = useState('')
    const [cnp, setCNP] = useState('')
    const [err, setErr] = useState('')
    const navigate = useNavigate();

    // const LoginSchema = Yup.object().shape({
    //     email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // });

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmNewPassword: ''
        },
        // validationSchema: LoginSchema,
        onSubmit: values => {
            if (values.newPassword !== values.confirmNewPassword) setErr('Your passwords do not match!')
            else {
                if (values.newPassword !== '') {
                    let token = window.location.href.replace('http://localhost:3000/reset-password/', '')
                    console.log('set new password')
                    axios.post(`http://localhost:6969/auth/reset-password/${token}`, values)
                        .then(res => {
                            navigate('/login')
                            console.log(res.data)
                        }).catch(err => console.log(err))
                }
            }
        }
    });

    const { errors, touched, values, handleSubmit, getFieldProps } = formik;

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label="New Password"
                        {...getFieldProps('newPassword')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        // onChange={handleChange}
                        error={Boolean(touched.newPassword && errors.newPassword)}
                        helperText={err && touched.newPassword && errors.newPassword}
                    // helperText={err}
                    />

                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label="Confirm New Password"
                        {...getFieldProps('confirmNewPassword')}
                        // onChange={handleChange}
                        error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                        helperText={err && touched.confirmNewPassword && errors.confirmNewPassword}
                    />
                </Stack>

                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ my: 2 }}
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
                            Reset password
                        </Typography>
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
