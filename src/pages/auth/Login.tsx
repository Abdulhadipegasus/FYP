import React, { useEffect } from 'react';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { Redirect, Link, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

// hooks
import { useRedux } from '../../hooks/';

// actions
import { resetAuth, loginUser } from '../../redux/actions';

// components
import { VerticalForm, FormInput } from '../../components/form/';
import SocialLinks from '../../components/SocialLinks';

import AuthLayout from './AuthLayout';

interface LocationState {
    from?: Location;
}

interface UserData {
    email: string;
    password: string;
}

/* bottom links */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col xs={12} className="text-center">
                <p className="text-muted">
                    <Link to="/auth/forget-password" className="text-muted ms-1">
                        {t('Forgot your password?')}
                    </Link>
                </p>
                <p className="text-muted">
                    {t("Don't have an account?")}{' '}
                    <Link to={'/auth/register'} className="text-primary fw-bold ms-1">
                        {t('Sign Up')}
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Login = () => {
    const { t } = useTranslation();
    const { dispatch, appSelector } = useRedux();

    const { user, userLoggedIn, loading, error } = appSelector((state) => ({
        user: state.Auth.user,
        loading: state.Auth.loading,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            email: yup.string().required(t('Please enter Email')).email(t('Please enter valid Email')),
            password: yup.string().required(t('Please enter Password')),
        })
    );

    /*
    handle form submission
    */
    const onSubmit = (formData: UserData) => {
        dispatch(loginUser(formData['email'], formData['password']));
    };

    const location = useLocation<LocationState>();
    const redirectUrl = location.state && location.state.from ? location.state.from.pathname : '/dashboard/analytics';

    return (
        <>
            {(userLoggedIn || user) && <Redirect to={redirectUrl}></Redirect>}

            <AuthLayout
                helpText={t('Enter your email address and password to access admin panel.')}
                bottomLinks={<BottomLink />}
            >
                {error && (
                    <Alert variant="danger" className="my-2">
                        {error}
                    </Alert>
                )}

                <VerticalForm<UserData>
                    onSubmit={onSubmit}
                    resolver={schemaResolver}
                    defaultValues={{ email: 'QSP_FYP_PROJECT@FYP.com', password: 'test' }}
                >
                    <FormInput
                        type="email"
                        name="email"
                        label={t('Email address')}
                        placeholder={t('QSP_FYP_PROJECT@FYP.com')}
                        containerClass={'mb-2'}
                    />
                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        containerClass={'mb-2'}
                    ></FormInput>

                    <FormInput
                        type="checkbox"
                        name="checkbox"
                        label={t('Remember me')}
                        containerClass={'mb-3'}
                        defaultChecked
                    />

                    <div className="text-center d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {t('Log In')}
                        </Button>
                    </div>
                </VerticalForm>

                <div className="text-center">
                    <h5 className="mt-3 text-muted">{t('Sign in with')}</h5>
                    <SocialLinks />
                </div>
            </AuthLayout>
        </>
    );
};

export default Login;
