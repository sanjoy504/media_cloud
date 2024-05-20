
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { getUserData } from "./context/User/getUserData"
import { environmentVariables } from "./helper/helper"
import { updateUserDataState } from "./context/User/userSlice"
import LoginPage from "./pages/login/LoginPage"
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import RouteLayout from "./pages/RouteLayout"

function App() {

  const dispatch = useDispatch();

  const { userId } = getUserData();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [appLoading, setAppLoading] = useState(true);

  //Validate user after app load
  useEffect(() => {

    const validateUser = async () => {
      try {

        const response = await axios.get(`${environmentVariables.backendUrl}/user/validate`,
          { withCredentials: true }
        );

        const responseData = response.data;

        if (response.status === 200) {

          const { userDetails, storageDetails } = responseData;

          const { _id, email, name, avatar, storage_limit } = userDetails || {};

          dispatch(updateUserDataState({
            userId: _id,
            name,
            email,
            avatar,
            storage_limit,
            storageDetails
          }));
        }
      } catch (error) {
        console.log(error)
      } finally {
        setAppLoading(false)
      }
    };

    validateUser();

  }, []);


  //Protect others route if user not authenticated
  useEffect(() => {

    if (!appLoading && !userId && pathname !== "/") {
      navigate('/', { replace: true })
    }

  }, [userId, appLoading])


  //Show loading before user validate
  if (appLoading) {
    return (
      <div className="w-full h-full min-h-[80vh] flex flex-col justify-center items-center my-10">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 small-screen:w-24 small-screen:h-24" viewBox="0 0 512 512">
          <path d="M0 0 C0.81436523 0.23106445 1.62873047 0.46212891 2.46777344 0.70019531 C40.63353609 11.88404393 71.70672312 35.9162602 91 71 C95 79.11145511 95 79.11145511 95 82 C95.93005859 81.94779297 95.93005859 81.94779297 96.87890625 81.89453125 C119.36025457 81.20732846 141.20096641 90.45209319 158 105 C158.75925781 105.61488281 159.51851563 106.22976562 160.30078125 106.86328125 C176.60914562 120.46766811 189.05097542 143.695881 191 165 C192.36493129 192.05706588 188.60422698 218.88516924 169.87060547 239.89501953 C167.62650795 242.31038719 165.3172316 244.65463812 163 247 C162.14341797 247.96486328 162.14341797 247.96486328 161.26953125 248.94921875 C147.29504801 264.36066685 124.71902813 272.98478709 104.41015625 274.8828125 C99.2760483 275.13244498 94.13816407 275.07147369 89 275 C88.74863281 275.55558594 88.49726563 276.11117188 88.23828125 276.68359375 C77.81874331 296.17503224 56.63496928 307.63123986 36.4735527 314.13812351 C22.89148692 317.79723377 9.46711041 317.5569017 -4.51855469 317.50170898 C-7.26841824 317.50329064 -10.01825846 317.51085235 -12.76811218 317.51808167 C-19.42309178 317.53192064 -26.07787996 317.52452861 -32.73285022 317.50940608 C-40.49936927 317.49243752 -48.26584206 317.49576966 -56.03237393 317.49950016 C-69.89645827 317.50536121 -83.76045141 317.49127431 -97.62451172 317.46655273 C-111.0487001 317.44261856 -124.47276677 317.43555796 -137.89697266 317.44604492 C-152.55466231 317.45747514 -167.21229586 317.45935969 -181.86998487 317.44494683 C-183.4351255 317.44342115 -185.00026615 317.44190079 -186.5654068 317.44038582 C-187.33527774 317.439628 -188.10514867 317.43887019 -188.89834903 317.43808941 C-194.30059603 317.43336428 -199.7028178 317.43518526 -205.10506439 317.43945122 C-211.69339577 317.44439684 -218.28161253 317.43830899 -224.86991778 317.41855692 C-228.22558382 317.40874135 -231.58093197 317.40514584 -234.93662834 317.41144943 C-238.58568245 317.41744268 -242.23423102 317.40481945 -245.88323975 317.38768005 C-246.92713324 317.3936901 -247.97102674 317.39970014 -249.04655337 317.40589231 C-259.69380881 317.31550895 -269.88915902 315.2290545 -279.3125 310.1875 C-279.98982178 309.8363916 -280.66714355 309.4852832 -281.36499023 309.12353516 C-286.29061811 306.51497678 -290.75384882 303.62230907 -295 300 C-295.56460937 299.5771875 -296.12921875 299.154375 -296.7109375 298.71875 C-308.9563225 289.18840511 -317.57744472 272.99552952 -320.5625 257.90234375 C-323.13065803 234.99529129 -320.3480485 213.81105896 -305.6875 195.1875 C-292.97437384 180.59094774 -276.76630017 169.52048463 -257 168 C-256.98582031 167.29359375 -256.97164063 166.5871875 -256.95703125 165.859375 C-256.21478399 149.89102855 -251.54994207 134.50344315 -245 120 C-244.47664063 118.83082031 -243.95328125 117.66164063 -243.4140625 116.45703125 C-237.26723544 103.45634773 -228.93135425 92.36679305 -219 82 C-217.80697266 80.69482422 -217.80697266 80.69482422 -216.58984375 79.36328125 C-197.78288972 59.47840225 -172.31270692 46.55820653 -145.4375 42.125 C-136.5873392 40.61669127 -131.32245291 37.52246021 -125 31 C-93.38499554 1.29334591 -41.93230298 -11.92714777 0 0 Z " fill="#BADDFA" transform="translate(321,99)" />
          <path d="M0 0 C0.81436523 0.23106445 1.62873047 0.46212891 2.46777344 0.70019531 C40.63353609 11.88404393 71.70672312 35.9162602 91 71 C95 79.11145511 95 79.11145511 95 82 C95.93005859 81.94779297 95.93005859 81.94779297 96.87890625 81.89453125 C119.36025457 81.20732846 141.20096641 90.45209319 158 105 C158.75925781 105.61488281 159.51851563 106.22976562 160.30078125 106.86328125 C176.60914562 120.46766811 189.05097542 143.695881 191 165 C192.36493129 192.05706588 188.60422698 218.88516924 169.87060547 239.89501953 C167.62650795 242.31038719 165.3172316 244.65463812 163 247 C162.14341797 247.96486328 162.14341797 247.96486328 161.26953125 248.94921875 C146.89952531 264.79686026 123.0079238 273.94960381 102 275 C97.99826252 275.06799069 94.00174511 275.06094028 90 275 C91.28427027 270.85975726 92.8567964 267.14499544 94.875 263.3125 C102.05302375 249.13152624 104.39596463 236.10125849 104.375 220.25 C104.37478851 219.58736145 104.37457703 218.9247229 104.37435913 218.24200439 C104.34227838 208.17412103 103.70950548 199.43795493 100 190 C99.63777344 188.9790625 99.27554688 187.958125 98.90234375 186.90625 C89.87295157 163.15435735 72.22899472 145.02177272 49.4375 134.25 C39.48931696 129.96795599 28.10641648 125.3814381 17.08203125 126.22265625 C13.8461519 126.39672424 11.9580345 126.36946042 9 125 C5.97853319 120.59546739 3.97581634 115.9363278 1.90429688 111.03125 C-1.89091064 102.50637782 -8.01509467 95.07205105 -14 88 C-14.68835938 87.17628906 -15.37671875 86.35257812 -16.0859375 85.50390625 C-37.14256184 61.14055571 -70.82379413 43.70447215 -103 41 C-108.33154153 40.7417437 -113.66444979 40.58581062 -119 40.4375 C-120.45704157 40.39422635 -121.91407299 40.3506095 -123.37109375 40.30664062 C-126.91395412 40.20046698 -130.45692963 40.09894889 -134 40 C-130.23258912 35.34608979 -126.37265926 31.3353101 -121.625 27.6875 C-121.02413574 27.22311523 -120.42327148 26.75873047 -119.80419922 26.28027344 C-103.72256064 14.07527375 -86.5921922 5.53319082 -67.02783203 0.52001953 C-65.17782995 0.04560291 -63.33636965 -0.46181043 -61.49609375 -0.97265625 C-42.8003097 -5.38494337 -18.54051759 -5.273631 0 0 Z " fill="#64B5F6" transform="translate(321,99)" />
        </svg>
        <h1 className="text-2xl small-screen:text-xl text-gray-700 text-center font-semibold">
          Welcome to media cloud
        </h1>
      </div>
    )
    //If server not return user so return Login page
  } else if (!userId) {
    return (<LoginPage />);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideBar />
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <main className="py-2 px-2.5"> {/* Added padding */}
            <RouteLayout />
          </main>
        </div>
      </div>
    </>
  )
}
export default App
