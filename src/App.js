import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from "aws-amplify";
import {
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
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const { tokens } = useTheme();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <VStack>
      <Box as="form" margin="3rem 0" onSubmit={createNote} w="500px" h="600">
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
      <Heading level={2}>My Request</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.description}</Text>
            {note.image && (
              <Image
                src={note.image}
                alt={`visual aid for ${notes.name}`}
                style={{ width: 400 }}
              />
            )}
            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete Request
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </VStack>
  );
};

export default withAuthenticator(App);
