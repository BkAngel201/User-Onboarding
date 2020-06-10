import React, { useState, useEffect } from 'react';
import styled from "styled-components"
import * as yup from "yup"
import axios from 'axios';

const FormElement = styled.form`
    display: flex;
    flex-direction: column;
    width: 250px;
    text-align: left;
    margin: auto
`

const Label = styled.label`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    &.inline {
        flex-direction: row
    }
`

const Input = styled.input`
    padding: 8px;
    background-color: #777;
    color: white;
    border: 3px solid purple;
`

const Error = styled.p`
    color: red
`

const Dropdown = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    & input {
        width: 85%;
        user-select: none;
    }
`

const DropdownButton = styled.a`
    width: 15%;
    background-color: #777;
    color: white;
    line-height: 2.3rem;
    text-align: center;
    text-decoration: none;
`

const DropdownItems = styled.div`
    position: absolute;
    top: 37px;
    background-color: #999;
    border: 3px solid #777;
    border-bottom: 0;
    width: 100%
`

const Item = styled.div`
    color: white;
    padding: 5px 10px;
    border-bottom: 3px solid #777;
`

function Form () {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        terms: true
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        terms: ""
    })

    const [users, setUsers] = useState([])

    const [buttonDisabled, setButtonDisabled] = useState(true)

    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("This field is required"),
        email: yup
            .string()
            .email("The email need to match the format x@x.x")
            .notOneOf(["waffle@syrup.com"],"This email is taken")
            .required("This field is required"),
        password: yup
            .string()
            .min(8, `The password need to be more than 8 character`)
            .required("This field is required"),
        role: yup
            .string()
            .required("This field is required"),
            
        terms: yup
            .boolean()
            .oneOf([true])
    })

    const validateChange = e => { 
        yup.reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
            setErrors({
                ...errors,
                [e.target.name]: ""
            })
        })
        .catch(error => {
            setErrors({
                ...errors,
                [e.target.name]: error.errors[0]
            })
        })
    }

    const handleEvent = e => {
        e.persist()
        const newFormValues = {
            ... formValues,
            [e.target.name]: (e.target.type === "checkbox") ? e.target.checked : e.target.value
        }
        validateChange(e)
        setFormValues(newFormValues)
    }

    const handleSubmit = e => {
        e.preventDefault()
        axios
            .post("https://reqres.in/api/users", formValues)
            .then(res => {
                setUsers([
                    ...users,
                    res.data
                ])
                setFormValues({
                    name: "",
                    email: "",
                    password: "",
                    role: "",
                    terms: true
                }) 
            })
            .catch(err => console.log(err.response))
    }

    useEffect(() => {
        formSchema.isValid(formValues).then(isValid => {
            setButtonDisabled(!isValid)
        })
    }, [formValues])

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const dropdownHandle = e => {
        const newFormValues = {
            ... formValues,
            role: e.target.textContent
        }
        validateChange({target:{name:"role",value:e.target.textContent}})
        setFormValues(newFormValues)
        setDropdownOpen(!dropdownOpen)
    }
    const openDropdown = e => {
        e.preventDefault()
        setDropdownOpen(!dropdownOpen)
    }

    return(
        <FormElement onSubmit={handleSubmit}>
            <Label htmlFor="name">
                Name:
                <Input type="text" name="name" id="name" onChange={handleEvent} value={formValues.name} />
            </Label>
            {errors.name.length > 0 ? <Error>{errors.name}</Error> : null}
            <Label htmlFor="Email">
                Email:
                <Input type="text" name="email" id="email" onChange={handleEvent} value={formValues.email} />
            </Label>
            {errors.email.length > 0 ? <Error>{errors.email}</Error> : null}
            <Label htmlFor="password">
                Password:
                <Input type="password" name="password" id="password" onChange={handleEvent} value={formValues.password} />
            </Label>
            {errors.password.length > 0 ? <Error>{errors.password}</Error> : null}
            <Label>
                Role:
                <Dropdown>
                    <Input type="text" value={formValues.role} readonly/><DropdownButton onClick={openDropdown}>+</DropdownButton>
                    {dropdownOpen ? (
                    <DropdownItems>
                        <Item onClick={dropdownHandle}>Regular User</Item>
                        <Item onClick={dropdownHandle}>Moderator</Item>
                        <Item onClick={dropdownHandle}>Web Admin</Item>
                        <Item onClick={dropdownHandle}>Root Admin</Item>
                    </DropdownItems>) : null
                    }
                </Dropdown>
            </Label>
            {errors.role.length > 0 ? <Error>{errors.role}</Error> : null}
            <Label htmlFor="terms" className="inline">
                <Input type="checkbox" name="terms" id="terms" checked={formValues.terms} onChange={handleEvent} /> Terms of Services
            </Label>
            {errors.terms.length > 0 ? <Error>{errors.terms}</Error> : null}
            <button type="submit" disabled={buttonDisabled} >Submit</button>
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </FormElement>
    )
}


export default Form