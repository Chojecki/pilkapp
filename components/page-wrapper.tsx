interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return <div className="min-h-screen  bg-gray-100 ">{children}</div>;
};

export default PageWrapper;
