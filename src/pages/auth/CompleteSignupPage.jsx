import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    Check,
    Gift,
    MapPin,
    UserRound,
    LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import logo from "../../assets/brand/salok-earn-logo.png";

export default function CompleteSignupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        country: "",
        dateOfBirth: "",
        gender: "",
        referralCode: "",
    });

    const [loading, setLoading] =
        useState(false);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.username.trim()) {
            toast.error(
                "Please choose a username."
            );

            return;
        }

        if (!formData.country) {
            toast.error(
                "Please select your country."
            );

            return;
        }

        if (!formData.dateOfBirth) {
            toast.error(
                "Please enter your date of birth."
            );

            return;
        }

        if (!formData.gender) {
            toast.error(
                "Please select your gender."
            );

            return;
        }

        try {
            setLoading(true);

            /*
             * Mock profile completion.
             *
             * Later this will call the Firebase
             * profile service.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            const existingUser =
                JSON.parse(
                    localStorage.getItem(
                        "salok_mock_user"
                    ) || "{}"
                );

            const updatedUser = {
                ...existingUser,

                username:
                    formData.username.trim(),

                country:
                    formData.country,

                dateOfBirth:
                    formData.dateOfBirth,

                gender:
                    formData.gender,

                referralCode:
                    formData.referralCode.trim(),

                profileCompleted: true,
            };

            localStorage.setItem(
                "salok_mock_user",
                JSON.stringify(updatedUser)
            );

            toast.success(
                "Profile completed successfully!"
            );

            navigate("/dashboard");
        } catch {
            toast.error(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="ALMOST THERE"
            title={
                <>
                    Just a few
                    <span> more details.</span>
                </>
            }
            description="Complete your profile to unlock tasks, trivia, surveys and referral rewards tailored to you."
        >

            <div className="auth-mobile-brand">
                <div className="auth-brand-logo">
                    <img
                        src={logo}
                        alt="Salok Earn"
                        className="auth-logo-mark"
                    />

                    <span>
                        Salok Earn
                    </span>
                </div>
            </div>

            <div className="auth-heading complete-signup-heading">

                <span className="auth-form-eyebrow">
                    ALMOST THERE
                </span>

                <h2>
                    Complete your
                    <span> profile.</span>
                </h2>

                <p>
                    A few more details will help us
                    personalize your Salok Earn experience.
                </p>

            </div>

            <div className="profile-progress">

                <div className="profile-progress-top">
                    <span>
                        Profile setup
                    </span>

                    <strong>
                        60%
                    </strong>
                </div>

                <div className="profile-progress-track">
                    <span />
                </div>

            </div>

            <form
                className="auth-form complete-signup-form"
                onSubmit={handleSubmit}
            >

                {/* Username */}

                <div className="auth-field">

                    <label htmlFor="username">
                        Username
                    </label>

                    <div className="auth-input-wrapper">

                        <UserRound
                            size={18}
                            strokeWidth={1.8}
                        />

                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={
                                formData.username
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="username"
                        />

                    </div>

                </div>

                {/* Country */}

                <div className="auth-field">

                    <label htmlFor="country">
                        Country
                    </label>

                    <div className="auth-input-wrapper">

                        <MapPin
                            size={18}
                            strokeWidth={1.8}
                        />

                        <select
                            id="country"
                            name="country"
                            value={
                                formData.country
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <option value="">
                                Select your country
                            </option>

                            <option value="Nigeria">
                                Nigeria
                            </option>

                            <option value="Ghana">
                                Ghana
                            </option>

                            <option value="Kenya">
                                Kenya
                            </option>

                            <option value="South Africa">
                                South Africa
                            </option>

                            <option value="United States">
                                United States
                            </option>

                            <option value="United Kingdom">
                                United Kingdom
                            </option>

                            <option value="Canada">
                                Canada
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>

                    </div>

                </div>

                {/* Date + Gender */}

                <div className="complete-signup-grid">

                    <div className="auth-field">

                        <label htmlFor="dateOfBirth">
                            Date of birth
                        </label>

                        <div className="auth-input-wrapper">

                            <CalendarDays
                                size={18}
                                strokeWidth={1.8}
                            />

                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={
                                    formData.dateOfBirth
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                    <div className="auth-field">

                        <label htmlFor="gender">
                            Gender
                        </label>

                        <div className="auth-input-wrapper">

                            <UserRound
                                size={18}
                                strokeWidth={1.8}
                            />

                            <select
                                id="gender"
                                name="gender"
                                value={
                                    formData.gender
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="">
                                    Select
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>

                                <option value="prefer_not_to_say">
                                    Prefer not to say
                                </option>
                            </select>

                        </div>

                    </div>

                </div>

                {/* Referral */}

                <div className="auth-field">

                    <div className="complete-referral-label">

                        <label htmlFor="referralCode">
                            Referral code
                        </label>

                        <span>
                            Optional
                        </span>

                    </div>

                    <div className="auth-input-wrapper">

                        <Gift
                            size={18}
                            strokeWidth={1.8}
                        />

                        <input
                            id="referralCode"
                            name="referralCode"
                            type="text"
                            placeholder="Enter referral code"
                            value={
                                formData.referralCode
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>

                </div>

                {/* Confirmation */}

                <div className="profile-confirmation">

                    <div className="profile-confirmation-icon">
                        <Check size={16} />
                    </div>

                    <p>
                        Your information is used to
                        personalize your experience and
                        help keep your account secure.
                    </p>

                </div>

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <LoaderCircle
                                size={19}
                                className="auth-spinner"
                            />

                            Saving profile...
                        </>
                    ) : (
                        <>
                            Continue to dashboard

                            <ArrowRight
                                size={19}
                            />
                        </>
                    )}
                </button>

            </form>

            <p className="auth-switch complete-signup-switch">
                Already have an account?

                <Link to="/login">
                    Sign in
                </Link>
            </p>

        </AuthLayout>
    );
}