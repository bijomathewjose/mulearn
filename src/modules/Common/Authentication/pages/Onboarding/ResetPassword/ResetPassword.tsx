import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ResetPassword.module.css";

import * as Yup from "yup";
import { Form, Formik } from "formik";
import { FormikTextInputWithoutLabel as SimpleInput } from "@/MuLearnComponents/FormikComponents/FormikComponents";
import OnboardingTemplate from "../../../components/OnboardingTeamplate/OnboardingTemplate";
import OnboardingHeader from "../../../components/OnboardingHeader/OnboardingHeader";
import { getMuid, resetPassword } from "../../../services/apis";
import { PowerfulButton } from "@/MuLearnComponents/MuButtons/MuButton";
const ResetPassword = () => {
    const [showOrHidePassword, setShowOrHidePassword] = useState("password");
    const [showOrHideConfirmPassword, setShowOrHideConfirmPassword] =
        useState("password");
    const [muid, setMuID] = useState("");
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState("");
    localStorage.clear();
    const navigate = useNavigate();

    useEffect(() => {
        const paramToken = searchParams.get("token");
        setToken(paramToken as string);
        if (token.length > 0 && muid.length === 0) {
            getMuid(token, navigate, setMuID);
        }
    }, [token]);

    const scheme = Yup.object({
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password should be at least 8 characters"),
        confirmPassword: Yup.string()
            .required("Please confirm your password")
            .oneOf([Yup.ref("password")], "Password does not match")
    });

    const onSubmit = async (values: any) => {
        console.log(values);
        resetPassword(token, values.password, navigate);
    };

    return (
        <>
            <OnboardingTemplate>
                <OnboardingHeader
                    title={"Reset Password"}
                    desc={
                        "Choose a new, strong password to keep your information securer"
                    }
                />
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        confirmPassword: ""
                    }}
                    validationSchema={scheme}
                    onSubmit={onSubmit}
                >
                    {formik => (
                        <div>
                            <div className={styles.wrapper}>
                                <Form>
                                    <div className={styles.inputBox}>
                                        <SimpleInput
                                            value={muid}
                                            aria-disabled={true}
                                            name="muid"
                                            style={{ marginTop: "10px" }}
                                            disabled={true}
                                        />
                                        <SimpleInput
                                            value={formik.values.password}
                                            name="password"
                                            placeholder="Password"
                                            type={showOrHidePassword}
                                            onChange={formik.handleChange}
                                            style={{ marginTop: "10px" }}
                                        />
                                        <span
                                            className={styles.eye}
                                            onClick={() => {
                                                setShowOrHidePassword(
                                                    showOrHidePassword ===
                                                        "password"
                                                        ? "text"
                                                        : "password"
                                                );
                                            }}
                                        >
                                            <i
                                                className={`fa fa-eye${
                                                    showOrHidePassword ===
                                                    "password"
                                                        ? "-slash"
                                                        : ""
                                                }`}
                                            />
                                        </span>
                                        <SimpleInput
                                            value={
                                                formik.values.confirmPassword
                                            }
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            type={showOrHideConfirmPassword}
                                            onChange={formik.handleChange}
                                            style={{ marginTop: "10px" }}
                                        />
                                        <span
                                            className={styles.eye}
                                            onClick={() => {
                                                setShowOrHideConfirmPassword(
                                                    showOrHideConfirmPassword ===
                                                        "password"
                                                        ? "text"
                                                        : "password"
                                                );
                                            }}
                                        >
                                            <i
                                                className={`fa fa-eye${
                                                    showOrHideConfirmPassword ===
                                                    "password"
                                                        ? "-slash"
                                                        : ""
                                                }`}
                                            />
                                        </span>
                                        <div className={styles.submit}>
                                            <PowerfulButton type="submit">
                                                Reset password
                                            </PowerfulButton>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    )}
                </Formik>
            </OnboardingTemplate>
        </>
    );
};

export default ResetPassword;
