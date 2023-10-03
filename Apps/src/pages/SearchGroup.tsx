import { useState, useEffect } from "react";
import Vector from "../assets/user.svg";
import { useSelector, useDispatch } from "react-redux";
import { createGroupAction, getGroupListAction, joinGroupAction, getUserGroupListAction } from "../redux/slices/groupSlices";
import { NavbarUser, ProfileCard } from "../components";
import { useNavigate } from "react-router-dom";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import {
    InputLeftAddon,
    Select,
    Textarea,
    CircularProgress,
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    Button,
    Stack,
    Skeleton,
    Image
} from '@chakra-ui/react'
import { getSkillInterestAction } from "../redux/slices/profileSlice";
import ImageUploadGroup from './../components/imageUploadGroup';
import Compressor from "compressorjs";
const SearchGroup = (props: any) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<any>();
    const group = useSelector((state:any)=> state.group); 
    const profile = useSelector((state:any)=> state.profile); 
    const [image, setImage]:any = useState('');
    const [preview, setPreview]:any = useState('');
    const [createGroupOpen, setCreateGroupOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [configCreateGroup, setConfigCreateGroup] = useState({
        name: '',
        description: '',
        rules: [],
        interests: [],
        groupRestriction: {
            skillInterestId: '',
            minPoint: 0
        }
    })
    const [ruleCreate, setRuleCreate] = useState({
        rule0: '',
        rule1: '',
        rule2: '',
        rule3: '',
        rule4: '',
    })
    const [interestCreate, setInterestCreate]:any = useState([])
    const createGroupError = {
        name: false,
        description: false,
        point: false
    };
    const ruleError = {
        rule0: false,
        rule1: false,
        rule2: false,
        rule3: false,
        rule4: false,
    }
    const [pickerItems, setPickerItems]: any = useState([]);
    const [selectedItems, setSelectedItems]: any = useState([]);
    const [errorInterest, setErrorInterest] = useState(false);

    const handleCreateItem = (item: any) => {
        setPickerItems((curr:any) => [...curr, item]);
        setSelectedItems((curr:any) => [...curr, item]);
      };
    
    const handleSelectedItemsChange = (selectedItems:any) => {
        var attendArr:any;
        if(selectedItems.length>1){
            alert("Please enter no more than 1 Interests!");
        } else {
            setSelectedItems(selectedItems);
            attendArr = selectedItems;
            setInterestCreate(attendArr?.value);
            setConfigCreateGroup((prev:any)=>({
                ...prev, 
                groupRestriction:{
                    ...prev.groupRestriction,
                    skillInterestId: selectedItems[0]?.value
                }
            }))
        }
    };
    function handleConfigCreateGroup(e:any){
        setConfigCreateGroup((prev:any)=>{
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    function handleGroupRestriction(e:any){
        setConfigCreateGroup((prev:any)=>({
            ...prev,
            groupRestriction:{
                ...prev.groupRestriction,
                minPoint: Number(e.target.value)
            }
        }))
    }
    function handleRuleCreate(e:any){
        setRuleCreate((prev:any)=>{
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    function handleCreateGroup(){
        dispatch(createGroupAction({
            image: image,
            name: configCreateGroup.name,
            description: configCreateGroup.description,
            rules: Object.values(ruleCreate),
            interests: selectedItems[0]?.value,
            groupRestriction: configCreateGroup.groupRestriction
        }));
        setConfigCreateGroup({
            name: '',
            description: '',
            rules: [],
            interests: [],
            groupRestriction: {
                skillInterestId: '',
                minPoint: 0
            }
        });
        setRuleCreate({
            rule0: '',
            rule1: '',
            rule2: '',
            rule3: '',
            rule4: '',
        });
        setCreateGroupOpen(false);
        setTimeout(()=>{
            dispatch(getGroupListAction({ page: 0 }));
        }, 100)
    }
    function handleJoinGroup(user: any){
        const idx = profile?.profile?.skillinterests?.findIndex((p:any)=> p?.skillinterestId?._id === user?.skillInterests[0]?.skillInterestId)
        if(idx === -1){
            setErrorInterest(true);
        } else {
            if(profile?.profile?.skillinterests[idx]?.point < user?.skillInterests[0]?.minPoint){
                setErrorInterest(true);
            } else {
                dispatch(joinGroupAction(user._id));
                setTimeout(()=>{
                    dispatch(getUserGroupListAction({ page: 0, userId: profile?.profile?._id }));
                }, 1)
            }
        }
    }
    function handleChangeSearch(e:any){
        setSearch(e.target.value)
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
                setImage(new File([result], file.name, {type: file.type}),)
            },
            error(err:any) {
                console.error(err.message);
            },
        });
    }
    useEffect(()=>{
        dispatch(getGroupListAction({ page: 0 }));
        dispatch(getSkillInterestAction(''));
    }, [])
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
        }
    }, [profile])
    useEffect(()=>{
        if(!props.user.isAuthenticated) navigate("/login");
    }, [props.user.isAuthenticated])
    return(
        <div>
            <div className="flex items-center justify-center">
                <NavbarUser/>
            </div>

            <div className="flex flex-row h-[100%] justify-center items-center" >
                <div className="flex flex-row h-[100%] w-[75%] p-[3.7rem]">
                    <ProfileCard/>
                    <Modal isOpen={errorInterest} onClose={()=>setErrorInterest(false)}>
                        <ModalOverlay />
                        <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                            <ModalHeader mt={6} display={'flex'} alignSelf={'center'} >You don't have interest or enough point!</ModalHeader>
                            <ModalCloseButton />

                            <ModalFooter >
                                <Button onClick={()=>setErrorInterest(false)} variant={'outline'} colorScheme="twitter">OK</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <div className="flex flex-col w-[50%] ml-[6rem]">
                        <div className="flex flex-row w-[100%] justify-between">
                            <FormControl >
                                <InputGroup className="flex items-center">
                                    <InputLeftElement
                                        mr={8}
                                        pointerEvents='none'
                                        children={<span className="material-symbols-outlined" style={{ 'fontSize': '20px', 'top': '1.2px', 'position': 'relative' }}> search </span>}
                                    />
                                    <Input onChange={(e:any)=> handleChangeSearch(e)} size={'md'} type='search' inputMode="search" placeholder="Search group" borderColor={'#7286D3'} />
                                </InputGroup>
                            </FormControl>
                            <div className="ml-4 w-fit" onClick={()=>setCreateGroupOpen(true)}>
                                <button className="flex items-center h-[100%] bg-logo text-white rounded-lg p-2"><span className="mr-3 material-symbols-outlined">add</span>Create</button>
                            </div>
                        </div>
                        {group.loadingGetGroupList || group.joinGroupLoading || group.loadingCreateGroup? 
                            <Stack spacing={1}>
                                <Skeleton height='4rem' rounded={'xl'}/>
                                <Skeleton
                                    height='4rem'
                                    color='white'
                                    fadeDuration={1}
                                    rounded={'xl'}
                                />
                                <Skeleton
                                    height='4rem'                        
                                    fadeDuration={2}
                                    rounded={'xl'}
                                />
                            </Stack> :
                            <>
                                {search === "" ? 
                                    <> 
                                        {group?.groupList?.groups?.slice(0, 5).map((user: any, index: number)=> 
                                            <div className="flex flex-col w-[100%] mt-4" key={index}>
                                                <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] p-4 pl-8 relative">
                                                    <div className="flex flex-row w-[100%] h-16">
                                                        <div className="flex rounded-full bg-white w-10 h-10 mt-1 border-purple-light border-2 relative top-[0.3rem]">
                                                            <Image onError={({ currentTarget }) => {
                                                                    currentTarget.onerror = null; 
                                                                    currentTarget.src= Vector;
                                                                }} 
                                                                rounded={'full'}
                                                                src={`data:${user.picture?.contentType};base64,${user.picture?.b64}`} alt='pict' />
                                                        </div>
                                                        <div className="flex flex-col mt-2 ml-6 text-white align-middle" role="button" onClick={()=>navigate(`/group/${user._id}`)}>
                                                            <span className="relative text-lg top-2 text-semibold"> {user?.name} </span>
                                                        </div>
                                                        {group?.userGroupList?.groups?.length > 0 ? 
                                                            <>
                                                                {group?.userGroupList?.groups?.find((e:any)=>e._id === user._id) === undefined ? 
                                                                    <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleJoinGroup(user)} role="button">login</span>
                                                                    :
                                                                    <span className="absolute text-white material-symbols-outlined right-6 bottom-10" >groups</span>
                                                                }
                                                            </> : 
                                                            <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleJoinGroup(user)} role="button">login</span>
                                                        }
                                                    </div>
                                                    
                                                </div>
                                            </div> 
                                        )}
                                    </> : 
                                    <> 
                                        {group?.groupList?.groups?.map((user: any, index: number)=> 
                                            <> 
                                                {(user.name.toLowerCase().includes(search.toLowerCase()) || user?.skills?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) || user?.interests?.toString()?.toLowerCase()?.includes(search?.toLowerCase())) &&
                                                    <div className="flex flex-col w-[100%] mt-4" key={index}>
                                                        <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] p-4 pl-8 relative">
                                                            <div className="flex flex-row w-[100%] h-16">
                                                                <div className="flex rounded-full bg-white w-10 h-10 mt-1 border-purple-light border-2 relative top-[0.3rem]">
                                                                    <Image onError={({ currentTarget }) => {
                                                                            currentTarget.onerror = null; 
                                                                            currentTarget.src= Vector;
                                                                        }} 
                                                                        rounded={'full'}
                                                                        src={`data:${user.picture?.contentType};base64,${user.picture?.b64}`} alt='pict' />
                                                                </div>
                                                                <div className="flex flex-col mt-2 ml-6 text-white align-middle" role="button" onClick={()=>navigate(`/group/${user._id}`)}>
                                                                    <span className="relative text-lg top-2 text-semibold"> {user?.name} </span>
                                                                </div>
                                                                {group?.userGroupList?.groups?.length > 0 ? 
                                                                    <>
                                                                        {group?.userGroupList?.groups?.find((e:any)=>e._id === user._id) === undefined ? 
                                                                            <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleJoinGroup(user)} role="button">login</span>
                                                                            :
                                                                            <span className="absolute text-white material-symbols-outlined right-6 bottom-10" >groups</span>
                                                                        }
                                                                    </> : 
                                                                    <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleJoinGroup(user)} role="button">login</span>
                                                                }
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                }   
                                            </>
                                        )}
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
                
            </div>
            <Modal isOpen={createGroupOpen} onClose={()=>setCreateGroupOpen(false)}>
                <ModalOverlay />
                <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                    <ModalHeader display={'flex'} alignSelf={'center'} >Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <span>Group Photo</span>
                        <ImageUploadGroup picture={image} preview={preview} setPreview={setPreview}
                         handleChangePicture={handleChangePicture}/>
                        <FormControl width={'100%'} isInvalid={createGroupError.name} mb={4}>
                            <FormLabel className="block text-sm">Group Name</FormLabel>
                            <Input type='text' name="name" 
                            onChange={(e:any)=>handleConfigCreateGroup(e)} value={configCreateGroup.name}
                            className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                            /> 
                            {createGroupError.name && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                        <FormControl width={'100%'} isInvalid={createGroupError.description} mb={4}>
                            <FormLabel className="block text-sm">Description</FormLabel>
                            <Input type='text' name="description"
                            onChange={(e:any)=>handleConfigCreateGroup(e)} value={configCreateGroup.description}
                            className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                            />
                            {createGroupError.description && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                        <Flex>
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
                            <FormControl width={'100%'} mb={4}>
                                <FormLabel className="block text-sm">Point Required</FormLabel>
                                <Input type='number' name="point" defaultValue={0}
                                onChange={(e:any)=>handleGroupRestriction(e)} value={configCreateGroup.groupRestriction.minPoint}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                />
                            </FormControl>
                        </Flex>
                        
                        <FormControl width={'100%'} isInvalid={ruleError.rule0} mb={4}>
                            <FormLabel className="">Rules</FormLabel>
                            <Flex className="flex items-center py-2 border-b-2 border-teal-500">
                                <input type='text' name="rule0"
                                onChange={(e:any)=>handleRuleCreate(e)} value={ruleCreate.rule0}
                                className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
                                />
                            </Flex>

                            {ruleError.rule0 && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                        <FormControl width={'100%'} isInvalid={ruleError.rule1} mb={4}>
                            <Flex className="flex items-center py-2 border-b-2 border-teal-500">
                                <input type='text' name="rule1"
                                onChange={(e:any)=>handleRuleCreate(e)} value={ruleCreate.rule1}
                                className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
                                />
                            </Flex>

                            {ruleError.rule1 && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                        <FormControl width={'100%'} isInvalid={ruleError.rule2} mb={4}>
                            <Flex className="flex items-center py-2 border-b-2 border-teal-500">
                                <input type='text' name="rule2"
                                onChange={(e:any)=>handleRuleCreate(e)} value={ruleCreate.rule2}
                                className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
                                />
                            </Flex>

                            {ruleError.rule2 && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                        <FormControl width={'100%'} isInvalid={ruleError.rule3} mb={4}>
                            <Flex className="flex items-center py-2 border-b-2 border-teal-500">
                                <input type='text' name="rule3"
                                onChange={(e:any)=>handleRuleCreate(e)} value={ruleCreate.rule3}
                                className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
                                />
                            </Flex>

                            {ruleError.rule3 && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                        <FormControl width={'100%'} isInvalid={ruleError.rule4} mb={4}>
                            <Flex className="flex items-center py-2 border-b-2 border-teal-500">
                                <input type='text' name="rule4"
                                onChange={(e:any)=>handleRuleCreate(e)} value={ruleCreate.rule4}
                                className="w-full px-2 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
                                />
                            </Flex>

                            {ruleError.rule4 && 
                                <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                            }
                        </FormControl>
                    </ModalBody>

                    <ModalFooter display={'flex'} justifyContent={'space-between'}>
                        <Button variant={'outline'} colorScheme="twitter" onClick={handleCreateGroup} >Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>

    )
}

export default SearchGroup;