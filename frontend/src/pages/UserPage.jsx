import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

export default function UserPage() {
  return (
    <>
        <UserHeader/>
        <UserPost likes={5934} replies={67} postImg="/post1.png" postTitle="Let's talk about threads."/>
        <UserPost likes={453} replies={25} postImg="/post2.png" postTitle="Platform Testing"/>
        <UserPost likes={906} replies={98} postImg="/post3.png" postTitle="I love this guy."/>
        <UserPost likes={287} replies={77} postTitle="This is my first thread."/>
    </>
  )
}
