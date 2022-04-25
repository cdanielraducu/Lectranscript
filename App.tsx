import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type DocumentData = {
  [field: string]: any;
};

/**
 * 

  const usersCollection = firestore()
    .collection("Users")
    .get()
    .then((doc) =>
      console.log(
        "--",
        doc.docs.map((doc: DocumentData) => doc._data)
      )
    );
 */

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isSignIn, setIsSignIn] = useState(true);

  const onAuth = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      setUser(user);
      console.log(user);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuth);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onSignUp = () => {
    setIsLoading(true);
    // creating the account
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-inuse") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid");
        }

        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const onSignIn = () => {
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("Signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          console.log("Password is invalid");
        }
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const onSignOut = () => {
    setIsLoading(true);

    auth()
      .signOut()
      .then(() => {
        console.log("Signed out!");
        setUser(undefined);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {user ? (
            <>
              <Text>Welcome {user.email}</Text>
              <Pressable onPress={onSignOut}>
                <Text>Sign Out</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.header}>
                {isSignIn ? "Sign In" : "Sign Up"}
              </Text>
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
                  <Text style={styles.switchAuthTypeText}>
                    or switch to Sign Up
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
  },
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

export default App;
