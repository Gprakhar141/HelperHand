import { Button, Flex, Image, Link, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { AiFillHome } from 'react-icons/ai'
import { Link as RouterLink } from 'react-router-dom'
import { RxAvatar } from "react-icons/rx"
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../../hooks/useLogout'
import authScreenAtom from '../../atoms/authAtom'
import { BsChatQuoteFill } from 'react-icons/bs'

export default function Header() {
    const {colorMode,toggleColorMode} = useColorMode()
    const user = useRecoilValue(userAtom)
    const logout = useLogout()
    const setAuthScreen = useSetRecoilState(authScreenAtom)

    return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>

        {user && (
            <Link as={RouterLink} to="/">
                <AiFillHome size={24}/>
            </Link>
        )}

        {!user && (
            <Link as={RouterLink} to={"/auth"} onClick={()=> setAuthScreen('login')}>
                Login
            </Link>
        )}

        {/* <Image
            cursor={"pointer"}
            alt = 'logo'
            w={6}
            src = {colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
        /> */}
            <Flex cursor={"pointer"} onClick={toggleColorMode}>
                <Text ml={4} color={colorMode === "dark" ? "gray.200" : "gray.700"} fontWeight={"bold"} fontSize={"20px"} userSelect={"none"}>HelperHand</Text>
            </Flex>

        {user && (
            <Flex alignItems={"center"} gap={4}>
                <Link as={RouterLink} to={`/${user.username}`}>
                    <RxAvatar size={24}/>
                    </Link>
                <Link as={RouterLink} to={`/chat`}>
                    <BsChatQuoteFill size={20}/>
                </Link>
                <Button size={"xs"} onClick={logout}>
                    <FiLogOut size={20}/>
                </Button>
            </Flex>
        )}
        {!user && (
            <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('signup')}>
                Sign up
            </Link>
        )}

    </Flex>
  ) 
}
