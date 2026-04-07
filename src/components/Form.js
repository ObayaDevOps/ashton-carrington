"use client"

import { Button, Field, Input, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useState } from "react";

export default function Form ({ buttonPosition='absolute' }){
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const onSubmit = async (data) => {
    console.log("Form data is valid:", data);
    setShowSuccessMessage(false);
    setApiErrorMessage("");

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok && payload?.ok) {
        console.log("Form submitted successfully!", payload);
        setShowSuccessMessage(true);
        setApiErrorMessage("");
        reset();
        return;
      }

      const serverError = payload?.error || "UNKNOWN_ERROR";
      console.error("Form submission failed:", res.status, serverError, payload);

      if (serverError === "VALIDATION_ERROR") {
        setApiErrorMessage("Please fill in all required fields correctly.");
      } else if (serverError === "SERVER_CONFIG_ERROR") {
        setApiErrorMessage("The contact service is not configured. Please try again later.");
      } else if (serverError === "EMAIL_SEND_FAILED") {
        setApiErrorMessage("Your message could not be sent right now. Please try again shortly.");
      } else {
        setApiErrorMessage("Something went wrong while sending your message. Please try again.");
      }

      setShowSuccessMessage(false);
    } catch (error) {
      console.error("An error occurred during submission:", error);
      setShowSuccessMessage(false);
      setApiErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  const onInvalid = (validationErrors) => {
    console.log("Validation Errors:", validationErrors);
    setShowSuccessMessage(false);
    setApiErrorMessage("");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <Stack gap="4" align="flex-start" width="full" pt={6}>
        <Field.Root invalid={!!errors.name} width="full">
          <Field.Label>
            <Text
              fontFamily='Poppins'
              fontSize='0.75rem'
              lineHeight='normal'
              fontWeight='400'
              fontStyle='normal'
              color='#CCCED1'
            >
              Name
            </Text>
          </Field.Label>
          <Input
            {...register("name", {
              required: "Name is required"
            })}
            placeholder='John Appleseed'
            fontFamily='Poppins'
            fontSize={'0.875rem'}
            color='white'
            borderColor={errors.name ? 'red.500' : undefined}
            _focus={{ borderColor: errors.name ? 'red.500' : '#00DEE3' }}
          />
          <Field.ErrorText color="red.400" fontSize="0.75rem">{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email} width="full">
          <Field.Label>
            <Text
              fontFamily='Poppins'
              fontSize='0.75rem'
              lineHeight='normal'
              fontWeight='400'
              fontStyle='normal'
              color='#CCCED1'
            >
              Email
            </Text>
          </Field.Label>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            color='white'
            type="email"
            placeholder='john.appleseed@ac.co.uk'
            fontFamily='Poppins'
            fontSize={'0.875rem'}
            borderColor={errors.email ? 'red.500' : undefined}
            _focus={{ borderColor: errors.email ? 'red.500' : '#00DEE3' }}
          />
          <Field.ErrorText color="red.400" fontSize="0.75rem">{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.phoneNumber} width="full">
          <Field.Label>
            <Text
              fontFamily='Poppins'
              fontSize='0.75rem'
              lineHeight='normal'
              fontWeight='400'
              fontStyle='normal'
              color='#CCCED1'
            >
              Phone Number
            </Text>
          </Field.Label>
          <Input
            {...register("phoneNumber", {
              required: "Phone number is required"
            })}
            color='white'
            placeholder='+447123456789'
            fontFamily='Poppins'
            fontSize={'0.875rem'}
            borderColor={errors.phoneNumber ? 'red.500' : undefined}
            _focus={{ borderColor: errors.phoneNumber ? 'red.500' : '#00DEE3' }}
          />
          <Field.ErrorText color="red.400" fontSize="0.75rem">{errors.phoneNumber?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.userMessage} width="full">
          <Field.Label>
            <Text
              fontFamily='Poppins'
              fontSize='0.75rem'
              lineHeight='normal'
              fontWeight='400'
              fontStyle='normal'
              color='#CCCED1'
            >
              Message
            </Text>
          </Field.Label>
          <Input
            {...register("userMessage", {
              required: "Message is required"
            })}
            placeholder='Leave your message here...'
            fontFamily='Poppins'
            fontSize={'0.875rem'}
            color='white'
            borderColor={errors.userMessage ? 'red.500' : undefined}
            _focus={{ borderColor: errors.userMessage ? 'red.500' : '#00DEE3' }}
          />
          <Field.ErrorText color="red.400" fontSize="0.75rem">{errors.userMessage?.message}</Field.ErrorText>
        </Field.Root>

        {Object.keys(errors).length > 0 && !showSuccessMessage && (
          <Text
            color="#DB3E00"
            fontFamily="Poppins"
            fontSize="0.75rem"
            fontWeight="400"
            width="full"
            textAlign="right"
            mt={2}
            mb={'-2rem'}
          >
            Please fill in all details and message.
          </Text>
        )}

        {apiErrorMessage && !showSuccessMessage && (
          <Text
            color="#DB3E00"
            fontFamily="Poppins"
            fontSize="0.75rem"
            fontWeight="400"
            width="full"
            textAlign="right"
            mt={2}
            mb={'-2rem'}
          >
            {apiErrorMessage}
          </Text>
        )}

        {showSuccessMessage && (
          <Text
            color="green.400"
            fontFamily="Poppins"
            fontSize="0.75rem"
            fontWeight="400"
            width="full"
            textAlign="right"
            mt={2}
            mb={'-2rem'}
          >
            Message sent successfully!
          </Text>
        )}

        <Button
          type="submit"
          variant={'outline'}
          bgColor={'#00DEE3'}
          borderColor={'#00DEE3'}
          _hover={{ bg: 'rgba(0, 222, 227, 0.1)', color: '#00DEE3' }}
          fontFamily="Poppins"
          fontWeight={500}
          position={buttonPosition}
          right={0}
          bottom={0}
          mb={'1.5rem'}
          mr={'2rem'}
          isLoading={isSubmitting}
          mt={4}
        >
          Send Message
        </Button>
      </Stack>
    </form>
  )
}
