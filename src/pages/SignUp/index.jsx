import axios from "axios";
import { useEffect, useState, useTransition, useMemo } from "react";
import { signUp } from "./api";
import { Input } from "./components/Input";


export function SignUp() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordRepeat, setPasswordRepeat] = useState();
    const [apiProgress, setApiProgress] = useState(false);
    const [successMessage, setSuccessMessage] = useState();
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState();

    useEffect(() => {
        setErrors(function (lastErrors) {
            return {
                ...lastErrors,
                username: undefined
            }
        });
    }, [username])

    useEffect(() => {
        setErrors(function (lastErrors) {
            return {
                ...lastErrors,
                email: undefined
            }
        });
    }, [email])

    useEffect(() => {
        setErrors(function (lastErrors) {
            return {
                ...lastErrors,
                password: undefined
            }
        });
    }, [password])

    const onSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage();
        setGeneralError();
        setApiProgress(true);
        try {
            const response = await signUp({
                username,
                email,
                password
            })
            setSuccessMessage(response.data.message);
        } catch (axiosError) {
            if (axiosError.response?.data && axiosError.response.data.status === 400) {
                setErrors(axiosError.response.data.validationErrors);
            } else {
                setGeneralError('Unexpected error occured. Please try again')
            }
        } finally {
            setApiProgress(false)
        }

    }

    const passwordRepeatError = useMemo(() => {
        if(password && password !== passwordRepeat) {
            return 'Password Missmatch'
        }
        return '';
    }, [password, passwordRepeat]);
    
    return (
        // <>
        <div className="container">
            <div className="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
                <form className="card">
                    <div className="text-center card-header">
                        <h1> SignUp </h1>
                    </div>

                    <div className="card-body">
                        <Input id="username" label="Username" error={errors.username} onChange={(event) => setUsername(event.target.value)} />
                        <Input id="email" label="E-Mail" error={errors.email} onChange={(event) => setEmail(event.target.value)} />
                        <Input id="password" label="Password" type="password" error={errors.password} onChange={(event) => setPassword(event.target.value)} />
                        <Input id="passwordRepeat" label="Password Repeat" type="password" error={passwordRepeatError} onChange={(event) => setPasswordRepeat(event.target.value)} />
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        {generalError && <div className="alert alert-danger">{generalError}</div>}
                        <div className="text-center">
                            <button className="btn btn-primary" disabled={apiProgress || (password && password !== passwordRepeat)} onClick={onSubmit}>
                                {apiProgress && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        // </>
    )
}