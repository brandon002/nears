import {useState, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import { Flex, Image } from '@chakra-ui/react';
import Vector from '../assets/user.svg'
const ImageButtonUploader = (props: any) => {
    const {
        handleChangePicture,
        setPreview
    } = props;
    const {getRootProps, getInputProps} = useDropzone({
        accept: {'image/*': []},
        onDrop: (acceptedFiles: any) => {
            setPreview(acceptedFiles.map((file: any)=> Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        multiple: false,
        onDropAccepted: handleChangePicture,
        onDropRejected: (e:any) => {
            alert('Please input valid image');
        },
        maxSize: 2000000
    });

    return(
        <Flex direction={'column'}>
            <Flex gap={'12px'}>
                <Flex 
                    {...getRootProps()} 
                    width={'100%'} 
                    mt={4}
                    justifyContent={'center'}
                    alignItems={'center'}
                    cursor={'pointer'}
                    mr={4}
                >   
                    
                    <input {...getInputProps()} />
                    <span className="flex mr-3 material-symbols-outlined">add</span>
                    <span className="flex">Add Image</span>
                    
                </Flex>

            </Flex>
        </Flex>
    )
}

export default ImageButtonUploader;