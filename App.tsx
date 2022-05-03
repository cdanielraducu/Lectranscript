import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import HomePage from "./src/components/HomePage";
import AuthPage from "./src/components/AuthPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./src/app/store";
import { login } from "./src/app/profileSlice";

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

export interface User {
  email: string;
  uid: string;
  displayName: string;
}

export interface NavigationComponentProps {
  componentId: string;
}

const App: React.FC<NavigationComponentProps> = ({ componentId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loggedIn = useSelector((state: RootState) => state.profile.loggedIn);
  const dispatch = useDispatch();

  const onAuth = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      const ourUser = {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
      } as User;
      dispatch(login({ user: ourUser }));
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
          {loggedIn ? (
            <HomePage setIsLoading={setIsLoading} componentId={componentId} />
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
