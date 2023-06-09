import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "./profile.css";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import MyTweetCard from "../cards/mytweetcard";
import logo from "../images/logo.jpg";
import Nav from "react-bootstrap/Nav";
function Profile() {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState("");
  
  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  //selector
  const user = useSelector((state) => state.user);
  //creating config_obj to configure the authorized user
  const CONFIG_OBJ = {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  //To hande the file selection
  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
  };

  //Image upload functionality
  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);
    //API calling below
    const response = axios.post(`${API_BASE_URL}/uploadfile`, formData);
    return response;
  };
  //Add Post Functionality
  const addtweet = async () => {
    if (image.preview === "") {
      Swal.fire({
        icon: "error",
        title: "Add image for your tweet please.",
      });
    } else if (description === "") {
      Swal.fire({
        icon: "error",
        title: "Add some relevant text for your tweet, please",
      });
    } else if (location === "") {
      Swal.fire({
        icon: "error",
        title: "Add location of the Tweet",
      });
    } else {
      setLoading(true);
      const imgRes = await handleImgUpload();
      //Validation Rule for the Caption /Location
      const request = {
        description: description,
        location: location,
        image: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
      };
      //API call to create tweet
      const postResponse = await axios.post(
        `${API_BASE_URL}/createtweet`,
        request,
        CONFIG_OBJ
      );
      setLoading(false);
      if (postResponse.status === 201) {
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong while creating Tweet ",
        });
      }
    }
  };

  /*Upload picture Pop Up*/

  const [upload, setUpload] = useState(false);

  const handleuploadClose = () => setUpload(false);
  const handleuploadShow = () => setUpload(true);

  //To show profile images
  const [allmytweets, setMyAllTweets] = useState([]);
  const GetMyAllTweets = async () => {
    const response = await axios.get(`${API_BASE_URL}/myalltweets`, CONFIG_OBJ);
    
    if (response.status === 200) {
      setMyAllTweets(response.data.tweets);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };
  useEffect(() => {
    GetMyAllTweets();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  //naviage to edit profile page
  const Editprofile = () => {
    navigate(`/profile/editprofile/` + `${user._id}`)
 
  };
  //API call for delete tweet
  const deleteTweet = async (tweetId) => {
    console.log(tweetId);
    //debugger;
    const response = await axios.delete(
      `${API_BASE_URL}/deletetweet/${tweetId}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      //swal custon fire message
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        iconColor: "white",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
      await Toast.fire({
        icon: "success",
        title: "Tweet Deleted successfully",
      });
      
      {
        /**To auto reload the page on new tweet */
      }
      window.location.reload();
      GetMyAllTweets();
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };
  // to home
  const Tohome = () => {
    navigate("/home");
  };
  // to global
  const Toglobal = () => {
    navigate("/global");
  };
  // to search
  const Tosearch = () => {
    navigate("/search");
  };
  //to profile

  const Toprofile = () => {
    navigate("/profile");
  };

  return (
    <div className="container " id="containermain">
      <div className="row">
        <div className="col-md-4 col" id="sidemenu">
          <Card
            style={{
              marginTop: "85px",
              border: "none",
              width: "100%",
            }}
          >
            <Nav
              variant="pills"
              defaultActiveKey="/profile"
              className="flex-column"
              id="navvertival"
            >
              <Nav.Link>
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  src={logo}
                  alt="logo not available"
                ></img>
              </Nav.Link>
              <Nav.Link
                eventKey="/home"
                onClick={() => {
                  Tohome();
                }}
              >
                {" "}
                <i className="fa-solid fa-house-fire">&nbsp;</i>
                Home Post
              </Nav.Link>
              <Nav.Link
                eventKey="/global"
                onClick={() => {
                  Toglobal();
                }}
              >
                <i className="fa-solid fa-earth-asia">&nbsp;</i> Global Post
              </Nav.Link>
              <Nav.Link
                eventKey="/search"
                onClick={() => {
                  Tosearch();
                }}
              >
                {" "}
                <i className="fa-solid fa-magnifying-glass Size-lg">&nbsp;</i>
                Search user
              </Nav.Link>

              <Nav.Link
                eventKey="/profile"
                onClick={() => {
                  Toprofile();
                }}
              >
                {" "}
                <img className="dp"
                  style={{
                    width: "35px",
                    height: "35px",
                    border: "2px solid white",
                    borderRadius: "28px",
                    
                  }}
                  src={user.profileImg}
                  alt="no user"
                />
                &nbsp;My Profile
              </Nav.Link>
              <Nav.Link
                eventKey="link-5"
                onClick={() => {
                  logout();
                }}
              >
                <i className="fa-solid fa-right-from-bracket">&nbsp;</i>Log out
              </Nav.Link>
            </Nav>
          </Card>
        </div>
        <div className="col-md-8 col-sm-12" style={{ marginTop: "85px" }}>
          <Card className="p-2">
            <Card>
              <Card.Img
                style={{ height: "300px" }}
                variant="top"
                src={user.backgroundwallpaper}
              />
             
              <i
                onClick={() => Editprofile()}
                className="fa-solid fa-pen shadow"
                style={{
                  cursor: "pointer",
                  color: "black",
                  border: "5px solid white",
                  borderRadius: "30px",
                  float: "right",
                  backgroundColor: "white",

                  position: "absolute",
                  top: "10px",
                  left: "10px",
                }}
              ></i>
              <Card.Body>
                <Card.Img
                  className="shadow dp"
                  style={{
                    marginTop: "-100px",
                    height: "150px",
                    width: "150px",
                    borderRadius: "100px",
                    border: "5px solid white",
                  }}
                  variant="top"
                  src={user.profileImg}
                />
                {/**update profile button */}
                <i
                  onClick={() => Editprofile()}
                  className="fa-solid fa-pen shadow"
                  style={{
                    color: "black",
                    border: "5px solid white",
                    borderRadius: "30px",
                    marginLeft: "-35px",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                ></i>
                <Card.Text style={{ fontFamily: "georgia", fontWeight: "520" }}>
                  {user.fullName}
                </Card.Text>
              </Card.Body>

              <Card.Text style={{ fontFamily: "georgia", fontWeight: "500" }}>
                {user.bio}
              </Card.Text>
              <Card.Text style={{ color: "#4169e1" }}>
                <i className="fa-solid fa-calendar-days"></i> &nbsp;{user.DOB}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <i className="fa-solid fa-location-dot"></i> &nbsp;
                {user.location}
              </Card.Text>
              <div className="row p-2">
                <div className="col-4">
                  {" "}
                  <Button
                    className="form-control"
                    style={{
                     
                      border: "none",
                      backgroundColor: "white",
                      color: "#4169e1",
                      fontWeight: "700",
                    }}
                  >
                    {user.followers?.length} <br></br>Followers
                  </Button>
                </div>
                <div className="col-4">
                  {" "}
                  <Button
                    className="form-control"
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      color: "#4169e1",
                      fontWeight: "700",
                    }}
                  >
                    {user.following?.length}
                    <br></br>Following
                  </Button>
                </div>
                <div className="col-4">
                  {" "}
                  <Button
                    className="form-control"
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      color: "#4169e1",
                      fontWeight: "700",
                    }}
                  >
                    {allmytweets?.length}
                    <br></br>Tweets
                  </Button>
                </div>
              </div>
              {/**Tweet and edit profile  */}
              <div className="row p-2">
                <div className="col-5 ">
                  <button
                    onClick={() => Editprofile()}
                    style={{ fontWeight: "620" }}
                    className="form-control shadow"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="col-5">
                  <button
                    onClick={handleuploadShow}
                    style={{ color: "black" }}
                    className="form-control shadow"
                  >
                    {" "}
                    <i className="fa-brands fa-twitter"></i>
                      &nbsp;Let's Tweet
                  </button>
                </div>
                <div className="col-2">
                  <button
                    onClick={() => {
                      logout();
                    }}
                    style={{ color: "black" }}
                    className="form-control shadow"
                  >
                    {" "}
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </button>
                </div>
              </div>
              <hr></hr>
             
              <div className="row  ">
                
                {allmytweets
                  .map((tweet) => {
                    return (
                      <div className="col-md-6 col-sm-12" key={tweet._id}>
                        <MyTweetCard
                          tweetData={tweet}
                          deleteTweet={deleteTweet}
                          GetMyAllTweets={GetMyAllTweets}
                        />
                      </div>
                    );
                  })
                  .reverse()}
              </div>
            </Card>
          </Card>
        </div>
      </div>
      {/*pop up for upload picture*/}
      <Modal show={upload} onHide={handleuploadClose} size="lg" centered>
        <Modal.Header
          style={{ backgroundColor: "blue", color: "white" }}
          closeButton
        >
          <span className="fw-bold fs-3">
            New Tweet <i className="fa-brands fa-twitter"></i>
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              
              <div className="uploadbox">
                {image.preview && (
                  <img
                    style={{ width: "100%" }}
                    src={image.preview}
                    id="imagepreview"
                    alt="Something went wrong, please try again later"
                  ></img>
                )}
                <div className="dropZoneContainer">
                  <input
                    name="file"
                    type="file"
                    id="drop_zone"
                    className="FileUpload"
                    accept=".jpg,.png,.gif,.jpeg,.mp4"
                    onChange={handleFileSelect}
                  />
                  <div className="dropZoneOverlay">
                    {/**here to add */}
                    <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
                    <br></br>
                    Drag or Drop your Image. <br></br>
                    <b>OR</b>
                    <br></br>Click to Add
                  </div>
                </div>
              </div>
             
            </div>
            <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-between">
              <div className="row">
                <div className="col-sm-12 mb-3 mt-3">
                  <div className="form-floating">
                    <textarea
                      value={description}
                      onChange={(ev) => setDescription(ev.target.value)}
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="floatingTextarea"
                    ></textarea>
                    <label for="floatingTextarea">
                      {" "}
                      <i className="fa-brands fa-twitter"></i>Tweet Content
                    </label>
                  </div>
                </div>
                <div className=" col-sm-12 mb-3">
                  <div className="form-floating mb-3">
                    <input
                      value={location}
                      onChange={(ev) => setLocation(ev.target.value)}
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Add Location"
                    />
                    <label for="floatingInput">
                      <i className="fa-solid fa-location-dot"></i>Add Location
                    </label>
                  </div>
                </div>
              </div>
              {/*post button */}
              <div className="row">
                <div className="col-sm-12 mb-3 ">
                  {/*Adding the loading animation on top of the card  */}
                  {loading ? (
                    <div className="row">
                      <div className="col-md-12">
                        {/*Adding spinner code from bootstrap */}
                        <div
                          className="spinner-border text-warning"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => addtweet()}
                    style={{ backgroundColor: "blue", color: "white" }}
                    className="custom-profile custom-btn-upload float-end"
                  >
                    <span className=" fs-6 fw-700">
                      {" "}
                      Add Tweet <i className="fa-brands fa-twitter"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#4169e1", color: "white" }}>
          Copyrights &copy; || 2022-23 @ YAB
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Profile;
