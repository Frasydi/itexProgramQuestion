import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import useAuth from "../hooks/auth";
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  
  const handleShowClick = () => setShowPassword(!showPassword);

  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const rout = useNavigate()

  async function login() {
    if(username.length == 0) return
    if(password.length == 0) return
    const result = await auth.login({username,password})
    if(result.error == true) {
      Swal.fire({
        title :"Error",
        text :result.message,
        icon :"error"
      })
      return
    }
    
    
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Selamat Datang Peserta ITEX</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={(ev) => {
            ev.preventDefault()
            login()
          }}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="text" value={username} onChange={(ev) => setUserName(ev.currentTarget.value)} placeholder="Username" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    onChange={(ev) => setPassword(ev.currentTarget.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    
    </Flex>
  );
};

export default Login;
