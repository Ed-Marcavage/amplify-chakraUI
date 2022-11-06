import React, { useState, useEffect } from "react";
import "./App.css";
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

import { Request } from "./pages/Patron/Request";
import { MyRequest } from "./pages/Patron/MyRequest";
import { useEthers } from "@usedapp/core";

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
import { listNotes, requestByAddress } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  updateNote as updateNoteMutation,
} from "./graphql/mutations";

const shortenAddress = (addr) => `${addr.slice(0, 5)}...${addr.slice(-4)}`;

const App = ({ signOut }) => {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const { tokens } = useTheme();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, [account]);

  async function fetchNotes() {
    let filter = {
      address: {
        eq: account, // filter priority = 13
      },
    };

    const apiData = await API.graphql({
      query: listNotes,
      variables: { filter: filter },
    });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        console.log(note);
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
      address: account,
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

  async function updateNote() {
    const todoDetails = {
      id: "64e0c1f1-50af-44c1-adee-748a983b13ab",
      description: "My updated description!",
    };

    const updatedTodo = await API.graphql({
      query: updateNoteMutation,
      variables: { input: todoDetails },
    });
  }

  let props = {
    data: notes,
    function: deleteNote,
  };

  return (
    <>
      <Heading>
        {!account
          ? "Please connect your wallet."
          : `Connected Wallet: ${shortenAddress(account)}`}
      </Heading>
      {!account ? (
        <Button
          className="button connect"
          onClick={() => activateBrowserWallet()}
        >
          Connect
        </Button>
      ) : (
        <Button className="button disconnect" onClick={() => deactivate()}>
          Disconnect
        </Button>
      )}
      <Box>
        <ChakraFlex height="100vh" alignItems="center" justifyContent="center">
          <ChakraFlex
            direction="column
        "
            justifyContent="center"
            background={"gray"}
            p={"12"}
            rounded={20}
          >
            <ChakraFlex ml={500}>
              {/* <Switch
            justifyItems="right"
            onChange={setIsPatron.toggle}
            colorScheme="teal"
          /> */}
            </ChakraFlex>
            <Tabs variant="soft-rounded">
              <TabList>
                {/* Trying to move this CSS to /theme  */}
                <Tab color="white" _selected={{ color: "white", bg: "teal" }}>
                  Request
                </Tab>
                <Tab color="white" _selected={{ color: "white", bg: "teal" }}>
                  My Requests
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Request data={createNote} />
                </TabPanel>
                <TabPanel>
                  <MyRequest {...props} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ChakraFlex>
          <Text>{account}</Text>
          <Button onClick={updateNote}>Update Note</Button>
        </ChakraFlex>
        <Button onClick={signOut}>Sign Out</Button>
      </Box>
    </>
  );
};

export default App;
