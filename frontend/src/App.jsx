import { Box, Container } from "@chakra-ui/react"; 
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";

function App() {
  const user = useRecoilValue(userAtom)  
  //console.log(user);
  return (
    <Box position={"relative"} w="full">
      <Container maxW='620px'>
        <Header/>
        <Routes>
          <Route path='/' element={user ? <HomePage/> : <Navigate to="/auth"/>}></Route>
          <Route path='/auth' element={!user ? <AuthPage/> : <Navigate to="/"/>} />
          <Route path='/update' element={user ? <UpdateProfilePage/> : <Navigate to="/auth"/>} />

          <Route path="/:username" element={ user? (
            <>
              <UserPage/>
              <CreatePost/>
            </>
          ) : (
            <UserPage/>
          ) }></Route>
          <Route path="/:username/post/:pid" element={<PostPage/>}></Route> //pid = postID
          <Route path="/chat" element={user ? <ChatPage></ChatPage> : <Navigate to={"/auth"}></Navigate>}></Route> //pid = postID
        </Routes>
        
      </Container>
    </Box>
  );
}

export default App
