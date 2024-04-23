import type { AppProps } from 'next/app'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ETS2LAMenubar } from "@/components/ets2la-menubar";
import { ETS2LACommandMenu } from '@/components/ets2la-command-menu';
import { GetIP } from "./server";
import { Toaster } from "@/components/ui/sonner"
import { Badge } from '@/components/ui/badge';
import { Unplug, Ellipsis } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import Loader from '@/components/ets2la-loader';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETS2LA - Euro Truck Simulator 2 Lane Assist",
  description: "",
  icons: ["favicon.ico"],
};
import { useState, useRef, useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [inputValue, setInputValue] = useState("localhost");
  const ipRef = useRef("localhost");

  const [showButton, setShowButton] = useState(false);
  const [status, setStatus] = useState("loading");

  const handleIpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setShowButton(event.target.value.length > 0);
  };

  const { data, error, isLoading, mutate } = useSWR(ipRef.current, () => GetIP(ipRef.current as string));

  useEffect(() => {
    if (isLoading && !error) {
      setStatus("isLoading");
      setShowButton(false);
    } else if (!isLoading && error) {
      setStatus("error");
    } else if (!isLoading && !error) {
      setStatus("success");
    }
  }, [isLoading, error]);

  const retry = () => {
    setShowButton(false);
    ipRef.current = inputValue;
    mutate(ipRef.current);
  };

  if (status == "isLoading") return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <div className='p-3'>
    <Card className="flex flex-col content-center text-center space-y-5 pb-0 h-[calc(100vh-27px)] overflow-auto rounded-t-md">
      <div className='flex flex-col space-y-5'>
        <div className='flex flex-col items-center space-y-5 justify-center h-[calc(100vh-100px)]'>
          <h1>ETS2LA</h1>
          <Loader className='w-6 h-6 animate-spin' />
        </div>
      </div>
    </Card>
    </div>
  </ThemeProvider>

  if (status == "error") return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <div className='p-3'>
    <Card className="flex flex-col content-center text-center space-y-5 pb-0 h-[calc(100vh-27px)] overflow-auto rounded-t-md">
      <div className='flex flex-col space-y-5'>
        <Badge variant={"destructive"} className='gap-1 rounded-b-none'><Unplug className='w-5 h-5' /> Lost connection to the server.</Badge>
        <div className='flex flex-col items-center space-y-5 justify-center h-[calc(100vh-180px)]'>
          <h1>ETS2LA</h1>
          <div className="flex flex-col sm:flex-row w-full max-w-sm items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input type="text" onChange={handleIpChange} placeholder="Local IP address of ETS2LA" className='w-[60vw] sm:w-full' />
            {showButton && <Button onClick={retry}>Connect</Button>}
          </div>
        </div>
      </div>
    </Card>
    </div>
  </ThemeProvider>
  
  let ip = ipRef.current;

  console.log(ip);

  // Add the ip to the pageProps
  const newPageProps = { ...pageProps, ip };

  return (
    <div className='overflow-hidden p-3'>
      <Head>
        <link rel="icon" href="https://wiki.tumppi066.fi/assets/favicon.ico" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ETS2LAMenubar ip={ip} />
        <div className='py-3'>
          <Component {...newPageProps} />
        </div>
        <ETS2LACommandMenu ip={ip} />
        <Toaster position='bottom-center'/>
      </ThemeProvider>
    </div>
  );
}