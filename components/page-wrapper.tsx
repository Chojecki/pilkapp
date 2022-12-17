import Head from "next/head";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <>
      <Head>
        <title>PiłkApp</title>
        <meta name="description" content="Appka do umawiania się na mecze" />
      </Head>
      <div className="flex p-10 flex-col justify-around items-center  place-items-center bg-gray-100 ">
        {children}
      </div>
    </>
  );
};

export default PageWrapper;
