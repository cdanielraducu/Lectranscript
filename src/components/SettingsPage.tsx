import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Navigation, NavigationComponentProps } from "react-native-navigation";
import { Provider, useDispatch } from "react-redux";
import { logout } from "../app/profileSlice";
import auth from "@react-native-firebase/auth";
import { store } from "../app/store";
import { Modalize } from "react-native-modalize";

const SettingsPage: React.FC<NavigationComponentProps> = ({ componentId }) => {
  return (
    <Provider store={store}>
      <SettingsPageContainer componentId={componentId} />
    </Provider>
  );
};

const SettingsPageContainer: React.FC<NavigationComponentProps> = ({
  componentId,
}) => {
  const dispatch = useDispatch();

  const onClose = () => {
    Navigation.dismissOverlay(componentId);
  };

  const [newDisplayName, setNewDisplayName] = useState("");

  const renameModalizeRef = useRef<Modalize>(null);

  const onOpenRenameModal = () => {
    renameModalizeRef.current?.open();
  };

  const onCloseRenameModal = () => {
    renameModalizeRef.current?.close();
  };

  const renameModalize = () => (
    <Modalize
      HeaderComponent={
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Noul nume</Text>
        </View>
      }
      snapPoint={240}
      ref={renameModalizeRef}
    >
      <View style={styles.modalContentContainer}>
        <TextInput
          placeholder="Nume nou..."
          value={newDisplayName}
          onChangeText={setNewDisplayName}
          textAlign="left"
          autoCapitalize="none"
          style={styles.textInput}
        />

        <Pressable
          onPress={() => {
            auth()
              .currentUser?.updateProfile({ displayName: newDisplayName })
              .then(() => {
                onCloseRenameModal();
              })
              .catch((error) => {
                console.log(error);
              });
          }}
          style={styles.optionItem}
        >
          <Text>Redenumeste 🪆</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onCloseRenameModal();
          }}
          style={styles.optionItem}
        >
          <Text>Inchide modala ❌</Text>
        </Pressable>
      </View>
    </Modalize>
  );

  const onSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log("Signed out!");
        dispatch(logout());
        onClose();
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
          <Text style={styles.closeText}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionItemContainer}
          onPress={onOpenRenameModal}
        >
          <Text>Change display name 🖌</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionItemContainer}
          onPress={onSignOut}
        >
          <Text>Sign out 🚷</Text>
        </TouchableOpacity>
      </View>

      {renameModalize()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    width: "100%",
    position: "relative",
    paddingTop: 60,
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeContainer: {},
  closeText: {
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  optionsContainer: {
    paddingTop: 40,
  },
  optionItemContainer: {
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionItem: {
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 16,
    backgroundColor: "#eeeeee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
});

export default SettingsPage;
