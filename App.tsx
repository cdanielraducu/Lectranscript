import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import HomePage from "./src/components/HomePage";
import AuthPage from "./src/components/AuthPage";

export type DocumentData = {
  [field: string]: any;
};

/**
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

  const [isLoading, setIsLoading] = useState(false);

  const onAuth = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuth);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {user ? (
            <HomePage
              user={user}
              setUser={setUser}
              setIsLoading={setIsLoading}
            />
          ) : (
            <AuthPage setIsLoading={setIsLoading} />
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
});

export default App;
