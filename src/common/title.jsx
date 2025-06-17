const Title = ({ children, className, as = "h3" }) => {
  const Component = as
  return <Component className={`font-bold ${className}`}>{children}</Component>
}

export default Title;
