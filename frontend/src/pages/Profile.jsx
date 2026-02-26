import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../services/api";
import "./Profile.css";

function Profile({ user, onUpdateUser }) {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        contactNumber: "",
        profilePicture: "",
        role: "",
    });
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
            if (data.profilePicture) {
                setPreviewUrl(`http://127.0.0.1:5000/${data.profilePicture}`);
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to load profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const formData = new FormData();
            formData.append("name", profile.name);
            formData.append("contactNumber", profile.contactNumber || "");
            if (selectedFile) {
                formData.append("profilePicture", selectedFile);
            }

            const response = await updateProfile(formData);
            setProfile(response.user);

            // Update local storage and app state
            localStorage.setItem("user", JSON.stringify(response.user));
            if (onUpdateUser) onUpdateUser(response.user);

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: "error", text: "Passwords do not match" });
        }

        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            await changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setMessage({ type: "success", text: "Password changed successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar" className="profile-avatar" />
                        ) : (
                            <div className="avatar-placeholder">
                                {profile.name?.charAt(0) || profile.email?.charAt(0)}
                            </div>
                        )}
                        <label htmlFor="avatar-upload" className="avatar-upload-label">
                            <i className="fas fa-camera"></i>
                            <input
                                id="avatar-upload"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <h1>{profile.name || "User"}</h1>
                    <p>{profile.role}</p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}

                <div className="profile-body">
                    <section className="profile-section">
                        <h2>Personal Information</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="info-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name || ""}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </div>
                            <div className="info-group">
                                <label>Email (Cannot be changed)</label>
                                <input type="email" value={profile.email || ""} disabled />
                            </div>
                            <div className="info-group">
                                <label>Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={profile.contactNumber || ""}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? "Saving..." : "Update Profile"}
                            </button>
                        </form>
                    </section>

                    <section className="profile-section">
                        <h2>Change Password</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="info-group">
                                <label>Old Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwords.oldPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="info-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="info-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Profile;
