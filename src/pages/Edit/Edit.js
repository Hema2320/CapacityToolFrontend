import React, { useContext, useEffect, useState } from 'react'
import Card from "react-bootstrap/Card"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import Spiner from "../../components/Spiner/Spiner"
import { singleUsergetfunc,editfunc } from '../../services/Apis';
import { useNavigate, useParams } from 'react-router-dom';
import { updateData } from '../../components/context/ContextProvider';
import { ToastContainer, toast } from "react-toastify"
import { BASE_URL } from '../../services/helper';
import 'react-toastify/dist/ReactToastify.css';
import "./edit.css"

// const BASE_URL="http://localhost:6000"


const Edit = () => {

  const [inputdata, setInputData] = useState({
    name: "",
    email: "",
    spentTime: "",
    estimation: "",
  });


  const [status, setStatus] = useState("Progress");
  const [imgdata,setImgdata] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const {update,setUpdate} = useContext(updateData)

 const navigate = useNavigate();

  const [showspin, setShowSpin] = useState(true);

  const {id} = useParams();

  // status optios
  const options = [
    { value: 'Complete', label: 'Complete' },
    { value: 'Incomplete', label: 'Incomplete' },
    { value: 'Progress', label: 'Progress' },
    { value: 'Inprogress', label: 'Inprogress' },
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

  

  const userProfileGet = async()=>{
    const response = await singleUsergetfunc(id);
    
    if(response.status === 200){
      setInputData(response.data)
      setStatus(response.data.status)
      setImgdata(response.data.profile)
    }else{
      console.log("error");
    }
  }
  

  //submit userdata
  const submitUserData = async(e) => {
    e.preventDefault();

    const { name,  email, estimation,spentTime } = inputdata;

    if (name === "") {
      toast.error("First name is Required !")
    } else if (estimation === "") {
      toast.error("Last name is Required !")
    } else if (email === "") {
      toast.error("Email is Required !")
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !")
    } else if (spentTime === "") {
      toast.error("Mobile is Required !")
    } 
    else {
      const data = new FormData();
      data.append("name",name)
      data.append("email",email)
      data.append("estimation",estimation)
      data.append("spentTime",spentTime)
      data.append("status",status)
      const response = await editfunc(id,data);
      
      if(response.status === 200){
        setUpdate(response.data)
        navigate("/")
      }

    }
  }

  useEffect(()=>{
    userProfileGet();
  },[id])

  useEffect(() => {
    if (image) {
      setImgdata("")
      setPreview(URL.createObjectURL(image))
    }
    setTimeout(() => {
      setShowSpin(false)
    }, 1200)
  }, [image]);



  return (
    <>
      {
        showspin ? <Spiner /> : <div className="container">
          <h2 className='text-center mt-1'>Update Your Details</h2>
          <Card className='shadow mt-3 p-3'>
            <div className="profile_div text-center">
              <img src={image ? preview : `${BASE_URL}/uploads/${imgdata}`} alt="img" />
            </div>

            <Form>
              <Row>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>name</Form.Label>
                  <Form.Control type="text" name='fname' value={inputdata.name} onChange={setInputValue} placeholder='Enter FirstName' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name='email' value={inputdata.email} onChange={setInputValue} placeholder='Enter Email' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" name='mobile' value={inputdata.estimation} onChange={setInputValue} placeholder='Enter Mobile' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Select Your Status</Form.Label>
                  <Select options={options} defaultValue={status} onChange={setStatusValue} />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Enter Your Location</Form.Label>
                  <Form.Control type="text" name='location' value={inputdata.spentTime} onChange={setInputValue} placeholder='Enter Your Location' />
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

export default Edit