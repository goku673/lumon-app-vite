import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./app/page"
import SignIn from "./app/(pages)/auth/signIn/page"
import SignUp from "./app/(pages)/auth/signUp/page"
import TopMenu from "./components/topMenu"
import Incription from "./app/(pages)/inscription/page"
import DetailInscription from "./app/(pages)/detail-inscription/page"
import ViewRegistrant from "./app/(pages)/view-registrant/page"
import RegisterArea from "./app/(pages)/register-area/page"
import RegisterOlympicPage from "./app/(pages)/register-olympic/page"
import AnnouncementPage from "./app/(pages)/announcement/page"

function App() {
  

  return (
    <BrowserRouter>
      <TopMenu />
      <div className="pt-[80px] bg-[#0f2e5a] min-h-screen">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/inscription" element={<Incription/>} />
          <Route path="/detail-inscription" element={<DetailInscription/>} />
          <Route path="/view-registrant" element={<ViewRegistrant/>}/>
          <Route path="register-area" element={<RegisterArea/>}/>
          <Route path="/register-olympic" element={<RegisterOlympicPage/>}/>
          <Route path="/announcement" element={<AnnouncementPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
