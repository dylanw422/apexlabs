import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { Flex, Text, Button, Image, Heading, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'

export default function Home() {
  const toast = useToast()
  const [username, setUsername] = useState('')
  const { data: session } = useSession()

  console.log(session)

  let params = {
    username: "Apex Labs",
    content: session ? `<@${session.user.id}>: ${username}` : username
  }

  async function sendWebhook(data) {
    await fetch('https://discord.com/api/webhooks/1096604937082896504/FfXiOJ6v3hnbZg68peoSb-6_iwn_Vg2OvAFcsjS5lkun-1iXUrm8ky2z5JZbdk5ICKnp', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  function handleSession() {
    if (!session) {
      toast({
        title: "You're not signed in.",
        description: "You must be signed in to submit your username",
        status: 'error',
        position: 'top'
      })
    } else {
      if (session.user.guild.roles.includes('1090105757271339198')) {
        sendWebhook(params)
        toast({
          title: "Success",
          description: "Our team is working on giving you access. Please be patient",
          status: 'success',
          position: 'top'
        })
        setUsername('')
      } else {
        toast({
          title: "Error",
          description: "You do not have the correct roles to do this.",
          status: 'error',
          position: 'top'
        })
      }
    }
  }
  
  return (
    <>
      <Head>
        <title>Apex Labs</title>
        <meta name="description" content="Revolutionary Trading Technology" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/apexlogo.png" />
      </Head>
        <Flex bgImage='url(/chart2.png)' bgRepeat='none' bgSize='cover' bgColor='black' h='100vh' w='100%' direction='column' align='center'>
          <Flex w='50%' h='8vh' align='center' justify='space-between'>
            <Image src='/apexlogo.png' boxSize={10} />
            { !session ? <Button onClick={() => signIn('discord')} bgColor='#5865f2' color='white' leftIcon={<Image src='/discord.png' boxSize={5}/>}>Sign In</Button> : <Button onClick={() => signOut()}>{session.user.name}</Button> }
          </Flex>
          <Flex h='76vh' direction='column' align='center' justify='center'>
            <Heading textAlign='center' color='white' fontSize='6vh'>Welcome to Apex</Heading>
            <InputGroup mt='5%'>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} color='white' pr='4.5rem' placeholder='TradingView Username'></Input>
              <InputRightElement w='4.5rem'>
                <Button borderRadius='0px 5px 5px 0px' fontSize='75%' onClick={handleSession}>Submit</Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
    </>
  )
}
