import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

const defaulFormFields = {
  name: "",
  email: "",
  isAdmin: false,
};
const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [formFields, setFormFields] = useState(defaulFormFields);
  const { name, email, isAdmin } = formFields;

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const { name, email, isAdmin } = user;
      const currentUser = {
        name,
        email,
        isAdmin: Boolean(isAdmin),
      };
      setFormFields({ ...currentUser });
    }
  }, [user]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    console.log(name,value)
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();

    try{
        await updateUser({userId,name,email,isAdmin})
        toast.success('Updated successfully')
        refetch()
        navigate('/admin/userlist')
    }
    catch(err){
        toast.error(err?.data?.message||err.error)
    }
};

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={name}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <FormGroup controlId="isAdmin" className="my-2">
              <Form.Check
                type="checkbox"
                label="is Admin"
                name="isAdmin"
                checked={isAdmin}
                onChange={handleChange}
              ></Form.Check>
            </FormGroup>
            <Button type="submit" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
