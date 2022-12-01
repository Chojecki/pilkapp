interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="flex p-10 flex-col justify-around items-center  place-items-center bg-gray-100 dark:bg-gray-700">
      {children}
    </div>
  );
};

export default PageWrapper;
