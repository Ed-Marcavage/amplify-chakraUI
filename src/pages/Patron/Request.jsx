import React, { useState, useEffect } from "react";
import "../../App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from "aws-amplify";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Input,
  Box,
  Flex as ChakraFlex,
  Heading as ChakraHeading,
  Button as ChakraButton,
} from "@chakra-ui/react";

import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  Image,
  View,
  withAuthenticator,
  useTheme,
} from "@aws-amplify/ui-react";
import { listNotes } from "../../graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../../graphql/mutations";

export const Request = (props) => {
  return (
    <Box as="form" margin="3rem 0" onSubmit={props.data} w="500px" h="600">
      <ChakraFlex
        direction="column
        "
        justifyContent="center"
        background={"gray"}
        p={"12"}
        rounded={20}
      >
        <ChakraHeading mb={6}>Request</ChakraHeading>
        <TextField
          name="name"
          placeholder="Artwork Title"
          label="Note Name"
          labelHidden
          variation="quiet"
          required
          color="teal"
        />
        <TextField
          name="description"
          placeholder="Art Description"
          label="Note Description"
          labelHidden
          variation="quiet"
          required
        />
        <Box
          borderStyle="solid"
          borderWidth="2px"
          rounded="md"
          shadow="sm"
          height={"20"}
        >
          <Box position="relative" height="100%" width="100%">
            <Box pl={"3"} pt="1.5" textAlign="start">
              <Text fontWeight="light" textColor={"GrayText"}>
                Drop example images here or click to upload
              </Text>
            </Box>
            <View
              name="image"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              as="input"
              type="file"
              style={{ alignSelf: "center" }}
              opacity="0"
            />
          </Box>
        </Box>
        <ChakraButton colorScheme={"teal"} type="submit" variation="menu">
          Create Request
        </ChakraButton>
      </ChakraFlex>
    </Box>
  );
};
