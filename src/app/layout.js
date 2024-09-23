import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { GlobalContextProvider } from "@/context/GlobalContextProvider";
import reducer, { initState } from "@/context/reducer";
import QueryProvider from "@/context/QueryProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KONNECT ADMIN",
  description: "Admin Panel of KONNECT App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#143642",
                // fontFamily: "Montserrat",
              },
              components: {
                Segmented: {
                  colorBgElevated: "#E4E835",
                },
              },
            }}
          >
            <GlobalContextProvider reducer={reducer} initialState={initState}>
              {children}
            </GlobalContextProvider>
          </ConfigProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
