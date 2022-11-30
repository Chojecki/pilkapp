import { type AppType } from "next/dist/shared/lib/utils";
import { AuthContextProvider } from "../context/auth-context";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
};

export default MyApp;
