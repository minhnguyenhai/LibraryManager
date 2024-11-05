import React, { useState } from "react";
import './personal_info_form.css'
const PersonalInfoForm = () => {
    const[gender, setGender] = useState('');
    return (
        <div className="personal-info-form">
            <h2>Information</h2>
            <form action="">
                <div className="input-box">
                    <label>Email</label>
                    <input
                        type="email"
                        required
                    />
                </div>
                <div className="input-box">
                    <label>Password</label>
                    <input
                        type="password"
                        required
                    />
                </div>
                <div className="input-box">
                    <label>Fullname</label>
                    <input
                        type="text"
                        required
                    />
                </div>
                <div className="input-box">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        required
                    />
                </div>
                <div className="input-box">
                    <label>Gender</label>
                    <div className="gender-options">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="man"
                                checked={gender === 'man'}
                                onChange={() => setGender('man')}
                                required
                            />
                            Man
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="woman"
                                checked={gender === 'woman'}
                                onChange={() => setGender('woman')}
                                required
                            />
                            Man
                        </label>
                    </div>
                </div>
                <div className="input-box">
                    <label>Address</label>
                    <input
                        type="text"
                        required
                    />
                </div>
                <div className="input-box">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        required
                    />
                </div>
            </form>
        </div>
    );
};
export default PersonalInfoForm;