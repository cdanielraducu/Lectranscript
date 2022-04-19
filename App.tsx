import React from "react";
import { StyleSheet, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";

export type DocumentData = {
  [field: string]: any;
};

const App: React.FC = () => {
  const usersCollection = firestore()
    .collection("Users")
    .get()
    .then((doc) =>
      console.log(
        "--",
        doc.docs.map((doc: DocumentData) => doc._data)
      )
    );

  return (
    <View style={styles.container}>
      <Text>aa</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
