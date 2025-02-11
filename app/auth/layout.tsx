interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="container h-screen flex justify-center items-center">
      {children}
    </div>
  );
}
