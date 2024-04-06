import { AddIcon } from '@chakra-ui/icons'
import { Button, Text, FormControl, Textarea, useColorModeValue, useDisclosure, Input, Flex, Image, CloseButton } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import usePreviewImg from '../../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import useShowToast from '../../hooks/useShowToast'

const MAX_CHAR = 500

export default function CreatePost() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const[postText, setPostText] = useState('')
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()
    const imageRef = useRef(null)
    const [remChar,setRemChar] = useState(MAX_CHAR)
    const user = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [loading, setLoading] = useState(false)

    const handleTextChange = (e) => {
        const inputText = e.target.value

        if(inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemChar(0)
        } else {
            setPostText(inputText)
            setRemChar(MAX_CHAR - inputText.length)
        }
    }
    const handleCreatePost = async() => {
        setLoading(true)
        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl})
            })
            const data = await res.json()
            if(data.error) {
                showToast("Error",data.error,"error")
                return
            }
            showToast("Sucess","Post created successfully","success")
            onClose()   //To close the modal after creating post
            setPostText("")
            setImgUrl("")
        } catch (error) {
            showToast("Error",error,"error")
        } finally {
            setLoading(false)
        }
    }
    
    
  return (
    <>
        <Button 
            position={"fixed"}
            bottom={10}
            right={10}
            leftIcon={<AddIcon/>}
            bg={useColorModeValue("gray.300","gray.dark")}
            onClick={onOpen}
        >
        Post
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            <FormControl>
                <Textarea
                    value={postText}
                    placeholder='Post Content goes here...'
                    onChange={handleTextChange}
                />
                <Text 
                    fontSize="xs"
                    fontWeight={"bold"}
                    textAlign={"right"}
                    m={"1"}
                    color={"gray.800"}
                >{remChar}/{MAX_CHAR}</Text>
                <Input
                    type='file'
                    hidden
                    ref={imageRef}
                    onChange={handleImageChange}
                />
                <BsFillImageFill
                    style={{marginLeft: "5px", cursor: "pointer"}}
                    size={16}
                    onClick = {() => imageRef.current.click()}
                />

            </FormControl>

            {imgUrl && (
                <Flex mt={5} w={"full"} position={"relative"}>
                    <Image src={imgUrl} alt='Selected Img'/>
                    <CloseButton
                        onClick={() => setImgUrl("")}
                        bg={"gray.800"}
                        position={"absolute"}
                        top={2}
                        right={2}
                    />
                </Flex>
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
