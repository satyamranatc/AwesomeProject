import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ImageSourcePropType } from 'react-native';
import axios from 'axios';
interface Message {
  text: string;
  sender: 'user' | 'computer';
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const handleSend = async () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      setInputText('');
  
      try {
        const response = await axios.post("http://192.168.1.10:5200/invoke_llama", {
          text: inputText
        });
        
        if (response.data && response.data.result) {
          const computerResponse = `Response: ${response.data.result}`;
  
          setMessages([...messages, { text: computerResponse, sender: 'computer' }]);
        } else {
          console.error("Error: Invalid response format");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.computerMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Language Helper</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Chat With Chatbot</Text>
        <Image
          source={{
            uri: "https://png.pngtree.com/png-vector/20230918/ourmid/pngtree-man-in-shirt-smiles-and-gives-thumbs-up-to-show-approval-png-image\_10094392.png",
          }}
          style={styles.profileImage}
        />
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
  },
  header: {
    backgroundColor: '#ff6347', // Bright red
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6347', // Bright red
    padding: 10,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageListContainer: {
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#ff6347', // Bright red
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  computerMessage: {
    backgroundColor: 'grey', // Light gray
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#ff6347', // Bright red
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
