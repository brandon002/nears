import { useState, useEffect, useRef } from "react";
import { Spinner } from '@chakra-ui/react'
import { verifiedEmail } from '../apis/authApi'
import { useLocation } from "react-router-dom";

const VerificationPage = (props: any) => {
    const [verificationData, setVerificationData] = useState({
        loading: true,
        Success: false,
    })
    const location = useLocation();
      
    useEffect(()=>{
        console.log("f")
        if(verificationData.Success){
            alert("Your email successly verified")
            window.location.href = "./login";
        }
    },[verificationData.loading])
    const queryParams = new URLSearchParams(location.search);
    const verifToken = queryParams.get("token");
    const email = queryParams.get("email");
    if(verificationData.loading)
    verifiedEmail({
        verifToken:verifToken,
        email:email,
    }) .then((response)=>{
        setVerificationData({
            loading:false,
            Success:response.status==200
        })
    }).catch((response)=>{
        setVerificationData({
            loading:false,
            Success:response.status==200
        })})
   
    return <><div className="flex items-center justify-center h-screen">
        {verificationData.loading?
        <div className='flex flex-col items-center' >
            Verification loading....
            <Spinner size='xl' emptyColor='gray.200'
                 />
        </div>
        :
       "Invalid Token"
        }
    </div></>
}
export default VerificationPage;
