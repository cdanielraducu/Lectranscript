import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import storage, { FirebaseStorageTypes } from "@react-native-firebase/storage";
import DocumentPicker from "react-native-document-picker";
import * as Progress from "react-native-progress";

interface HomePageProps {
  user: FirebaseAuthTypes.User;
  setUser: (user?: FirebaseAuthTypes.User) => void;
  setIsLoading: (val: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, setUser, setIsLoading }) => {
  const [registrations, setRegistrations] = useState<
    FirebaseStorageTypes.Reference[]
  >([]);

  const reference = useMemo(() => storage().ref(`${user?.uid}/original`), []);

  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const getRegistrations = () => {
    reference.listAll().then((res) => {
      setRegistrations(res.items);
    });
  };

  useEffect(() => {
    getRegistrations();
  }, [user]);

  const renderItem = ({
    item,
    index,
  }: {
    item: FirebaseStorageTypes.Reference;
    index: number;
  }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      key={`reg-${item}-${index}`}
      style={[
        styles.listItem,
        index % 2 === 0 ? styles.columnSpacing : undefined,
      ]}
      onPress={() => {
        item.getDownloadURL().then((res) => {
          Linking.openURL(res).catch((err) => console.error("Error", err));
        });
      }}
    >
      <Text numberOfLines={2} style={styles.listItemText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );



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

  const onAddVideo = async () => {
    await DocumentPicker.pickSingle().then((res) => {
      console.log(res.uri);

      const task = storage()
        .ref(`/o1ZWe1fQeuMDT4HvVP46sLJsQDK2/original/${res.name}`)
        .putFile(res.uri);

      task.on("state_changed", (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        );
        setFileUploadProgress(
          taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
        );
        getRegistrations();
      });

      task.then(() => {
        setFileUploadProgress(0);
      });
    });
  };

  return (
    <>
      <>
        <Text>Welcome {user.email}</Text>
        <TouchableOpacity
          onPress={onAddVideo}
          activeOpacity={0.5}
          style={styles.addButtonContainer}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
      </>

      <Progress.Bar
        progress={fileUploadProgress}
        color="black"
        unfilledColor="white"
        width={200}
        style={
          fileUploadProgress === 0
            ? styles.progressBarInvisible
            : styles.progressBarVisible
        }
      />
      <FlatList
        numColumns={2}
        style={styles.list}
        data={registrations}
        renderItem={renderItem}
      />
      <TouchableOpacity activeOpacity={0.5} onPress={onSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  list: { flexGrow: 0, height: "50%", width: "100%" },
  columnSpacing: { marginRight: 8 },
  listItem: {
    flex: 1 / 2,
    marginTop: 8,
    alignItems: "center",
    paddingTop: 12,
    backgroundColor: "#cecece",
    height: 100,
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  addButtonContainer: {
    backgroundColor: "#000",
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  addButtonText: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: "700",
    color: "#fff",
  },
  progressBarInvisible: {
    borderColor: "white",
  },
  progressBarVisible: {
    borderColor: "black",
  },
});

export default HomePage;
