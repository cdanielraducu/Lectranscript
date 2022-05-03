import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Navigation, NavigationComponentProps } from "react-native-navigation";
import { Provider, useDispatch } from "react-redux";
import { logout } from "../app/profileSlice";
import auth from "@react-native-firebase/auth";
import { store } from "../app/store";

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
        <TouchableOpacity style={styles.optionItemContainer}>
          <Text>Optiunea 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionItemContainer}
          onPress={onSignOut}
        >
          <Text>Sign out 🚷</Text>
        </TouchableOpacity>
      </View>
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
});

export default SettingsPage;
