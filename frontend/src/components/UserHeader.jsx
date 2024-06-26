import { Avatar, Text, Box, Flex, VStack, useToast, Button, useColorMode } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgMoreO } from "react-icons/cg";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import useShowToast from "../../hooks/useShowToast";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";

export default function UserHeader({user}) {
    const toast = useToast()
    const currentUser = useRecoilValue(userAtom)  //User currently logged in
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user)
  const {colorMode} = useColorMode()

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: 'Account created.',
                status: 'success',
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true,
              })
        })
    }

    return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
           {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar 
              name={user.name} 
              src={user.profilePic}
              size={{base:"md",md:"xl"}} 
            />
          )}
          {!user.profilePic && (
            <Avatar 
              name={user.name} 
              src='https://bit.ly/broken-link'
              size={{base:"md",md:"xl"}} 
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to={"/update"}>
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
          <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
            {following? "Unfollow" : "Follow"}
          </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} Followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"} justifyContent={"center"} borderBottom={colorMode === "dark" ? "1.5px solid white" : "1.5px solid black"}>
        <Flex pb="3" cursor={"pointer"}>
          <Text fontWeight={"bold"}>Doubts</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}
