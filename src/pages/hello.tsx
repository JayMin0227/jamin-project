import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'


const inter = Inter({ subsets: ["latin"] });


export default function Hello() {
  return (
    <div>
      <p>Hello World!Hello World! jay</p>

      <Button colorScheme='blue'>Button</Button>
      
    </div>
 
    );
}
