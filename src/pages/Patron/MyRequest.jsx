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
  Badge,
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

const MyRequestCard = ({ title, description }) => {
  return (
    <Box mb={5}>
      <Text fontWeight="bold">
        {title}
        <Badge ml="1" colorScheme={"green"}>
          "Submitted"
        </Badge>
      </Text>
      <Text fontSize="sm">{description}</Text>
    </Box>
  );
};

export const MyRequest = (props) => {
  return (
    <Box w="500px" h="600">
      <Heading level={2}>My Request</Heading>
      <View margin="3rem 0">
        {props.data.map((note) => (
          <ChakraFlex
            key={note.id || note.name}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <MyRequestCard title={note.name} description={note.description} />
            {note.image && (
              <Image
                src={note.image}
                alt={`visual aid for ${note.name}`}
                style={{ width: 400 }}
              />
            )}
            <Button variation="link" onClick={() => props.function(note)}>
              Delete Request
            </Button>
          </ChakraFlex>
        ))}
      </View>
    </Box>
  );
};
