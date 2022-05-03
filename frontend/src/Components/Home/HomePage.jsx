
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"
import { deleteUser, gettAllUsers } from "../../Redux/apiRequest";
import { createAxios } from "../../createInstance";
import "./home.css";
import { loginSuccess } from "../../Redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers)
  const msg = useSelector((state) => state.users.msg)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);


  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT)
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
    if (user?.accessToken) {

      gettAllUsers(user?.accessToken, dispatch, axiosJWT)
    }
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? `admin` : `user`}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>
      <div className="errorMsg">{msg}</div>
    </main>
  );
};

export default HomePage;
