import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast'

export default function UserPage() {
  const [user, setUser] = useState(null);
  const { username } = useParams()
  const showToast = useShowToast()

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json()
        if(data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setUser(data)
      } catch (error) {
        showToast("Error", data.error, "error")
      }
    }
    getUser()
  }, [username, showToast])

  if(!user) return null

  return (
    <>
        <UserHeader user={user}/>
        <UserPost likes={5934} replies={67} postImg="/post1.png" postTitle="Let's talk about threads."/>
        <UserPost likes={453} replies={25} postImg="/post2.png" postTitle="Platform Testing"/>
        <UserPost likes={906} replies={98} postImg="/post3.png" postTitle="I love this guy."/>
        <UserPost likes={287} replies={77} postTitle="This is my first thread."/>
    </>
  )
}
