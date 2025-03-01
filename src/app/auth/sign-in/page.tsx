"use client"

import { Button, Card, Center, Input, Icon, Flex, VStack, Text, Separator } from '@chakra-ui/react';
import { Field } from "@/components/ui/field";
import { useSignIn } from '@clerk/nextjs';
import { toaster } from '@/components/ui/toaster';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => mod.Toaster), { ssr: false });

interface SignInFormInputs {
  email: string;
  password: string;
}

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>();

  const handleSignIn = async (data: SignInFormInputs) => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({ identifier: data.email, password: data.password });
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(signInAttempt);
      }
      toaster.create({
        title: "Sign in successful.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Sign in failed.",
        description: 'Invalid email or password.',
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/auth/sign-in/sso-callback',
        redirectUrlComplete: '/dashboard'
      });
      // toaster.create({
      //   title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign in successful.`,
      //   type: "success",
      //   duration: 3000,
      // });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Social sign in failed.",
        description: error as string,
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Center minH={'100vh'}>
      <Toaster />
      <Card.Root w={{ base: '90%', md: '60%', lg: '30%' }}>
        <Card.Body spaceY={4}>
          <Flex as='form' flexDir={'column'} onSubmit={handleSubmit(handleSignIn)} gap={4}>
            <Field invalid={!!errors.email} label="Email" errorText={errors.email?.message}>
              <Input
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
              />
            </Field>
            <Field invalid={!!errors.password} label="Password" errorText={errors.password?.message}>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
            </Field>
            <Button w="full" variant={"outline"} mt={4} type="submit" loading={!isLoaded}>
              Sign In
            </Button>
          </Flex>
          <Flex alignItems={'center'} justifyContent={'center'} gap={2}>
            <Separator flex="1" />
            <Text textAlign={'center'} color={'gray.500'} fontSize={'sm'}>OR</Text>
            <Separator flex="1" />
          </Flex>
          <VStack mt={4} w='full'>
            <Button
              w="full"
              colorPalette={"blue"}
              onClick={() => handleSocialSignIn('facebook')}
            >
              <Flex alignItems={'center'} gap={2}>
                <Icon as={FaFacebook} />
                Continue with Facebook
              </Flex>
            </Button>
            <Button
              w="full"
              colorPalette={"white"}
              variant={"outline"}
              onClick={() => handleSocialSignIn('google')}
            >
              <Flex alignItems={'center'} gap={2}>
                <Icon as={FcGoogle} />
                Continue with Google
              </Flex>
            </Button>
            <Button
              w="full"
              colorScheme="twitter"
              onClick={() => handleSocialSignIn('apple')}
            >
              <Flex alignItems={'center'} gap={2}>
                <Icon as={FaApple} />
                Continue with Apple
              </Flex>
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Center>
  );
}
