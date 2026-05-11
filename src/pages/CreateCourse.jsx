import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../api/courseApi";
import { useAuth } from "../context/AuthContext";

const CreateCourse = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [form, setForm] = useState({
        title: "",
        description: "",
        instructor: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 🔒 Only admin allowed
    if (user?.role !== "admin") {
        return (
            <div style={styles.center}>
                <h2>Access Denied ❌</h2>
            </div>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.title) {
            setMessage("Title is required ❌");
            return;
        }

        try {
            setLoading(true);
            await createCourse(form);

            setMessage("Course created successfully ✅");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error creating course ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2>Create Course</h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Course Title"
                    value={form.title}
                    onChange={handleChange}
                    style={styles.input}
                />

                <textarea
                    name="description"
                    placeholder="Course Description"
                    value={form.description}
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    type="text"
                    name="instructor"
                    placeholder="Instructor Name"
                    value={form.instructor}
                    onChange={handleChange}
                    style={styles.input}
                />

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Creating..." : "Create Course"}
                </button>

                {message && <p style={styles.msg}>{message}</p>}
            </form>
        </div>
    );
};

export default CreateCourse;

/* ================= STYLES ================= */

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
    },

    form: {
        width: "400px",
        padding: "30px",
        borderRadius: "10px",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #1e293b",
        background: "#020617",
        color: "#fff",
    },

    button: {
        padding: "12px",
        borderRadius: "6px",
        background: "#38bdf8",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    },

    msg: {
        marginTop: "10px",
        color: "#38bdf8",
    },

    center: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
    },
};