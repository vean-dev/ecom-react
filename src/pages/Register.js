import { useContext, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate } from 'react-router-dom';
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function Register(){

	const { user } = useContext(UserContext);

	// // State hooks to store the values of the input fields 
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNo, setMobileNo] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [isActive, setIsActive] = useState(false);


	function registerUser(e){

		
	e.preventDefault();

	fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({

				firstName : firstName,
				lastName : lastName,
				email : email,
				mobileNo : mobileNo,
				password : password

			})
		}).then(res => res.json())
		.then(data => {

			console.log(data);

			if(data.message === "Registered successfully"){

				setFirstName("");
				setLastName("");
				setEmail("");
				setMobileNo("");
				setPassword("");
				setConfirmPassword("");

				Swal.fire({
                    title: "Registered successfully.",
                    text: "Welcome",
                    icon: "success"
                })


			} else if (data.error === "Email invalid"){

				Swal.fire({
                    title: "Email Invalid.",
                    text: "Please Check Your Email",
                    icon: "error"
                })

			} else if (data.error === "Mobile number invalid"){

				Swal.fire({
                    title: "Mobile Number Invalid.",
                    text: "Please Check Your Mobile Number",
                    icon: "error"
                })

			} else if (data.error === "Password must be atleast 8 characters"){

				Swal.fire({
                    title: "Password must be atleast 8 characters.",
                    text: "Please Check Your Password",
                    icon: "error"
                })

			} else {

				Swal.fire({
                    title: "Something went wrong",
                    text: "Please Try Again",
                    icon: "error"
                })

			}

		})

	}

    const registerData = [firstName, lastName, email, mobileNo, password, confirmPassword]


    useEffect(() => {
        const isValid =
            registerData.every((field) => field !== "") &&
            password === confirmPassword &&
            mobileNo.length === 11;
    
        setIsActive(isValid);
    }, [registerData, password, confirmPassword, mobileNo]);

	return (
        (user.id !== null) ?
			    <Navigate to="/products" />
			:
				<Form onSubmit={e => registerUser(e)}>
               
					<h1 className="my-5 text-center">Register</h1>
					<Form.Group>
						<Form.Label>First Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter First Name"
							value={ firstName }
							onChange={e => setFirstName(e.target.value)}
							required
						 />
					</Form.Group>

					<Form.Group>
						<Form.Label>Last Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter Last Name"
							value={ lastName } 
							onChange={e => setLastName(e.target.value)}
							required
						 />
					</Form.Group>

					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter Email"
							value={ email } 
							onChange={e => setEmail(e.target.value)}
							required
						 />
					</Form.Group>

					<Form.Group>
						<Form.Label>Mobile No.</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter 11 digit number"
							value={ mobileNo } 
							onChange={e => setMobileNo(e.target.value)}
							required
						 />
					</Form.Group>

					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Enter Password"
							value={ password } 
							onChange={e => setPassword(e.target.value)}
							required
						 />
					</Form.Group>

					<Form.Group>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Confirm Password"
							value={ confirmPassword } 
							onChange={e => setConfirmPassword(e.target.value)}
							required
						 />
					</Form.Group>

					{ isActive ? 
						<Button variant="primary" type="submit" id="submitBtn">Submit</Button>
						:
						<Button variant="primary" type="submit" id="submitBtn" disabled>Submit</Button>
					}
				</Form>

		)

}