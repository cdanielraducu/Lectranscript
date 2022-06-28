import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthPageProps {
  setIsLoading: (val: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setIsLoading }) => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isSignIn, setIsSignIn] = useState(true);

  const onSignUp = () => {
    setIsLoading(true);
    // creating the account
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-inuse") {
          Alert.alert("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          Alert.alert("That email address is invalid");
        }

        Alert.alert(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const onSignIn = () => {
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          Alert.alert("Password is invalid");
        }
        Alert.alert(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Text style={styles.header}>{isSignIn ? "Sign In" : "Sign Up"}</Text>
      <View style={styles.inputsContainer}>
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          textContentType="emailAddress"
          textAlign="left"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.textInput}
        />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          textAlign="left"
          textContentType="password"
          secureTextEntry
          style={styles.textInput}
        />
      </View>
      <View style={styles.authActionsContainer}>
        {isSignIn ? (
          <Pressable style={styles.authButton} onPress={onSignIn}>
            <Text style={styles.authText}>Sign In</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.authButton} onPress={onSignUp}>
            <Text style={styles.authText}>Sign Up</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            setIsSignIn((prevState) => !prevState);
          }}
        >
          <Text style={styles.switchAuthTypeText}>or switch to Sign Up</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "700",
  },
  inputsContainer: {
    width: "100%",
  },
  textInput: {
    fontSize: 16,
    backgroundColor: "#eeeeee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  authButton: {
    backgroundColor: "#ececec",
    paddingHorizontal: 32,
    width: 160,
    paddingVertical: 16,
    borderRadius: 100,
    marginBottom: 16,
  },
  authText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  switchAuthTypeText: {
    fontSize: 12,
    color: "#777",
  },
  authActionsContainer: {
    alignItems: "center",
  },
});

export default AuthPage;
