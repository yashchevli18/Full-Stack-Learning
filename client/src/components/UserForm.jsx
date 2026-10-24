import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import "../style/UserForm.css";
import { createUser, getUserById, updateUser } from '../services/userService';

export default function UserForm() {
    const { id } = useParams();
    const navigate  = useNavigate();
    
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required."),
        email: Yup.string().email("Enter a valid email.").required("Email is required."),
        phone: Yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10 digit phone number.").required("Phone is required."),
        gender: Yup.string().required("Gender is required."),
        status: Yup.string().required("Status is required.")
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            gender: "",
            status: "Active"
        },
        validationSchema,

        onSubmit: async (values) => {
            try {
                if (id) {
                    await updateUser(id, values);
                } else {
                    await createUser(values);
                }
                navigate("/");
            } catch (error) {
                console.error(error);
            }
        }
    });

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                formik.setValues({
                    name: data.name ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                    gender: data.gender ?? "",
                    status: data.status ?? "Active"
                });
            } catch (error) {
                console.error(error);
            }
        }

        fetchUser();
    }, [id]);

  return (
    <div className='form-container'>
        <h2>{id ? "Edit User" : "Add User"}</h2>

        <form onSubmit={formik.handleSubmit}>
            <div className='form-group'>
                <label>Name</label>

                <input 
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                 />
                 {formik.touched.name && formik.errors.name && (
                    <p className='error'>{formik.errors.name}</p>
                 )}
            </div>

            <div className='form-group'>
                <label>Email</label>

                <input 
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                 />
                 {formik.touched.email && formik.errors.email && (
                    <p className='error'>{formik.errors.email}</p>
                 )}
            </div>

            <div className='form-group'>
                <label>Phone</label>

                <input 
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                 />
                 {formik.touched.phone && formik.errors.phone && (
                    <p className='error'>{formik.errors.phone}</p>
                 )}
            </div>

            <div className='form-group'>
                <label>Gender</label>

                <div>
                    <label>
                        <input 
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formik.values.gender === "Male"}
                            onChange={formik.handleChange} 
                        />
                        Male
                    </label>
                    <label>
                        <input 
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formik.values.gender === "Female"}
                            onChange={formik.handleChange} 
                        />
                        Female
                    </label>
                </div>
                {formik.touched.gender && formik.errors.gender && (
                    <p className='error'>{formik.errors.gender}</p>
                )}
            </div>

            <div className='form-group'>
                <label>Status</label>

                <select 
                    name="status" 
                    value={formik.values.status} 
                    onChange={formik.handleChange}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                    <p className='error'>{formik.errors.status}</p>
                )}
            </div>

            <button type="submit" className='btn btn-save'>{id ? 'Update' : 'Save'}</button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate("/")}>Cancel</button>
        </form>
    </div>
  )
}
