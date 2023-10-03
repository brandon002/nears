import { useState, useEffect} from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputLeftAddon,
    Input,
    InputGroup,
    Select,
    Textarea,
    CircularProgress
  } from '@chakra-ui/react'
import { NavbarUser } from "../components";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import 'material-symbols';
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction, editProfileAction, getInterestAction, getSkillAction, editInterestAction, editSkillAction
, getResetTokenAction, uploadPicUserAction, getSkillInterestAction } from "../redux/slices/profileSlice";
import { resetPasswordThrunk } from "../redux/slices/resetPasswordSlice";
import ImageUploader from "../components/imageUploader";
import Compressor from "compressorjs";
import { format } from 'date-fns';
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import './select.css'
const EditProfile = (props: any) => {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState<number>(Number(0))
    const dispatch = useDispatch<any>();
    const profile = useSelector((state:any)=> state.profile);   
    const resetPasswordState = useSelector((state: any) => state.resetPassword);
    const [imgPreview, setImgPreview]: any = useState();
    const token = localStorage.getItem('jwtToken');
    const [configEditPersonal, setConfigEditPersonal] = useState<any>({
        fullName: '',
        nickName: '',
        phone: '',
        email: '',
        hobby: '',
        address: '',
        dob: format(new Date(), 'yyyy-MM-dd'),
        gender: 'Male',
        description: ''
    })
    const [configEditPassword, setConfigEditPassword] = useState({
        password: '',
        confirmPassword: '',
        password3: '',
        resetToken: '',
        email:''
    })
    const [pickerItems, setPickerItems]: any = useState([]);
    const [selectedItems, setSelectedItems]: any = useState([]);

    const handleCreateItem = (item: any) => {
        setPickerItems((curr:any) => [...curr, item]);
        setSelectedItems((curr:any) => [...curr, item]);
      };
    
    const handleSelectedItemsChange = (selectedItems:any) => {
        var attendArr:any;
        if(selectedItems.length>10){
            alert("Please enter no more than 10 Interests!");
        } else {
            setSelectedItems(selectedItems);
            attendArr = selectedItems;
            setConfigEditSkill(attendArr);
        }
    };
    const [passwordTrue, setPasswordTrue] = useState(false)
    const [configEditSkill, setConfigEditSkill] = useState<any>([])

    const editPersonalError = {
        fullName: configEditPersonal?.fullName?.length < 4 && configEditPersonal?.fullName?.length !== 0,
        nickName: configEditPersonal?.nickName?.length < 4 && configEditPersonal?.nickName?.length !== 0,
        phone: (configEditPersonal?.phone?.toString()?.length > 10 || configEditPersonal?.phone?.toString()?.length < 8) && configEditPersonal?.phone?.toString()?.length !== 0,
        email: !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(configEditPersonal?.email)),
        hobby: configEditPersonal?.hobby?.length < 4 && configEditPersonal?.hobby?.length !== 0,
        address: (configEditPersonal?.address?.length < 15 || configEditPersonal?.address?.length > 50) && configEditPersonal?.address?.length !== 0,
        description: (configEditPersonal?.description?.length < 15 || configEditPersonal?.description?.length > 50) && configEditPersonal?.address?.length !== 0
    };

    const [picUser, setPicUser] = useState<any>('')
    function handleChangePersonal(e:any){
        setConfigEditPersonal((prev:any)=>{
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    function handleChangePassword(e:any){
        setConfigEditPassword((prev:any)=>{
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    function handleEditPersonal(){
        if(!editPersonalError.fullName && !editPersonalError.nickName && !editPersonalError.email && !editPersonalError.hobby && !editPersonalError.address && !editPersonalError.description && !editPersonalError.phone){
            dispatch(editProfileAction(configEditPersonal))
            setTimeout(() => {
                dispatch(uploadPicUserAction(picUser))
                setTimeout(()=>{
                    dispatch(getProfileAction(token))
                }, 1)
            }, 1);
        } else {
            alert("Please provide valid data!");
        }
    }

    function handleEditSkills(){
        if(configEditSkill.length > 0 && configEditSkill.length <= 10){
            dispatch(editSkillAction(configEditSkill?.map((skill: any)=> skill.value)))
            setTimeout(()=>{
                dispatch(getSkillInterestAction(''));
            }, 1)
            setTimeout(()=>{
                setActiveTab(1);
            }, 2)
            
        }  else{
            alert("Please enter an interest!");
        }

    }
    
    function handleValidatePassword(){
        dispatch(getResetTokenAction(configEditPassword.password3))
    }
    function handleResetPassword(){
        dispatch(resetPasswordThrunk(configEditPassword))
    }
    function handleChangePicture(e:any){
        const file = e[0];
        if (!file) {
            return;
        }
        new Compressor(file, {
            convertSize: 50000,
            quality: 0.4,
            success(result:any) {
                setPicUser(new File([result], file.name, {type: file.type}),)
            },
            error(err:any) {
                console.error(err.message);
            },
        });
    } 
    useEffect(()=>{
        if(Object.keys(profile?.profile).length > 0 && !profile?.loading && !profile.getSkillLoading && !profile.getInterestLoading){
            profile?.skillInterest?.InterestSkill?.map((user:any)=>{
                if(pickerItems.find((e:any)=>e.label === user.skillInterestName) === undefined){
                    setPickerItems((prev:any)=>[...prev,{
                        value: user._id,
                        label: user.skillInterestName
                    }])
                }   
            })
            if(selectedItems.length === 0 ){
                profile?.profile?.skillinterests?.map((interest:any)=>{
                    setSelectedItems((prev:any)=>[...prev,{
                        value: interest.skillinterestId._id,
                        label: interest.skillinterestId.skillInterestName
                    }]) 

                })
            }
            setConfigEditPersonal({
                fullName: profile?.profile?.fullName,
                nickName: profile?.profile?.nickName,
                phone: profile?.profile?.phone,
                email: profile?.profile?.email,
                hobby: profile?.profile?.hobby,
                address: profile?.profile?.address,
                dob: profile?.profile?.birthdayDate !== undefined ? format(new Date(profile?.profile?.birthdayDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                gender: profile?.profile?.gender === undefined ? 'Male' : profile?.profile?.gender,
                description: profile?.profile?.description
            })
            setConfigEditPassword({
                password: '',
                confirmPassword: '',
                password3: '',
                resetToken: '',
                email: profile?.profile?.email
            })
            setImgPreview(`data:${profile?.profile?.picture?.contentType};base64,${profile?.profile?.picture?.data}`);
        }
    }, [profile])
    useEffect(()=>{
        if(token!=null){
            dispatch(getProfileAction(token))
            dispatch(getSkillInterestAction(''))
        }
    }, [dispatch, token])

    useEffect(()=>{
        if(profile?.resetToken !== '' || null || undefined){
            if(profile?.resetToken?.message==='verified'){
                setPasswordTrue(true);
                setConfigEditPassword((prev:any)=>({
                    ...prev,
                    resetToken: profile?.resetToken?.resetToken
                }))
            }
        }
    }, [profile])
    useEffect(()=>{
        if(resetPasswordState?.success){
            setPasswordTrue(false)
        }
    }, [resetPasswordState])
    useEffect(()=>{
        if(localStorage.getItem('jwtToken')===null){
            window.location.href = "./#/login";
        }
    }, [])

    console.log(profile)
    return profile?.loading || Object.keys(profile).length < 1 || profile?.getSkillLoading || profile?.getInterestLoading ? <CircularProgress position={'fixed'} top={'43%'} left={"48%"} isIndeterminate/> : (
    <>
        <div className="flex items-center justify-center">
            <NavbarUser user={props.user}/>
        </div>
        <div className="flex flex-col">
            <div>
                <div className="flex justify-center">
                    <div className="flex flex-col items-center mt-4 mb-4" role="button">  
                        <ImageUploader picture={imgPreview !== undefined ? imgPreview: ''} 
                         handleChangePicture={handleChangePicture}/>
                        <span className="mt-2"> {profile?.profile?.name} </span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center w-full align-middle"> 
                <div className="flex flex-wrap items-center justify-center w-full gap-1 align-middle">
                    <Tabs selectedIndex={activeTab} className="flex flex-wrap items-center self-center justify-center w-full align-middle">
                        <TabList className="flex items-center justify-between w-2/3 h-10 mb-2 align-middle bg-border rounded-3xl">
                            <Tab onFocus={()=>setActiveTab(0)} onClick={()=>setActiveTab(0)}
                            className="ml-16 text-white outline-none cursor-pointer" > <span className={activeTab === 0 ? "underline decoration-solid" : ""}>Personal Information</span></Tab>
                            <Tab onFocus={()=>setActiveTab(1)} onClick={()=>setActiveTab(1)} className="mr-2 text-white outline-none cursor-pointer " ><span className={activeTab ===1 ? "underline decoration-solid" : ""}>Interests</span></Tab>
                            <Tab onFocus={()=>setActiveTab(2)} onClick={()=>setActiveTab(2)} className="mr-16 text-white outline-none cursor-pointer" ><span className={activeTab ===2 ? "underline decoration-solid" : ""}>Change Password</span></Tab>
                        </TabList>
                        <TabPanel className="flex flex-wrap items-center justify-center gap-1 align-middle">
                            <FormControl width={'33.3%'} isInvalid={editPersonalError.fullName} mb={4}>
                                <FormLabel className="block text-sm">Fullname</FormLabel>
                                <Input type='text' name="fullName" 
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.fullName}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                /> 
                                {editPersonalError.fullName && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'33.3%'} isInvalid={editPersonalError.nickName} mb={4}>
                                <FormLabel className="block text-sm">Role</FormLabel>
                                <Input type='text' name="nickName"
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.nickName}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                                {editPersonalError.nickName && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'33.3%'} isInvalid={editPersonalError.phone} mb={4}>
                                <FormLabel className="block text-sm">Phone Number</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon mt={'3.5px'} children='+62' />
                                    <Input type='number' name="phone" 
                                    onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.phone}
                                    className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                    />
                                </InputGroup>
                                {editPersonalError.phone && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'} left={'64px'}>Please enter a valid phone number.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'33.3%'} isInvalid={editPersonalError.email} mb={4}>
                                <FormLabel className="block text-sm">Email</FormLabel>
                                <Input type='email' name="email"
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.email}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                                {editPersonalError.email && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter a valid email.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'33.3%'} isInvalid={editPersonalError.hobby} mb={4}>
                                <FormLabel className="block text-sm">Hobby</FormLabel>
                                <Input type='text' name="hobby"
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.hobby}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                                {editPersonalError.hobby && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'33.3%'} isInvalid={editPersonalError.address} mb={4}>
                                <FormLabel className="block text-sm">Address</FormLabel>
                                <Input type='text' name="address"
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.address}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                                {editPersonalError.address && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 15 characters or less than 50 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'33.3%'} mb={4}>
                                <FormLabel className="block text-sm">Birthday Date</FormLabel>
                                <Input type='date' name="dob"
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.dob}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                            </FormControl>
                            <FormControl width={'33.3%'} mb={4}>
                                <FormLabel className="block text-sm">Gender</FormLabel>
                                <Select name="gender" onChange={(e:any)=>handleChangePersonal(e)}
                                value={configEditPersonal.gender} className="block w-full px-3 pt-0 pb-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1">
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                </Select>
                            </FormControl>
                            <FormControl width={'66.599%'} isInvalid={editPersonalError.description} >
                                <FormLabel className="block text-sm">Description</FormLabel>
                                <Textarea name="description"
                                onChange={(e:any)=>handleChangePersonal(e)} value={configEditPersonal.description}
                                className="block w-full h-24 px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                                {editPersonalError.description && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 15 characters or less than 50 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <div className="flex flex-wrap items-center justify-start w-2/3 mt-4 align-middle">
                                <button onClick={handleEditPersonal}
                                type="button" 
                                className="h-10 mr-8 text-base text-white bg-purple2 w-28 rounded-3xl">
                                    Save
                                </button>
                                <button 
                                type="button" 
                                className="h-10 text-base text-white bg-purple2 w-28 rounded-3xl">
                                    Back
                                </button>
                            </div>
                        </TabPanel>
                        <TabPanel className="flex flex-wrap items-center justify-start w-2/3 gap-1 align-middle">   
                            <div className="flex flex-row w-[100%] gap-1">
                                <CUIAutoComplete
                                    listStyleProps={{ 'width': '75%' }}
                                    label=""
                                    placeholder="Choose Interest"
                                    onCreateItem={handleCreateItem}
                                    items={pickerItems}
                                    selectedItems={selectedItems}
                                    onSelectedItemsChange={(changes) =>
                                        handleSelectedItemsChange(changes.selectedItems)
                                    }
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-start w-2/3 mt-4 align-middle">
                                <button onClick={handleEditSkills} type="button" className="h-10 mr-8 text-base text-white bg-purple2 w-28 rounded-3xl">
                                    Save
                                </button>
                                <button type="button" className="h-10 text-base text-white bg-purple2 w-28 rounded-3xl">
                                    Back
                                </button>
                            </div>
                        </TabPanel>
                        <TabPanel className={!passwordTrue ? "flex flex-wrap items-center align-middle justify-start w-2/3 gap-1" : "flex flex-wrap items-center align-middle justify-center gap-1 w-full"}>
                            {passwordTrue ?
                                <>
                                <div className="w-1/3">
                                    <span className="block text-sm">
                                        Password
                                    </span>
                                    <input type="text" name="password" onChange={(e:any)=>handleChangePassword(e)} value={configEditPassword.password} className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"/>
                                </div>
                                <div className="w-1/3">
                                    <span className="block text-sm">
                                        Confirm Password
                                    </span>
                                    <input type="text" name="confirmPassword" onChange={(e:any)=>handleChangePassword(e)} value={configEditPassword.confirmPassword}  className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"/>
                                </div>
                                <div onClick={handleResetPassword} className="flex flex-wrap items-center justify-start w-2/3 mt-4 align-middle">
                                    <button type="button" className="h-10 mr-8 text-base text-white bg-purple2 w-28 rounded-3xl">
                                        Save
                                    </button>
                                    <button type="button" className="h-10 text-base text-white bg-purple2 w-28 rounded-3xl">
                                        Back
                                    </button>
                                </div>
                                </>
                                :
                                <>
                                <div className="w-1/2">
                                    <span className="block text-sm">
                                        Old Password
                                    </span>
                                    <input type="text" name="password3" onChange={(e:any)=>handleChangePassword(e)} value={configEditPassword.password3} className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"/>
                                </div>
                                <div className="flex flex-wrap items-center justify-start w-2/3 mt-4 align-middle">
                                    <button type="button" onClick={handleValidatePassword} className="h-10 mr-8 text-base text-white bg-purple2 w-28 rounded-3xl">
                                        Save
                                    </button>
                                    <button type="button" className="h-10 text-base text-white bg-purple2 w-28 rounded-3xl">
                                        Back
                                    </button>
                                </div>
                                </>
                            }

                        </TabPanel>
                    </Tabs>
                </div>
                
            </div>
            
            
        </div>
    </>

    )
}

export default EditProfile;