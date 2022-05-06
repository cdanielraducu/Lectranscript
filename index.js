/**
 * @format
 */

import React from "react";
import App from "./App";
import { store } from "./src/app/store";
import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";
import SettingsPage from "./src/components/SettingsPage";
import TrackPlayer from 'react-native-track-player';



const app = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// register the screens
Navigation.registerComponent("Index", () => app);
Navigation.registerComponent("SettingsPage", () => SettingsPage);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "Index",
            },
          },
        ],
      },
    },
  });
});

TrackPlayer.registerPlaybackService(() => require('./src/service'));
