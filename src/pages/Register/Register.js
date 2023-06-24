import React, { useContext, useEffect, useState } from 'react'
import Card from "react-bootstrap/Card"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import Spiner from "../../components/Spiner/Spiner"
import {registerfunc} from "../../services/Apis"
import { ToastContainer, toast } from "react-toastify"
import {useNavigate} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import "./register.css"
import { addData } from '../../components/context/ContextProvider';

const Register = () => {

  const [inputdata, setInputData] = useState({
    name: "",
    email: "",
    project: "",
    estimation: "",
    spentTime: "",
    taskName:"",
  });

  const [status, setStatus] = useState("Progress");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [showspin, setShowSpin] = useState(true);

  const navigate = useNavigate();

  const { useradd, setUseradd } = useContext(addData);

  // status optios
  const options = [
    { value: 'Done', label: 'Done' },
    { value: 'Inprogess', label: 'Inprogess' },
    { value: 'Todo', label: 'Todo' },
    { value: 'Review', label: 'Review' },
  ];

  // setInput Value
  const setInputValue = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value })
  }

  // status set
  const setStatusValue = (e) => {
    setStatus(e.value)
  }

  // profile set
  const setProfile = (e) => {
    setImage(e.target.files[0])
  }

  //submit userdata
  const submitUserData = async(e) => {
    e.preventDefault();

    const { name,  email, project, estimation,spentTime,taskName } = inputdata;

    if (name === "") {
      toast.error("First name is Required !")
    } else if (estimation === "") {
      toast.error("Estimation is Required !")
    } else if (project === "") {
      toast.error("Email is Required !")
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !")
     } else if (status === "") {
       toast.error("Status is Required !")
    } else if (image === "") {
      toast.error("Profile is Required !")
    } else if (spentTime === "") {
      toast.error("SpentTime is Required !")}
      else if (taskName === "") {
        toast.error("TaskName is Required !")

    } else {
      console.log(image);

      const data = new FormData();
      data.append("name",name)
      data.append("email",email)
      data.append("project",project)
      data.append("estimation",estimation)
      data.append("status",status)
      data.append("user_profile",image)
      data.append("spentTime",spentTime)
      data.append("taskName",taskName)

      const config = {
        "Content-Type":"multipart/form-data"
      }

      const response = await registerfunc(data,config);
      
      if(response.status === 200){
        toast.success("Saved Successfully and refresh your page")

        setInputData({
          ...inputdata,
          name:"",
          project: "",
          estimation: "",
          spentTime: "",
          email:"",
          TaskName:""
                });
        setStatus("");
        setImage("");
        setUseradd(response.data)
       // toast.success("Saved Successfully and refresh your page")
        navigate("/"); 
        toast.success("Saved Successfully and refresh your page")
      }else{
        toast.error("Error!")
      }

    }

  }

  useEffect(() => {
    if (image) {
      setPreview(URL.createObjectURL(image))
    }

    setTimeout(() => {
      setShowSpin(false)
    }, 1200)
  }, [image])


  return (
    <>
      {
        showspin ? <Spiner /> : <div className="container">
          <h2 className='text-center mt-1'>Task</h2>
          <Card className='shadow mt-3 p-3'>
            <div className="profile_div text-center">
              <img src={preview ? preview : "/man.png"} alt="img" />
            </div>

            <Form>
              <Row>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name='name' value={inputdata.name} onChange={setInputValue} placeholder='Enter Name' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name='email' value={inputdata.email} onChange={setInputValue} placeholder='Enter Email' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Project</Form.Label>
                  <Form.Control type="text" name='project' value={inputdata.project} onChange={setInputValue} placeholder='Project' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control type="text" name='taskName' value={inputdata.taskName} onChange={setInputValue} placeholder='Project' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Select Your Profile</Form.Label>
                  <Form.Control type="file" name='user_profile' onChange={setProfile} placeholder='Select Your Profile' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Select Your Status</Form.Label>
                  <Select options={options}  onChange={setStatusValue} />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Estimation</Form.Label>
                  <Form.Control type="text" name='estimation' value={inputdata.estimation} onChange={setInputValue} placeholder='Estimation Time' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Spent Time</Form.Label>
                  <Form.Control type="text" name='spentTime' value={inputdata.spentTime} onChange={setInputValue} placeholder='Spent Time' />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={submitUserData}>
                  Submit
                </Button>
              </Row>

            </Form>
          </Card>
          <ToastContainer position="top-center" />
        </div>
      }

    </>
  )
}

export default Register