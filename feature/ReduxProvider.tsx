'use client'

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import axios from "axios";



export interface IReduxProvider {
  children: ReactNode;
}
axios.defaults.withCredentials = true;
const ReduxProvider = ({ children }: IReduxProvider) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
