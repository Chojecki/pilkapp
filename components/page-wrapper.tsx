interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="flex p-0 md:p-10 min-h-screen flex-col justify-start items-center  place-items-center bg-gray-100 ">
      {children}
    </div>
  );
};

export default PageWrapper;
